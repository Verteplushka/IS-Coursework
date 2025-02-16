package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.DietDayUser;

import java.time.LocalDate;

public interface DietDayUserRepository extends JpaRepository<DietDayUser, Long> {
    DietDayUser findDietDayUserByDayDate(LocalDate dayDate);
}
