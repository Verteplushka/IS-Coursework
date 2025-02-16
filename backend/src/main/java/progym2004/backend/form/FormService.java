package progym2004.backend.form;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.Allergy;
import progym2004.backend.repository.AllergyRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormService {
    private final AllergyRepository allergyRepository;
    public boolean save(FormRequest request){
        return false;
    }

    public AllergiesResponse getAllAllergies() {
        List<Allergy> allergies = allergyRepository.findAll();
        return new AllergiesResponse(allergies.stream().map(Allergy::getName).toList());
    }
}
