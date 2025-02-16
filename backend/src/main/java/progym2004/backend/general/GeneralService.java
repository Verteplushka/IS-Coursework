package progym2004.backend.general;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.Allergy;
import progym2004.backend.repository.AllergyRepository;
import progym2004.backend.user.FormRequest;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeneralService {
    private final AllergyRepository allergyRepository;
    @Autowired
    public GeneralService(AllergyRepository allergyRepository){
        this.allergyRepository = allergyRepository;
    }
    public AllergiesResponse getAllAllergies() {
        List<Allergy> allergies = allergyRepository.findAll();
        Map<Long, String> allergyMap = allergies.stream()
                .collect(Collectors.toMap(Allergy::getId, Allergy::getName));
        return new AllergiesResponse(allergyMap);
    }
}
