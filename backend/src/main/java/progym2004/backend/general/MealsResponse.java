package progym2004.backend.general;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.user.MealDto;
import progym2004.backend.user.MealResponse;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealsResponse {
    private List<MealResponse> meals;
}
