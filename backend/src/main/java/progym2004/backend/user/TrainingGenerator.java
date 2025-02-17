package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.*;
import progym2004.backend.repository.ExerciseRepository;
import progym2004.backend.repository.TrainingDayRepository;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrainingGenerator {

    @Autowired
    private ExerciseRepository exerciseRepository;  // Репозиторий для упражнений

    @Autowired
    private TrainingDayRepository trainingDayRepository;  // Репозиторий для тренировочных дней

    public void generateTrainingProgram(User user, LocalDate trainingStartDate) {
        int availableDaysPerWeek = user.getAvailableDays();

        // Генерируем тренировочные дни для следующего месяца
        LocalDate startDate = trainingStartDate;  // День начала тренировок
        LocalDate endDate = startDate.plusMonths(1);  // Конец месяца

        List<Integer> trainingDaysOfWeek = calculateTrainingDaysOfWeek(availableDaysPerWeek, trainingStartDate);
        int exercisesPerTraining = calculateExercisesPerTraining(user.getFitnessLevel(), user.getAvailableDays());

        int trainingDayCount = 0;

        while (startDate.isBefore(endDate)) {
            // Проверяем, попадает ли текущий день в список доступных дней недели
            if (trainingDaysOfWeek.contains(startDate.getDayOfWeek().getValue())) {
                // Если да, создаем тренировочный день
                if (trainingDayCount < availableDaysPerWeek) {
                    TrainingDay trainingDay = generateTrainingDay(user, startDate, exercisesPerTraining);
                    trainingDayRepository.save(trainingDay);
                    trainingDayCount++;
                }
            }
            startDate = startDate.plusDays(1);
        }
    }

    private List<Integer> calculateTrainingDaysOfWeek(int availableDaysPerWeek, LocalDate trainingStartDate) {
        List<Integer> trainingDaysOfWeek = new ArrayList<>();

        // День недели начала тренировок
        int startDayOfWeek = trainingStartDate.getDayOfWeek().getValue();

        // Конфигурации для разных дней недели (с учетом доступных дней)
        switch (availableDaysPerWeek) {
            case 1:
                // Если один день в неделю, тренировка только в день начала
                trainingDaysOfWeek.add(startDayOfWeek);
                break;

            case 2:
                // Если два дня в неделю, тренировка в день начала и через 3 дня
                trainingDaysOfWeek.add(startDayOfWeek);
                trainingDaysOfWeek.add((startDayOfWeek + 3) % 7 == 0 ? 7 : (startDayOfWeek + 3) % 7);
                break;

            case 3:
                // Если три дня в неделю, тренировка в день начала, через 2 и через 4 дня
                trainingDaysOfWeek.add(startDayOfWeek);
                trainingDaysOfWeek.add((startDayOfWeek + 2) % 7 == 0 ? 7 : (startDayOfWeek + 2) % 7);
                trainingDaysOfWeek.add((startDayOfWeek + 4) % 7 == 0 ? 7 : (startDayOfWeek + 4) % 7);
                break;

            case 4:
                // Если четыре дня в неделю, тренировка в день начала, через 2, 4 и 6 дней
                trainingDaysOfWeek.add(startDayOfWeek);
                trainingDaysOfWeek.add((startDayOfWeek + 2) % 7 == 0 ? 7 : (startDayOfWeek + 2) % 7);
                trainingDaysOfWeek.add((startDayOfWeek + 4) % 7 == 0 ? 7 : (startDayOfWeek + 4) % 7);
                trainingDaysOfWeek.add((startDayOfWeek + 6) % 7 == 0 ? 7 : (startDayOfWeek + 6) % 7);
                break;

            case 5:
                // Если пять дней в неделю, тренировка через день, начиная с дня начала
                for (int i = 0; i < 5; i++) {
                    trainingDaysOfWeek.add((startDayOfWeek + i * 1) % 7 == 0 ? 7 : (startDayOfWeek + i * 1) % 7);
                }
                break;

            case 6:
                // Если шесть дней в неделю, тренировка каждый день, кроме одного
                for (int i = 0; i < 6; i++) {
                    trainingDaysOfWeek.add((startDayOfWeek + i * 1) % 7 == 0 ? 7 : (startDayOfWeek + i * 1) % 7);
                }
                break;

            case 7:
                // Если семь дней в неделю, тренировка каждый день
                for (int i = 0; i < 7; i++) {
                    trainingDaysOfWeek.add((startDayOfWeek + i) % 7 == 0 ? 7 : (startDayOfWeek + i) % 7);
                }
                break;

            default:
                // Для всех других случаев выбрасываем исключение или возвращаем пустой список
                throw new IllegalArgumentException("Invalid number of available days per week: " + availableDaysPerWeek);
        }

        return trainingDaysOfWeek;
    }

    private TrainingDay generateTrainingDay(User user, LocalDate trainingDate, int exercisesPerTraining) {
        TrainingDay trainingDay = new TrainingDay();
        trainingDay.setUser(user);
        trainingDay.setTrainingDate(trainingDate);

        Goal goal = user.getGoal();
        Set<Exercise> selectedExercises = new LinkedHashSet<>();

        // Получаем все возможные упражнения для пользователя
        List<Exercise> availableExercises = exerciseRepository.findAll();
        Collections.shuffle(availableExercises); // Перемешиваем список случайным образом

        // Отбираем упражнения, исключая CARDIO
        List<Exercise> nonCardioExercises = availableExercises.stream()
                .filter(ex -> ex.getMuscleGroup() != MuscleGroup.CARDIO)
                .collect(Collectors.toList());

        // Кардио в начале
        selectedExercises.add(selectCardioExercise(availableExercises));

        // Добавляем упражнения так, чтобы задействовать максимум разных групп мышц за неделю
        Set<MuscleGroup> usedMuscleGroups = new HashSet<>();
        for (Exercise exercise : nonCardioExercises) {
            if (selectedExercises.size() >= exercisesPerTraining - 1) break; // -1, так как кардио уже добавлено
            if (usedMuscleGroups.add(exercise.getMuscleGroup())) { // Добавляем, если этой группы мышц еще не было
                selectedExercises.add(exercise);
            }
        }

        // Если осталось место, заполняем случайными упражнениями
        while (selectedExercises.size() < exercisesPerTraining - 1 && !nonCardioExercises.isEmpty()) {
            selectedExercises.add(nonCardioExercises.remove(0));
        }

        // Если условия выполняются, добавляем кардио-тренировку в конце
        if ((goal == Goal.MAINTENANCE || goal == Goal.WEIGHT_LOSS) && exercisesPerTraining >= 4) {
            selectedExercises.add(selectCardioExercise(availableExercises));
        }

        trainingDay.setExercises(selectedExercises);
        return trainingDay;
    }

    // Метод для выбора случайного упражнения по указанной группе мышц
    private Exercise selectCardioExercise(List<Exercise> exercises) {
        List<Exercise> filteredExercises = exercises.stream()
                .filter(ex -> ex.getMuscleGroup() == MuscleGroup.CARDIO)
                .toList();
        return filteredExercises.isEmpty() ? null : filteredExercises.get(new Random().nextInt(filteredExercises.size()));
    }


    public static int calculateExercisesPerTraining(int exp, int days) {
        switch (exp) {
            case 1:
                if (days <= 3) {
                    return 4;
                } else {
                    return 3;
                }
            case 2:
                if (days <= 3) {
                    return 5;
                } else {
                    return 4;
                }
            case 3:
                if (days <= 2) {
                    return 7;
                } else if (days <= 5) {
                    return 6;
                } else {
                    return 5;
                }
            default:
                throw new IllegalArgumentException("Error occurred in calculateExercisesPerTraining");
        }
    }
}
