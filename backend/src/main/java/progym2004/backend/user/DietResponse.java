package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DietResponse {
    private String name;
    private List<MealDto> meals;
    private Double calories;
    private Double protein;
    private Double fats;
    private Double carbs;
    private LocalDate dietDate;
}
