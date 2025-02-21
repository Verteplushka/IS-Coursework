package progym2004.backend.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.DietType;

import java.util.Map;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DietDayRequest {
    private String name;
    private DietType dietType;
    private Map<Long, Double> MealPortions;
}
