package progym2004.backend.form;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import progym2004.backend.auth.AuthenticationResponse;
import progym2004.backend.auth.RegisterRequest;
import progym2004.backend.entity.Role;

@RestController
@RequestMapping("api/form")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    @PostMapping("/send")
    public ResponseEntity<String> register(@RequestBody FormRequest request) {
        if(formService.save(request)){
            return ResponseEntity.ok("Form saved successfully");
        }
        return ResponseEntity.badRequest().body("Form is incorrect");
    }

    @GetMapping("/get_allergies")
    public ResponseEntity<AllergiesResponse> getAllergies(){
        return ResponseEntity.ok(formService.getAllAllergies());
    }
}
