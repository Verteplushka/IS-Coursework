package progym2004.backend.general;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/general")
public class GeneralController {

    private final GeneralService generalService;

    @GetMapping("/get_all_allergies")
    public ResponseEntity<AllergiesResponse> getAllAllergies(){
        return ResponseEntity.ok(generalService.getAllAllergies());
    }
}
