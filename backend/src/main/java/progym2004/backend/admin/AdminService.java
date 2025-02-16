package progym2004.backend.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.config.JwtService;
import progym2004.backend.entity.Exercise;
import progym2004.backend.entity.User;
import progym2004.backend.repository.ExerciseRepository;
import progym2004.backend.repository.UserRepository;

@Service
public class AdminService {
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public AdminService(ExerciseRepository exerciseRepository,
                       UserRepository userRepository,
                       JwtService jwtService) {
        this.exerciseRepository = exerciseRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public Exercise save(ExerciseRequest exerciseRequest, String token){
        String login = jwtService.extractUsername(token);

        User user = userRepository.findByLogin(login).orElseThrow(() -> new RuntimeException("User not found"));

        Exercise exercise = new Exercise(user, exerciseRequest.getName(), exerciseRequest.getMuscleGroup(), exerciseRequest.getDescription());
        return exerciseRepository.save(exercise);
    }
}
