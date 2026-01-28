package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DietStatisticsResponse {
    private long totalDietDays;
    private double totalCalories;
    private double totalProtein;
    private double totalFats;
    private double totalCarbs;
    private double averageCaloriesPerDay;
    private double averageMealsPerDay;
}

