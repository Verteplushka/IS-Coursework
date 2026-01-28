package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.ExerciseTrainingDay;
import progym2004.backend.entity.TrainingDay;

import java.util.List;

public interface ExerciseTrainingDayRepository extends JpaRepository<ExerciseTrainingDay, Long> {
    List<ExerciseTrainingDay> findExerciseTrainingDaysByTrainingDayOrderById(TrainingDay trainingDay);
}
