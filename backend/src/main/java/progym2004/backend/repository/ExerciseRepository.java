package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
}
