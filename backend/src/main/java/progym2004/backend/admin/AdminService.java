package progym2004.backend.admin;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.*;
import progym2004.backend.exception.InvalidMealDataException;
import progym2004.backend.repository.*;

import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AdminService {
    private final Clock clock;
    private final ExerciseRepository exerciseRepository;
    private final AllergyRepository allergyRepository;
    private final MealRepository mealRepository;
    private final DietDayAdminRepository dietDayAdminRepository;
    private final MealDietDayAdminRepository mealDietDayAdminRepository;

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public AdminService(Clock clock, ExerciseRepository exerciseRepository,
                        AllergyRepository allergyRepository,
                        MealRepository mealRepository,
                        DietDayAdminRepository dietDayAdminRepository,
                        MealDietDayAdminRepository mealDietDayAdminRepository,
                        UserRepository userRepository,
                        JwtService jwtService) {
        this.clock = clock;

        this.exerciseRepository = exerciseRepository;
        this.allergyRepository = allergyRepository;
        this.mealRepository = mealRepository;
        this.dietDayAdminRepository = dietDayAdminRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public Exercise saveExercise(ExerciseRequest exerciseRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        Exercise exercise = new Exercise(user, exerciseRequest.getName(), exerciseRequest.getMuscleGroup(), exerciseRequest.getDescription(), exerciseRequest.getExecutionInstructions(), exerciseRequest.isCompound(), LocalDate.now(clock), exerciseRequest.getRecommendedRepetitions());
        log.info("Saved new exercise with id {}", exercise.getId());
        return exerciseRepository.save(exercise);
    }

    public Allergy saveAllergy(AllergyRequest allergyRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        Set<Meal> meals = mealRepository.findAllByIdIn(allergyRequest.getAllergyMealsIds());
        Allergy allergy = new Allergy(user, allergyRequest.getName(), meals, LocalDate.now(clock));
        allergy = allergyRepository.save(allergy);

        for (Meal meal : meals) {
            meal.getAllergies().add(allergy);
            mealRepository.save(meal);
        }

        log.info("Saved new exercise with id {}", allergy.getId());
        return allergy;
    }

    public Meal saveMeal(MealRequest mealRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        validateMealRequest(mealRequest);

        Meal meal = new Meal(
                user,
                mealRequest.getName(),
                mealRequest.getCalories(),
                mealRequest.getProtein(),
                mealRequest.getFats(),
                mealRequest.getCarbs(),
                LocalDate.now(clock)
        );

        Set<Allergy> allergies = allergyRepository.findAllByIdIn(mealRequest.getAllergiesIds());
        meal.setAllergies(allergies);

        Meal savedMeal = mealRepository.save(meal);
        log.info("Saved new meal with id {}", savedMeal.getId());

        return savedMeal;
    }

    public DietDayAdmin saveDietDay(DietDayRequest dietDayRequest, String token) {
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        DietDayAdmin dietDayAdmin = dietDayAdminRepository.save(new DietDayAdmin(user, dietDayRequest.getName(), LocalDate.now(clock), dietDayRequest.getDietType()));

        List<Long> mealIds = dietDayRequest.getMeals().stream()
                .map(MealDietDayDto::getId)
                .collect(Collectors.toList());

        List<Meal> meals = mealRepository.findAllById(mealIds);

        for (MealDietDayDto dto : dietDayRequest.getMeals()) {
            Meal meal = meals.stream()
                    .filter(m -> m.getId().equals(dto.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Meal with id = " + dto.getId() + " not found"));

            MealDietDayAdmin mealDietDayAdmin = new MealDietDayAdmin(
                    dietDayAdmin,
                    meal,
                    dto.getPortionSize(),
                    dto.getMealPosition()
            );

            mealDietDayAdminRepository.save(mealDietDayAdmin);
        }
        log.info("Saved new exercise with id {}", dietDayAdmin.getId());
        return dietDayAdmin;
    }


    private void validateMealRequest(MealRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidMealDataException("name", "Название блюда не может быть пустым");
        }

        if (request.getCalories() == null || request.getCalories() < 0) {
            throw new InvalidMealDataException("calories", "Калории не могут быть отрицательными");
        }

        if (request.getProtein() == null || request.getProtein() < 0) {
            throw new InvalidMealDataException("protein", "Белки не могут быть отрицательными");
        }

        if (request.getFats() == null || request.getFats() < 0) {
            throw new InvalidMealDataException("fats", "Жиры не могут быть отрицательными");
        }

        if (request.getCarbs() == null || request.getCarbs() < 0) {
            throw new InvalidMealDataException("carbs", "Углеводы не могут быть отрицательными");
        }
    }
}
