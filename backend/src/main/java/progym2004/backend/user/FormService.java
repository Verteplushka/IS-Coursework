package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.*;
import progym2004.backend.mapper.ExerciseMapper;
import progym2004.backend.mapper.MealMapper;
import progym2004.backend.repository.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FormService {
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
    public FormService(JwtService jwtService,
                       UserRepository userRepository,
                       AllergyRepository allergyRepository,
                       WeightJournalRepository weightJournalRepository,
                       DietGenerator dietGenerator,
                       DietDayUserRepository dietDayUserRepository,
                       MealDietDayAdminRepository mealDietDayAdminRepository,
                       TrainingGenerator trainingGenerator,
                       TrainingDayRepository trainingDayRepository, ExerciseTrainingDayRepository exerciseTrainingDayRepository) {
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
        boolean isEndingSoon = lastTrainingDate.equals(LocalDate.now());

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

            WeightJournal prevWeight = weightJournalRepository.findTopByUserOrderByIdDesc(user);
            LocalDate startDate = formRequest.getStartTraining().isBefore(LocalDate.now()) ? LocalDate.now() : formRequest.getStartTraining();

            if (user.getAvailableDays().equals(userFromBD.getAvailableDays())
                    && user.getFitnessLevel().equals(userFromBD.getFitnessLevel())
                    && user.getGoal().equals(userFromBD.getGoal())
                    && user.getStartTraining().equals(userFromBD.getStartTraining())) {
                if (prevWeight != null) {
                    if (prevWeight.getWeight().equals(formRequest.getCurrentWeight())
                            && user.getGender().equals(userFromBD.getGender())
                            && user.getHeight().equals(userFromBD.getHeight())
                            && user.getActivityLevel().equals(userFromBD.getActivityLevel())
                            && user.getAllergies().equals(userFromBD.getAllergies())) {
                        return FormUpdateStatus.NO_CHANGES;
                    }
                }
                user = userRepository.save(user);
                weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight()));
                dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
                return FormUpdateStatus.UPDATED_DIET;

            } else if (!user.getGoal().equals(userFromBD.getGoal())) {
                user = userRepository.save(user);
                weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight()));
                dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
                trainingGenerator.regenerateTrainingProgram(user, startDate);
                return FormUpdateStatus.UPDATED_ALL;
            } else if (prevWeight != null) {
                if (prevWeight.getWeight().equals(formRequest.getCurrentWeight())
                        && user.getGender().equals(userFromBD.getGender())
                        && user.getHeight().equals(userFromBD.getHeight())
                        && user.getActivityLevel().equals(userFromBD.getActivityLevel())
                        && user.getAllergies().equals(userFromBD.getAllergies())) {
                    user = userRepository.save(user);
                    trainingGenerator.regenerateTrainingProgram(user, startDate);
                    return FormUpdateStatus.UPDATED_TRAINING;
                }
            }

            user = userRepository.save(user);
            weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight()));
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

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now());
        if (trainingDay == null) {
            return false;
        }
        trainingDay.setIsCompleted(true);
        trainingDayRepository.save(trainingDay);
        return true;
    }

    public DietResponse getTodayDiet(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        DietDayUser foundDietDayUser = dietDayUserRepository.findDietDayUserByDayDateAndUser(LocalDate.now(), user);
        if (foundDietDayUser == null) {
            dietGenerator.continueDiet(user);
            foundDietDayUser = dietDayUserRepository.findDietDayUserByDayDateAndUser(LocalDate.now(), user);
        }

        Double rate = foundDietDayUser.getRate();

        DietDayAdmin dietDayAdmin = foundDietDayUser.getDietDayAdmin();
        List<MealDto> mealDtos = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayAdmin)
                .stream()
                .map(mealDietDayAdmin -> {
                    MealDto mealDto = MealMapper.toDto(mealDietDayAdmin.getMeal());
                    Double portion = mealDietDayAdmin.getPortionSize() * rate;
                    mealDto.setPortionSize(portion);

                    mealDto.setCalories(mealDto.getCalories() * portion);
                    mealDto.setProtein(mealDto.getProtein() * portion);
                    mealDto.setFats(mealDto.getFats() * portion);
                    mealDto.setCarbs(mealDto.getCarbs() * portion);

                    return mealDto;
                })
                .toList();

        double totalProteins = mealDtos.stream().mapToDouble(MealDto::getProtein).sum();
        double totalFats = mealDtos.stream().mapToDouble(MealDto::getFats).sum();
        double totalCarbs = mealDtos.stream().mapToDouble(MealDto::getCarbs).sum();

        return new DietResponse(dietDayAdmin.getName(), mealDtos, dietDayAdmin.getCalories() * rate, totalProteins, totalFats, totalCarbs);
    }

    public TrainingResponse getTodayTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now());
        List<ExerciseDto> exerciseDtos = ExerciseMapper.toDtos(exerciseTrainingDayRepository.findExerciseTrainingDaysByTrainingDayOrderById(trainingDay));

        return new TrainingResponse(exerciseDtos, LocalDate.now());
    }


    public TrainingProgramResponse getTrainingProgram(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        List<TrainingDay> trainingDays = trainingDayRepository.findTrainingDaysByUserAndTrainingDateGreaterThanEqual(user, LocalDate.now());

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
}
