package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.TrainingDay;
import progym2004.backend.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface TrainingDayRepository extends JpaRepository<TrainingDay, Long> {
    TrainingDay findTrainingDayByUserAndTrainingDate(User user, LocalDate trainingDate);
    void deleteAllByUserAndTrainingDateGreaterThanEqual(User user, LocalDate trainingDate);
    List<TrainingDay> findTrainingDaysByUserAndTrainingDateGreaterThanEqual(User user, LocalDate trainingDate);
    TrainingDay findTopByUserOrderByTrainingDateDesc(User user);
}
