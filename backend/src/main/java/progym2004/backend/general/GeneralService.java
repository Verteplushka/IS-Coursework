package progym2004.backend.general;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.User;
import progym2004.backend.repository.AllergyRepository;
import progym2004.backend.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeneralService {
    private final JwtService jwtService;
    private final AllergyRepository allergyRepository;
    private final UserRepository userRepository;

    @Autowired
    public GeneralService(AllergyRepository allergyRepository, JwtService jwtService, UserRepository userRepository){
        this.allergyRepository = allergyRepository;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    public AllergiesResponse getAllAllergies() {
        List<Allergy> allergies = allergyRepository.findAll();
        Map<Long, String> allergyMap = allergies.stream()
                .collect(Collectors.toMap(Allergy::getId, Allergy::getName));
        return new AllergiesResponse(allergyMap);
    }

    public UserResponse getUser(String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user.getUsername(), user.getRole());
    }
}
