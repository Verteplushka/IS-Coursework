package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.User;
import progym2004.backend.entity.WeightJournal;
import progym2004.backend.repository.AllergyRepository;
import progym2004.backend.repository.UserRepository;
import progym2004.backend.repository.WeightJournalRepository;

import java.util.HashSet;
import java.util.Set;

@Service
public class FormService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AllergyRepository allergyRepository;
    private final WeightJournalRepository weightJournalRepository;
    private final DietGenerator dietGenerator;

    @Autowired
    public FormService(JwtService jwtService,
                       UserRepository userRepository,
                       AllergyRepository allergyRepository,
                       WeightJournalRepository weightJournalRepository,
                       DietGenerator dietGenerator){
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.allergyRepository = allergyRepository;
        this.weightJournalRepository = weightJournalRepository;
        this.dietGenerator = dietGenerator;
    }
    public boolean sendForm(FormRequest formRequest, String token){
        String login = jwtService.extractUsername(token);
        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            user.setBirthDate(formRequest.getBirthDate());
            user.setGender(formRequest.getGender());
            user.setHeight(formRequest.getHeight());
            user.setGoal(formRequest.getGoal());
            user.setFitnessLevel(formRequest.getFitnessLevel());
            user.setActivityLevel(formRequest.getActivityLevel());
            user.setAvailableDays(formRequest.getAvailableDays());
            Set<Allergy> allergies = new HashSet<>(allergyRepository.findAllById(formRequest.getAllergiesIds()));
            user.setAllergies(allergies);

            user = userRepository.save(user);
            weightJournalRepository.save(new WeightJournal(user, formRequest.getCurrentWeight()));

            dietGenerator.generateDiet(user, formRequest.getCurrentWeight());

            return true;
        } catch (Exception e){
            return false;
        }
    }
}
