package progym2004.backend.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MealRequest {
    private String name;
    private Double calories;
    private Double protein;
    private Double fats;
    private Double carbs;
}
