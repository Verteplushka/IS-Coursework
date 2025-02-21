package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.Allergy;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AllergyRepository extends JpaRepository<Allergy, Long> {
    Set<Allergy> findAllByIdIn(Set<Long> ids);
}
