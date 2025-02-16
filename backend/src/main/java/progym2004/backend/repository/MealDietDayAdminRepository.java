package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.DietDayAdmin;
import progym2004.backend.entity.MealDietDayAdmin;

import java.util.Set;

public interface MealDietDayAdminRepository extends JpaRepository<MealDietDayAdmin, Long> {
    Set<MealDietDayAdmin> findMealDietDayAdminsByDietDayAdmin(DietDayAdmin dietDayAdmin);
}
