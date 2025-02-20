package progym2004.backend.mapper;

import progym2004.backend.entity.Meal;
import progym2004.backend.entity.MealPosition;
import progym2004.backend.user.MealDto;

public class MealMapper {
    public static MealDto toDto(Meal meal, MealPosition mealPosition) {
        return new MealDto(
                meal.getId(),
                meal.getName(),
                meal.getCalories(),
                meal.getProtein(),
                meal.getFats(),
                meal.getCarbs(),
                mealPosition
        );
    }
}

