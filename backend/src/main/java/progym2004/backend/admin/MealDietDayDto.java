package progym2004.backend.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.MealPosition;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealDietDayDto {
    private Long id;
    private Double portionSize;
    private MealPosition mealPosition;
}
