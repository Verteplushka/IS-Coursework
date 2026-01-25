package progym2004.backend.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/exercises")
    public ResponseEntity<String> addExercise(@RequestBody ExerciseRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        adminService.saveExercise(request, jwtToken);
        return ResponseEntity.ok("Exercise saved successfully");
    }

    @PostMapping("/allergies")
    public ResponseEntity<String> addAllergy(@RequestBody AllergyRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        adminService.saveAllergy(request, jwtToken);
        return ResponseEntity.ok("Allergy saved successfully");
    }

    @PostMapping("/meals")
    public ResponseEntity<String> addMeal(@RequestBody MealRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        adminService.saveMeal(request, jwtToken);
        return ResponseEntity.ok("Meal saved successfully");
    }

    @PostMapping("/diets")
    public ResponseEntity<String> addDietDay(@RequestBody DietDayRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        adminService.saveDietDay(request, jwtToken);
        return ResponseEntity.ok("Diet day saved successfully");
    }

}
