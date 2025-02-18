package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
public class UserController {
    private final FormService formService;

    @Autowired
    public UserController(FormService formService) {
        this.formService = formService;
    }

    @GetMapping("/get_user_params")
    public ResponseEntity<FormRequest> getUserParams(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getUserParams(jwtToken));
    }

    @PostMapping("/sendForm")
    public ResponseEntity<FormUpdateStatus> sendForm(@RequestBody FormRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.sendForm(request, jwtToken));
    }

    @GetMapping("/get_today_diet")
    public ResponseEntity<DietResponse> getDiet(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayDiet(jwtToken));
    }

    @GetMapping("/get_today_training")
    public ResponseEntity<TrainingResponse> getTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayTraining(jwtToken));
    }

    @GetMapping("/get_training_program")
    public ResponseEntity<TrainingProgramResponse> getTrainingProgram(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingProgram(jwtToken));
    }
}
