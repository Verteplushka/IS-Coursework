package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.MealPosition;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealDto {
    private Long id;
    private String name;
    private Double calories;
    private Double protein;
    private Double fats;
    private Double carbs;
    private Double portionSize;
    private MealPosition mealPosition;

    public MealDto(Long id, String name, Double calories, Double protein, Double fats, Double carbs, MealPosition mealPosition) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.protein = protein;
        this.fats = fats;
        this.carbs = carbs;
        this.mealPosition = mealPosition;
    }
}
