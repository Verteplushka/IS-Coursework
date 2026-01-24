package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    private final FormService formService;

    @Autowired
    public UserController(FormService formService) {
        this.formService = formService;
    }

    @GetMapping("/me/params")
    public ResponseEntity<UserParamsResponse> getUserParams(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getUserParams(jwtToken));
    }

    @PostMapping("/me/form")
    public ResponseEntity<FormUpdateStatus> sendForm(@RequestBody FormRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.sendForm(request, jwtToken));
    }

    @PostMapping("/me/trainings/today/complete")
    public ResponseEntity<String> completeTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.completeTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Training has been successfully completed.");
        }
        return ResponseEntity.badRequest().body("Failed to complete the training.");
    }

    @PostMapping("/me/trainings/today/uncomplete")
    public ResponseEntity<String> uncompleteTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.uncompleteTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Training has been successfully uncompleted.");
        }
        return ResponseEntity.badRequest().body("Failed to uncomplete the training.");
    }


    @GetMapping("/me/diet/today")
    public ResponseEntity<DietResponse> getDiet(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayDiet(jwtToken));
    }

    @GetMapping("/me/trainings/today")
    public ResponseEntity<TrainingResponse> getTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTodayTraining(jwtToken));
    }

    @GetMapping("/me/training-program")
    public ResponseEntity<TrainingProgramResponse> getTrainingProgram(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingProgram(jwtToken));
    }

    @GetMapping("/me/weight-progress")
    public ResponseEntity<WeightProgressResponse> getWeightProgress(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getWeightProgress(jwtToken));
    }

    @GetMapping("/me/trainings/history")
    public ResponseEntity<TrainingProgramResponse> getTrainingHistory(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingHistory(jwtToken));
    }

    @GetMapping("/me/trainings/statistics")
    public ResponseEntity<TrainingStatisticsResponse> getTrainingStatistics(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getTrainingStatistics(jwtToken));
    }

    @GetMapping("/me/diet/history")
    public ResponseEntity<DietHistoryResponse> getDietHistory(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getDietHistory(jwtToken));
    }

    @GetMapping("/me/diet/statistics")
    public ResponseEntity<DietStatisticsResponse> getDietStatistics(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.getDietStatistics(jwtToken));
    }
    @GetMapping("/me/diet/today/regenerate")
    public ResponseEntity<String> regenerateTodayDiet(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.regenerateTodayDiet(jwtToken);

        if (success) {
            return ResponseEntity.ok("Today's diet has been successfully regenerated.");
        }
        return ResponseEntity.badRequest().body("Failed to regenerate today's diet.");
    }

    @GetMapping("/me/trainings/today/regenerate")
    public ResponseEntity<String> regenerateTodayTraining(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        boolean success = formService.regenerateTodayTraining(jwtToken);

        if (success) {
            return ResponseEntity.ok("Today's training has been successfully regenerated.");
        }
        return ResponseEntity.badRequest().body("Failed to regenerate today's training.");
    }

    @GetMapping("/me/status/lazy")
    public ResponseEntity<Boolean> isUserLazy(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        return ResponseEntity.ok(formService.isUserLazy(jwtToken));
    }
}
