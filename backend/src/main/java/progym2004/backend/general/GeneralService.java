package progym2004.backend.general;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.DietType;
import progym2004.backend.entity.Meal;
import progym2004.backend.entity.User;
import progym2004.backend.mapper.MealMapper;
import progym2004.backend.repository.AllergyRepository;
import progym2004.backend.repository.MealRepository;
import progym2004.backend.repository.UserRepository;
import progym2004.backend.user.MealDto;
import progym2004.backend.user.MealResponse;

import java.time.Clock;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeneralService {
    private final JwtService jwtService;
    private final AllergyRepository allergyRepository;
    private final UserRepository userRepository;
    private final MealRepository mealRepository;
    private final Clock clock;

    @Autowired
    public GeneralService(AllergyRepository allergyRepository, JwtService jwtService, UserRepository userRepository, MealRepository mealRepository, Clock clock){
        this.allergyRepository = allergyRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.mealRepository = mealRepository;
        this.clock = clock;
    }
    public AllergiesResponse getAllAllergies() {
        List<Allergy> allergies = allergyRepository.findAll();
        Map<Long, String> allergyMap = allergies.stream()
                .collect(Collectors.toMap(Allergy::getId, Allergy::getName));
        return new AllergiesResponse(allergyMap);
    }

    public UserResponse getUser(String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user.getUsername(), user.getRole());
    }

    public LocalDate getDay(){
        return LocalDate.now(clock);
    }

    public MealsResponse getAllMeals() {
        List<Meal> meals = mealRepository.findAllByOrderByIdAsc();
        List<MealResponse> mealResponses = meals.stream()
                .map(MealMapper::toResponse)
                .toList();
        return new MealsResponse(mealResponses);
    }

    public List<DietType> getAllDietTypes(){
        return Arrays.asList(DietType.values());
    }
}
