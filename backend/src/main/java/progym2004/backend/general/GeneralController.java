package progym2004.backend.general;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progym2004.backend.entity.DietType;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class GeneralController {

    private final GeneralService generalService;

    @GetMapping("/allergies")
    public ResponseEntity<AllergiesResponse> getAllAllergies(){
        return ResponseEntity.ok(generalService.getAllAllergies());
    }

    @GetMapping("/meals")
    public ResponseEntity<MealsResponse> getAllMeals(){
        return ResponseEntity.ok(generalService.getAllMeals());
    }

    @GetMapping("/diets")
    public ResponseEntity<List<DietType>> getDietTypes(){
        return ResponseEntity.ok(generalService.getAllDietTypes());
    }

    @GetMapping("/users")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("Authorization") String token){
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(generalService.getUser(jwtToken));
    }

    @GetMapping("/days")
    public ResponseEntity<LocalDate> getDay(){
        return ResponseEntity.ok(generalService.getDay());
    }
}
