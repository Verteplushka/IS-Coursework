package progym2004.backend.admin;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/add_exercise")
    public ResponseEntity<String> addExercise(@RequestBody ExerciseRequest request, @RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        adminService.save(request, jwtToken);
        return ResponseEntity.ok("Exercise saved successfully");
    }



}
