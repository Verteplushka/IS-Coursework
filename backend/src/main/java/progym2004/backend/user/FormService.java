package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.*;
import progym2004.backend.mapper.MealMapper;
import progym2004.backend.repository.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
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

    @Autowired
    public FormService(JwtService jwtService,
                       UserRepository userRepository,
                       AllergyRepository allergyRepository,
                       WeightJournalRepository weightJournalRepository,
                       DietGenerator dietGenerator,
                       DietDayUserRepository dietDayUserRepository,
                       MealDietDayAdminRepository mealDietDayAdminRepository,
                       TrainingGenerator trainingGenerator,
                       TrainingDayRepository trainingDayRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.allergyRepository = allergyRepository;
        this.weightJournalRepository = weightJournalRepository;
        this.dietGenerator = dietGenerator;
        this.dietDayUserRepository = dietDayUserRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
        this.trainingGenerator = trainingGenerator;
        this.trainingDayRepository = trainingDayRepository;
    }

    public boolean sendForm(FormRequest formRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

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

            user = userRepository.save(user);
            weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight()));

            dietGenerator.rewriteDiet(user, formRequest.getCurrentWeight());
            trainingGenerator.generateTrainingProgram(user, formRequest.getStartTraining());

            return true;
        } catch (Exception e) {
            return false;
        }
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
        Set<MealDto> mealDtos = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDayAdmin)
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
                .collect(Collectors.toSet());

        double totalProteins = mealDtos.stream().mapToDouble(MealDto::getProtein).sum();
        double totalFats = mealDtos.stream().mapToDouble(MealDto::getFats).sum();
        double totalCarbs = mealDtos.stream().mapToDouble(MealDto::getCarbs).sum();

        return new DietResponse(dietDayAdmin.getName(), mealDtos, dietDayAdmin.getCalories() * rate, totalProteins, totalFats, totalCarbs);
    }

    public TrainingResponse getTodayTraining(String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        TrainingDay trainingDay = trainingDayRepository.findTrainingDayByUserAndTrainingDate(user, LocalDate.now());
        Set<ExerciseDto> exerciseDtos = trainingDay.getExercises().stream()
                .map(exercise -> new ExerciseDto(
                        exercise.getId(),
                        exercise.getName(),
                        exercise.getMuscleGroup(),
                        exercise.getDescription(),
                        exercise.getExecutionInstructions()
                ))
                .collect(Collectors.toSet());

        return new TrainingResponse(exerciseDtos, LocalDate.now());
    }
}
