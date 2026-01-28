package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.User;
import progym2004.backend.entity.WeightJournal;

import java.util.List;

public interface WeightJournalRepository extends JpaRepository<WeightJournal, Long> {
    WeightJournal findTopByUserOrderByIdDesc(User user);
    List<WeightJournal> findAllByUserOrderById(User user);
}
