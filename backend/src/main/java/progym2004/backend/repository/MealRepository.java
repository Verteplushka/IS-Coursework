package progym2004.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import progym2004.backend.entity.Meal;

import java.util.Set;

public interface MealRepository extends JpaRepository<Meal, Long> {
    Set<Meal> findAllByIdIn(Set<Long> ids);
}
