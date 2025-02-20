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
    public ResponseEntity<String> completeTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.completeTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Training has been successfully completed.");
        }
        return ResponseEntity.badRequest().body("Failed to complete the training.");
    }

    @PostMapping("/uncomplete_training")
    public ResponseEntity<String> uncompleteTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.uncompleteTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Training has been successfully uncompleted.");
        }
        return ResponseEntity.badRequest().body("Failed to uncomplete the training.");
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

    @GetMapping("/get_diet_history")
    public ResponseEntity<DietHistoryResponse> getDietHistory(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getDietHistory(jwtToken));
    }

    @GetMapping("/get_diet_statistics")
    public ResponseEntity<DietStatisticsResponse> getDietStatistics(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getDietStatistics(jwtToken));
    }
    @GetMapping("/regenerate_today_diet")
    public ResponseEntity<String> regenerateTodayDiet(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.regenerateTodayDiet(jwtToken);

        if (success) {
            return ResponseEntity.ok("Today's diet has been successfully regenerated.");
        }
        return ResponseEntity.badRequest().body("Failed to regenerate today's diet.");
    }

    @GetMapping("/regenerate_today_training")
    public ResponseEntity<String> regenerateTodayTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.regenerateTodayTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Today's training has been successfully regenerated.");
        }
        return ResponseEntity.badRequest().body("Failed to regenerate today's training.");
    }

}
