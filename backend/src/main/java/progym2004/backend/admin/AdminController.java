package progym2004.backend.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progym2004.backend.exception.InvalidMealDataException;

import java.time.LocalDateTime;

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

    @ExceptionHandler(InvalidMealDataException.class)
    public ResponseEntity<ErrorResponse> handleInvalidMealData(InvalidMealDataException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Некорректные данные блюда",
                ex.getMessage(),
                LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
