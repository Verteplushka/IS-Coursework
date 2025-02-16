package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.User;
import progym2004.backend.entity.WeightJournal;

public interface WeightJournalRepository extends JpaRepository<WeightJournal, Long> {
    WeightJournal findTopByUser(User user);
}
