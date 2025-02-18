package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.*;
import progym2004.backend.repository.ExerciseRepository;
import progym2004.backend.repository.ExerciseTrainingDayRepository;
import progym2004.backend.repository.TrainingDayRepository;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TrainingGenerator {

    private final ExerciseRepository exerciseRepository;
    private final TrainingDayRepository trainingDayRepository;
    private final ExerciseTrainingDayRepository exerciseTrainingDayRepository;

    @Autowired
    public TrainingGenerator(ExerciseRepository exerciseRepository, TrainingDayRepository trainingDayRepository, ExerciseTrainingDayRepository exerciseTrainingDayRepository) {
        this.exerciseRepository = exerciseRepository;
        this.trainingDayRepository = trainingDayRepository;
        this.exerciseTrainingDayRepository = exerciseTrainingDayRepository;
    }

    public void regenerateTrainingProgram(User user, LocalDate trainingStartDate) {
        int availableDaysPerWeek = user.getAvailableDays();
        LocalDate startDate = trainingStartDate;
        LocalDate endDate = startDate.plusMonths(1);

        // Удаляем все существующие тренировочные дни пользователя в этом периоде
        trainingDayRepository.deleteAllByUserAndTrainingDateGreaterThanEqual(user, LocalDate.now());

        List<Integer> trainingDaysOfWeek = calculateTrainingDaysOfWeek(availableDaysPerWeek, trainingStartDate);
        int exercisesPerTraining = calculateExercisesPerTraining(user.getFitnessLevel(), user.getAvailableDays());

        // Получаем список всех мышечных групп
        List<MuscleGroup> allMuscleGroups = Arrays.stream(MuscleGroup.values())
                .filter(mg -> mg != MuscleGroup.CARDIO)
                .toList();

        // Считаем, сколько мышечных групп должно быть в каждой тренировке
        int muscleGroupsPerTraining = Math.max(1, allMuscleGroups.size() / availableDaysPerWeek);

        int trainingDayCount = 0;
        List<MuscleGroup> weeklyMuscleGroups = new ArrayList<>(allMuscleGroups); // Копируем список

        while (startDate.isBefore(endDate)) {
            if (trainingDaysOfWeek.contains(startDate.getDayOfWeek().getValue())) {
                if (trainingDayCount < availableDaysPerWeek) {
                    // Берем нужное количество мышечных групп
                    List<MuscleGroup> selectedMuscleGroups = weeklyMuscleGroups
                            .subList(0, Math.min(muscleGroupsPerTraining, weeklyMuscleGroups.size()));

                    // Создаем тренировочный день с выбранными мышечными группами
                    TrainingDay trainingDay = generateTrainingDay(user, startDate, exercisesPerTraining, selectedMuscleGroups);
                    trainingDayRepository.save(trainingDay);

                    trainingDayCount++;

                    // Удаляем использованные группы, чтобы в следующий раз взять новые
                    weeklyMuscleGroups.removeAll(selectedMuscleGroups);

                    // Если прошла неделя, сбрасываем список мышечных групп
                    if (trainingDayCount >= availableDaysPerWeek) {
                        trainingDayCount = 0;
                        weeklyMuscleGroups = new ArrayList<>(allMuscleGroups); // Сбрасываем список
                    }
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

    private TrainingDay generateTrainingDay(User user, LocalDate trainingDate, int exercisesPerTraining, List<MuscleGroup> targetMuscleGroups) {
        TrainingDay trainingDay = trainingDayRepository.save(new TrainingDay(user, trainingDate));
        Goal goal = user.getGoal();

        // Получаем все возможные упражнения для пользователя
        List<Exercise> availableExercises = exerciseRepository.findAll();
        Collections.shuffle(availableExercises); // Перемешиваем список случайным образом

        // Отбираем упражнения только из переданных групп и исключаем CARDIO
        List<Exercise> exercisesWithMuscleGroups = availableExercises.stream()
                .filter(ex -> targetMuscleGroups.contains(ex.getMuscleGroup()))
                .collect(Collectors.toList());

        int numberInTraining = 0;

        // Кардио в начале
        saveExerciseAndGenerateRepetitionsAndSets(selectCardioExercise(availableExercises), trainingDay, numberInTraining, user.getFitnessLevel(), goal);
        numberInTraining++;

        // Добавляем упражнения так, чтобы задействовать максимум разных групп мышц
        Set<MuscleGroup> usedMuscleGroups = new HashSet<>();
        Iterator<Exercise> iterator = exercisesWithMuscleGroups.iterator();

        while (iterator.hasNext() && numberInTraining < exercisesPerTraining - 1) {
            Exercise exercise = iterator.next();
            if (usedMuscleGroups.add(exercise.getMuscleGroup())) { // Добавляем, если этой группы мышц еще не было
                saveExerciseAndGenerateRepetitionsAndSets(exercise, trainingDay, numberInTraining, user.getFitnessLevel(), goal);
                numberInTraining++;
                iterator.remove(); // Удаляем использованное упражнение
            }
        }

        // Если осталось место, заполняем случайными упражнениями из той же группы
        while (numberInTraining < exercisesPerTraining - 1 && !exercisesWithMuscleGroups.isEmpty()) {
            saveExerciseAndGenerateRepetitionsAndSets(exercisesWithMuscleGroups.remove(0), trainingDay, numberInTraining, user.getFitnessLevel(), goal);
            numberInTraining++;
        }

        // Добавляем кардио в конце, если цель позволяет
        if ((goal == Goal.MAINTENANCE || goal == Goal.WEIGHT_LOSS) && exercisesPerTraining >= 4) {
            saveExerciseAndGenerateRepetitionsAndSets(selectCardioExercise(availableExercises), trainingDay, numberInTraining, user.getFitnessLevel(), goal);
        }

        return trainingDay;
    }

    // Метод для выбора случайного упражнения по указанной группе мышц
    private Exercise selectCardioExercise(List<Exercise> exercises) {
        List<Exercise> filteredExercises = exercises.stream()
                .filter(ex -> ex.getMuscleGroup() == MuscleGroup.CARDIO)
                .toList();
        return filteredExercises.isEmpty() ? null : filteredExercises.get(new Random().nextInt(filteredExercises.size()));
    }

    private void saveExerciseAndGenerateRepetitionsAndSets(Exercise exercise, TrainingDay trainingDay, int numberInTraining, Integer fitnessLevel, Goal goal) {
        Integer sets = fitnessLevel == 1 ? 3 : 4;
        if (exercise.getRecommendedRepetitions() != null) {
            exerciseTrainingDayRepository.save(new ExerciseTrainingDay(trainingDay, exercise, numberInTraining, sets, exercise.getRecommendedRepetitions()));
        } else {
            Integer repetitions = switch (goal) {
                case MUSCLE_GAIN -> 10;
                case MAINTENANCE -> 12;
                case WEIGHT_LOSS -> 15;
            };
            exerciseTrainingDayRepository.save(new ExerciseTrainingDay(trainingDay, exercise, numberInTraining, sets, repetitions));
        }
    }

    private static int calculateExercisesPerTraining(int exp, int days) {
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
