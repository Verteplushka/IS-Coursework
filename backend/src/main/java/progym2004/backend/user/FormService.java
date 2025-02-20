package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.*;
import progym2004.backend.mapper.ExerciseMapper;
import progym2004.backend.mapper.MealMapper;
import progym2004.backend.repository.*;

import java.time.Clock;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FormService {
    private final Clock clock;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AllergyRepository allergyRepository;
    private final WeightJournalRepository weightJournalRepository;
    private final DietGenerator dietGenerator;
    private final DietDayUserRepository dietDayUserRepository;
    private final MealDietDayAdminRepository mealDietDayAdminRepository;
    private final TrainingGenerator trainingGenerator;
    private final TrainingDayRepository trainingDayRepository;
    private final ExerciseTrainingDayRepository exerciseTrainingDayRepository;
    private final int daysBeforeProgramEnds = 7;

    @Autowired
    public FormService(Clock clock, JwtService jwtService,
                       UserRepository userRepository,
                       AllergyRepository allergyRepository,
                       WeightJournalRepository weightJournalRepository,
                       DietGenerator dietGenerator,
                       DietDayUserRepository dietDayUserRepository,
                       MealDietDayAdminRepository mealDietDayAdminRepository,
                       TrainingGenerator trainingGenerator,
                       TrainingDayRepository trainingDayRepository, ExerciseTrainingDayRepository exerciseTrainingDayRepository) {
        this.clock = clock;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.allergyRepository = allergyRepository;
        this.weightJournalRepository = weightJournalRepository;
        this.dietGenerator = dietGenerator;
        this.dietDayUserRepository = dietDayUserRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
        this.trainingGenerator = trainingGenerator;
        this.trainingDayRepository = trainingDayRepository;
        this.exerciseTrainingDayRepository = exerciseTrainingDayRepository;
    }

    public UserParamsResponse getUserParams(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));
        WeightJournal weightJournal = weightJournalRepository.findTopByUserOrderByIdDesc(user);
        Double weight = weightJournal == null ? null : weightJournal.getWeight();
        Set<Long> allergyIds = user.getAllergies().stream()
                .map(Allergy::getId)
                .collect(Collectors.toSet());
        LocalDate lastTrainingDate = trainingDayRepository.findTopByUserOrderByTrainingDateDesc(user).getTrainingDate();
        boolean isEndingSoon = lastTrainingDate.equals(LocalDate.now(clock));

        return new UserParamsResponse(user.getBirthDate(), user.getGender(), user.getHeight(), weight, user.getGoal(), user.getFitnessLevel(), user.getActivityLevel(), user.getAvailableDays(), allergyIds, user.getStartTraining(), isEndingSoon);
    }

    @Transactional
    public FormUpdateStatus sendForm(FormRequest formRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        User userFromBD = new User(user);

        try {
            user.setBirthDate(formRequest.getBirthDate());
            user.setGender(formRequest.getGender());
            user.setHeight(formRequest.getHeight());
            user.setGoal(formRequest.getGoal());
            user.setFitnessLevel(formRequest.getFitnessLevel());
            user.setActivityLevel(formRequest.getActivityLevel());
            user.setAvailableDays(formRequest.getAvailableDays());
            Set<Allergy> allergies = new HashSet<>(allergyRepository.findAllById(formRequest.getAllergiesIds()));
            user.setAllergies(allergies);
            user.setStartTraining(formRequest.getStartTraining());
            user.setDietPreference(formRequest.getDietPreference());

            WeightJournal prevWeight = weightJournalRepository.findTopByUserOrderByIdDesc(user);
            LocalDate startDate = formRequest.getStartTraining().isBefore(LocalDate.now(clock)) ? LocalDate.now(clock) : formRequest.getStartTraining();

            if (user.getAvailableDays().equals(userFromBD.getAvailableDays())
                    && user.getFitnessLevel().equals(userFromBD.getFitnessLevel())
                    && user.getGoal().equals(userFromBD.getGoal())
                    && user.getStartTraining().equals(userFromBD.getStartTraining())) {
                if (prevWeight != null) {
                    if (prevWeight.getWeight().equals(formRequest.getCurrentWeight())
                            && user.getGender().equals(userFromBD.getGender())
                            && user.getHeight().equals(userFromBD.getHeight())
                            && user.getActivityLevel().equals(userFromBD.getActivityLevel())
                            && user.getAllergies().equals(userFromBD.getAllergies())
                            && user.getDietPreference().equals(userFromBD.getDietPreference())) {
                        return FormUpdateStatus.NO_CHANGES;
                    }
                }
                user = userRepository.save(user);
                weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight(), LocalDate.now(clock)));
                dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
                return FormUpdateStatus.UPDATED_DIET;

            } else if (!user.getGoal().equals(userFromBD.getGoal())) {
                user = userRepository.save(user);
                weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight(), LocalDate.now(clock)));
                dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
                trainingGenerator.regenerateTrainingProgram(user, startDate);
                return FormUpdateStatus.UPDATED_ALL;
            } else if (prevWeight != null) {
                if (prevWeight.getWeight().equals(formRequest.getCurrentWeight())
                        && user.getGender().equals(userFromBD.getGender())
                        && user.getHeight().equals(userFromBD.getHeight())
                        && user.getActivityLevel().equals(userFromBD.getActivityLevel())
                        && user.getAllergies().equals(userFromBD.getAllergies())
                        && user.getDietPreference().equals(userFromBD.getDietPreference())) {
                    user = userRepository.save(user);
                    trainingGenerator.regenerateTrainingProgram(user, startDate);
                    return FormUpdateStatus.UPDATED_TRAINING;
                }
            }

            user = userRepository.save(user);
            weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight(), LocalDate.now(clock)));
            dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
            trainingGenerator.regenerateTrainingProgram(user, startDate);
            return FormUpdateStatus.UPDATED_ALL;
        } catch (Exception e) {
            e.printStackTrace();
            return FormUpdateStatus.ERROR;
        }
    }

    public boolean completeTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now(clock));
        if (trainingDay == null) {
            return false;
        }
        trainingDay.setIsCompleted(true);
        trainingDayRepository.save(trainingDay);
        return true;
    }

    public boolean uncompleteTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now(clock));
        if (trainingDay == null) {
            return false;
        }
        trainingDay.setIsCompleted(false);
        trainingDayRepository.save(trainingDay);
        return true;
    }

    public DietResponse getTodayDiet(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        DietDayUser foundDietDayUser = dietDayUserRepository.findDietDayUserByDayDateAndUser(LocalDate.now(clock), user);
        if (foundDietDayUser == null) {
            dietGenerator.continueDiet(user);
            foundDietDayUser = dietDayUserRepository.findDietDayUserByDayDateAndUser(LocalDate.now(clock), user);
        }

        Double rate = foundDietDayUser.getRate();

        DietDayAdmin dietDayAdmin = foundDietDayUser.getDietDayAdmin();
        List<MealDto> mealDtos = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayAdmin)
                .stream()
                .map(mealDietDayAdmin -> {
                    MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                    Double portion = mealDietDayAdmin.getPortionSize() * rate;
                    mealDto.setPortionSize(portion);

                    mealDto.setCalories(mealDto.getCalories() * portion / 100);
                    mealDto.setProtein(mealDto.getProtein() * portion / 100);
                    mealDto.setFats(mealDto.getFats() * portion / 100);
                    mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                    return mealDto;
                })
                .toList();

        double totalProteins = mealDtos.stream().mapToDouble(MealDto::getProtein).sum();
        double totalFats = mealDtos.stream().mapToDouble(MealDto::getFats).sum();
        double totalCarbs = mealDtos.stream().mapToDouble(MealDto::getCarbs).sum();

        return new DietResponse(dietDayAdmin.getName(), mealDtos, dietDayAdmin.getCalories() * rate, totalProteins, totalFats, totalCarbs, LocalDate.now(clock));
    }

    public TrainingResponse getTodayTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now(clock));
        List<ExerciseDto> exerciseDtos = ExerciseMapper.toDtos(exerciseTrainingDayRepository.findExerciseTrainingDaysByTrainingDayOrderById(trainingDay));

        return new TrainingResponse(exerciseDtos, LocalDate.now(clock), trainingDay.getIsCompleted());
    }


    public TrainingProgramResponse getTrainingProgram(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<TrainingDay> trainingDays = trainingDayRepository.findTrainingDaysByUserAndTrainingDateGreaterThanEqual(user, LocalDate.now(clock));

        List<TrainingResponse> trainingResponses = trainingDays.stream()
                .map(trainingDay -> {
                    List<ExerciseDto> exerciseDtos = ExerciseMapper.toDtos(
                            exerciseTrainingDayRepository.findExerciseTrainingDaysByTrainingDayOrderById(trainingDay)
                    );
                    return new TrainingResponse(exerciseDtos, trainingDay.getTrainingDate());
                })
                .toList();

        return new TrainingProgramResponse(trainingResponses);
    }

    public WeightProgressResponse getWeightProgress(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<WeightJournal> weightJournals = weightJournalRepository.findAllByUserOrderById(user);
        Map<LocalDate, WeightJournal> lastEntriesByDate = weightJournals.stream()
                .collect(Collectors.toMap(
                        WeightJournal::getWeightDate,
                        journal -> journal,
                        (existing, replacement) -> existing.getId() > replacement.getId() ? existing : replacement
                ));
        List<WeightJournalDto> weightJournalDtos = lastEntriesByDate.values().stream()
                .map(journal -> new WeightJournalDto(journal.getWeightDate(), journal.getWeight()))
                .sorted(Comparator.comparing(WeightJournalDto::getWeightDate))
                .toList();

        return new WeightProgressResponse(weightJournalDtos);
    }

    public TrainingProgramResponse getTrainingHistory(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<TrainingDay> trainingDays = trainingDayRepository.findTrainingDaysByUserAndTrainingDateBefore(user, LocalDate.now(clock));

        List<TrainingResponse> trainingResponses = trainingDays.stream()
                .map(trainingDay -> {
                    List<ExerciseDto> exerciseDtos = ExerciseMapper.toDtos(
                            exerciseTrainingDayRepository.findExerciseTrainingDaysByTrainingDayOrderById(trainingDay)
                    );
                    return new TrainingResponse(exerciseDtos, trainingDay.getTrainingDate(), trainingDay.getIsCompleted());
                })
                .toList();
        return new TrainingProgramResponse(trainingResponses);
    }

    public TrainingStatisticsResponse getTrainingStatistics(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        // Получаем все тренировки пользователя до текущей даты
        List<TrainingDay> trainingDays = trainingDayRepository.findTrainingDaysByUserAndTrainingDateBefore(user, LocalDate.now(clock));

        // Количество всех тренировок
        long totalTrainings = trainingDays.size();

        // Количество завершенных тренировок
        long completedTrainings = trainingDays.stream()
                .filter(TrainingDay::getIsCompleted)
                .count();

        // Процент завершенных тренировок
        double completionPercentage = totalTrainings > 0 ? (completedTrainings / (double) totalTrainings) * 100 : 0;

        // Среднее количество упражнений на тренировку
        double averageExercisesPerTraining = trainingDays.stream()
                .mapToInt(training -> training.getExerciseTrainingDays().size())
                .average()
                .orElse(0);

        // Количество тренировок по месяцам (всего и выполненных)
        Map<Month, Long> trainingMonthCount = trainingDays.stream()
                .collect(Collectors.groupingBy(training -> training.getTrainingDate().getMonth(), Collectors.counting()));

        Map<Month, Long> completedTrainingMonthCount = trainingDays.stream()
                .filter(TrainingDay::getIsCompleted)
                .collect(Collectors.groupingBy(training -> training.getTrainingDate().getMonth(), Collectors.counting()));

        // Первая тренировка
        LocalDate firstTrainingDate = trainingDays.stream()
                .map(TrainingDay::getTrainingDate)
                .min(LocalDate::compareTo)
                .orElse(null);

        // Подсчитываем количество упражнений в завершенных тренировках
        long totalCompletedExercises = trainingDays.stream()
                .filter(TrainingDay::getIsCompleted)
                .flatMap(training -> training.getExerciseTrainingDays().stream())
                .count();

        // Подсчитываем количество упражнений с мышечной группой "кардио"
        long cardioExercisesCount = trainingDays.stream()
                .filter(TrainingDay::getIsCompleted)
                .flatMap(training -> training.getExerciseTrainingDays().stream())
                .map(exerciseTrainingDay -> exerciseTrainingDay.getExercise().getMuscleGroup())
                .filter(muscleGroup -> muscleGroup == MuscleGroup.CARDIO)
                .count();

        return new TrainingStatisticsResponse(
                totalTrainings,
                completedTrainings,
                completionPercentage,
                averageExercisesPerTraining,
                trainingMonthCount,
                completedTrainingMonthCount,
                firstTrainingDate,
                totalCompletedExercises,
                cardioExercisesCount
        );
    }

    public DietHistoryResponse getDietHistory(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<DietDayUser> dietDays = dietDayUserRepository.findDietDayUserByUserAndDayDateBefore(user, LocalDate.now(clock));

        List<DietResponse> dietResponses = dietDays.stream().map(dietDayUser -> {
            // Для каждого дня получаем все приемы пищи
            List<MealDto> meals = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin())
                    .stream()
                    .map(mealDietDayAdmin -> {
                        MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                        Double portion = mealDietDayAdmin.getPortionSize() * dietDayUser.getRate();
                        mealDto.setPortionSize(portion);

                        mealDto.setCalories(mealDto.getCalories() * portion / 100);
                        mealDto.setProtein(mealDto.getProtein() * portion / 100);
                        mealDto.setFats(mealDto.getFats() * portion / 100);
                        mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                        return mealDto;
                    })
                    .toList();

            // Рассчитываем общее количество калорий, белков, жиров и углеводов для этого дня
            Double totalCalories = meals.stream().mapToDouble(MealDto::getCalories).sum();
            Double totalProtein = meals.stream().mapToDouble(MealDto::getProtein).sum();
            Double totalFats = meals.stream().mapToDouble(MealDto::getFats).sum();
            Double totalCarbs = meals.stream().mapToDouble(MealDto::getCarbs).sum();

            // Создаем DietResponse для этого дня
            return new DietResponse(
                    dietDayUser.getDietDayAdmin().getName(),
                    meals,
                    totalCalories,
                    totalProtein,
                    totalFats,
                    totalCarbs,
                    dietDayUser.getDayDate()
            );
        }).toList();

        return new DietHistoryResponse(dietResponses);
    }

    public DietStatisticsResponse getDietStatistics(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<DietDayUser> dietDays = dietDayUserRepository.findDietDayUserByUserAndDayDateBefore(user, LocalDate.now(clock));

        long totalDietDays = dietDays.size();

        double totalCalories = dietDays.stream()
                .flatMap(dietDayUser -> {
                    double rate = dietDayUser.getRate();
                    return mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin()).stream()
                            .map(mealDietDayAdmin -> {
                                MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                                Double portion = mealDietDayAdmin.getPortionSize() * rate;
                                mealDto.setPortionSize(portion);

                                mealDto.setCalories(mealDto.getCalories() * portion / 100);
                                mealDto.setProtein(mealDto.getProtein() * portion / 100);
                                mealDto.setFats(mealDto.getFats() * portion / 100);
                                mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                                return mealDto.getCalories();
                            });
                })
                .mapToDouble(Double::doubleValue)
                .sum();

        double totalProtein = dietDays.stream()
                .flatMap(dietDayUser -> {
                    double rate = dietDayUser.getRate();
                    return mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin()).stream()
                            .map(mealDietDayAdmin -> {
                                MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                                Double portion = mealDietDayAdmin.getPortionSize() * rate;
                                mealDto.setPortionSize(portion);

                                mealDto.setCalories(mealDto.getCalories() * portion / 100);
                                mealDto.setProtein(mealDto.getProtein() * portion / 100);
                                mealDto.setFats(mealDto.getFats() * portion / 100);
                                mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                                return mealDto.getProtein();
                            });
                })
                .mapToDouble(Double::doubleValue)
                .sum();

        double totalFats = dietDays.stream()
                .flatMap(dietDayUser -> {
                    double rate = dietDayUser.getRate();
                    return mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin()).stream()
                            .map(mealDietDayAdmin -> {
                                MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                                Double portion = mealDietDayAdmin.getPortionSize() * rate;
                                mealDto.setPortionSize(portion);

                                mealDto.setCalories(mealDto.getCalories() * portion / 100);
                                mealDto.setProtein(mealDto.getProtein() * portion / 100);
                                mealDto.setFats(mealDto.getFats() * portion / 100);
                                mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                                return mealDto.getFats();
                            });
                })
                .mapToDouble(Double::doubleValue)
                .sum();

        double totalCarbs = dietDays.stream()
                .flatMap(dietDayUser -> {
                    double rate = dietDayUser.getRate();
                    return mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin()).stream()
                            .map(mealDietDayAdmin -> {
                                MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal(), mealDietDayAdmin.getMealPosition());
                                Double portion = mealDietDayAdmin.getPortionSize() * rate;
                                mealDto.setPortionSize(portion);

                                mealDto.setCalories(mealDto.getCalories() * portion / 100);
                                mealDto.setProtein(mealDto.getProtein() * portion / 100);
                                mealDto.setFats(mealDto.getFats() * portion / 100);
                                mealDto.setCarbs(mealDto.getCarbs() * portion / 100);

                                return mealDto.getCarbs();
                            });
                })
                .mapToDouble(Double::doubleValue)
                .sum();

        double averageCaloriesPerDay = totalDietDays > 0 ? totalCalories / totalDietDays : 0;

        double averageMealsPerDay = dietDays.stream()
                .mapToInt(dietDayUser -> mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayUser.getDietDayAdmin()).size())
                .average()
                .orElse(0);

        return new DietStatisticsResponse(
                totalDietDays,
                totalCalories,
                totalProtein,
                totalFats,
                totalCarbs,
                averageCaloriesPerDay,
                averageMealsPerDay
        );
    }

    @Transactional
    public boolean regenerateTodayDiet(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            dietGenerator.rewriteDiet(user, weightJournalRepository.findTopByUserOrderByIdDesc(user).getWeight());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean regenerateTodayTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            trainingGenerator.regenerateTodayTraining(user);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}