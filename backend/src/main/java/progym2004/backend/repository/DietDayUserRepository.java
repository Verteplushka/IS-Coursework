package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.DietDayUser;
import progym2004.backend.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface DietDayUserRepository extends JpaRepository<DietDayUser, Long> {
    DietDayUser findDietDayUserByDayDateAndUser(LocalDate dayDate, User user);
    void deleteAllByUserAndDayDateGreaterThanEqual(User user, LocalDate dayDate);
    List<DietDayUser> findDietDayUserByUserAndDayDateBefore(User user, LocalDate dayDate);
}
