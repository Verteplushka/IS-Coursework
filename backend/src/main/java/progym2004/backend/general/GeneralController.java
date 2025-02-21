package progym2004.backend.general;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progym2004.backend.entity.DietType;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/general")
public class GeneralController {

    private final GeneralService generalService;

    @GetMapping("/get_all_allergies")
    public ResponseEntity<AllergiesResponse> getAllAllergies(){
        return ResponseEntity.ok(generalService.getAllAllergies());
    }

    @GetMapping("/get_all_meals")
    public ResponseEntity<MealsResponse> getAllMeals(){
        return ResponseEntity.ok(generalService.getAllMeals());
    }

    @GetMapping("/get_diet_types")
    public ResponseEntity<List<DietType>> getDietTypes(){
        return ResponseEntity.ok(generalService.getAllDietTypes());
    }

    @GetMapping("/get_user")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("Authorization") String token){
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(generalService.getUser(jwtToken));
    }

    @GetMapping("/get_day")
    public ResponseEntity<LocalDate> getDay(){
        return ResponseEntity.ok(generalService.getDay());
    }
}
