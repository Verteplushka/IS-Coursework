package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DietResponse {
    private String name;
    private Set<MealDto> meals;
    private Double calories;
    private Double protein;
    private Double fats;
    private Double carbs;
}
