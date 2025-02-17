package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
public class UserController {
    private final FormService formService;

    @Autowired
    public UserController(FormService formService){
        this.formService = formService;
    }

    @PostMapping("/sendForm")
    public ResponseEntity<String> sendForm(@RequestBody FormRequest request, @RequestHeader ("Authorization") String token) {
        String jwtToken = token.substring(7);
        if(formService.sendForm(request, jwtToken)){
            return ResponseEntity.ok("Form saved successfully");
        }
        return ResponseEntity.badRequest().body("Form is incorrect");
    }

    @GetMapping("/get_today_diet")
    public ResponseEntity<DietResponse> getDiet(@RequestHeader ("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayDiet(jwtToken));
    }

    @GetMapping("/get_today_training")
    public ResponseEntity<TrainingResponse> getTraining(@RequestHeader ("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayTraining(jwtToken));
    }
}
