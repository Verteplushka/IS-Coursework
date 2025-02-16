package progym2004.backend.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.Exercise;
import progym2004.backend.entity.Meal;
import progym2004.backend.entity.User;
import progym2004.backend.repository.AllergyRepository;
import progym2004.backend.repository.ExerciseRepository;
import progym2004.backend.repository.MealRepository;
import progym2004.backend.repository.UserRepository;

import java.util.Set;

@Service
public class AdminService {
    private final ExerciseRepository exerciseRepository;
    private final AllergyRepository allergyRepository;
    private final MealRepository mealRepository;

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public AdminService(ExerciseRepository exerciseRepository,
                        AllergyRepository allergyRepository,
                        MealRepository mealRepository,
                        UserRepository userRepository,
                        JwtService jwtService) {

        this.exerciseRepository = exerciseRepository;
        this.allergyRepository = allergyRepository;
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public Exercise saveExercise(ExerciseRequest exerciseRequest, String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        Exercise exercise = new Exercise(user, exerciseRequest.getName(), exerciseRequest.getMuscleGroup(), exerciseRequest.getDescription());
        return exerciseRepository.save(exercise);
    }

    public Allergy saveAllergy(AllergyRequest allergyRequest, String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        Set<Meal> meals = mealRepository.findAllByIdIn(allergyRequest.getAllergyMealsIds());
        Allergy allergy = new Allergy(user, allergyRequest.getName(), meals);
        return allergyRepository.save(allergy);
    }

    public Meal saveMeal(MealRequest mealRequest, String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));
        Meal meal = new Meal(user, mealRequest.getName(), mealRequest.getCalories(), mealRequest.getProtein(), mealRequest.getFats(), mealRequest.getCarbs());
        return mealRepository.save(meal);
    }
}
