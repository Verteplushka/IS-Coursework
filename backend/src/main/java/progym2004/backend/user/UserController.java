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
    public ResponseEntity<UserParamsResponse> getUserParams(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getUserParams(jwtToken));
    }

    @PostMapping("/sendForm")
    public ResponseEntity<FormUpdateStatus> sendForm(@RequestBody FormRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.sendForm(request, jwtToken));
    }

    @PostMapping("/complete_training")
    public ResponseEntity<Void> completeTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        if (formService.completeTraining(jwtToken)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(400).build();
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

    @GetMapping("/get_weight_progress")
    public ResponseEntity<WeightProgressResponse> getWeightProgress(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getWeightProgress(jwtToken));
    }

    @GetMapping("/get_training_history")
    public ResponseEntity<TrainingProgramResponse> getTrainingHistory(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingHistory(jwtToken));
    }

    @GetMapping("/get_training_statistics")
    public ResponseEntity<TrainingStatisticsResponse> getTrainingStatistics(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingStatistics(jwtToken));
    }
}
