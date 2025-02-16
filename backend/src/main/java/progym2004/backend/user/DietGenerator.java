package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.*;
import progym2004.backend.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DietGenerator {
    private final DietDayAdminRepository dietDayAdminRepository;
    private final MealDietDayAdminRepository mealDietDayAdminRepository;

    @Autowired
    public DietGenerator(DietDayAdminRepository dietDayAdminRepository,
                         MealDietDayAdminRepository mealDietDayAdminRepository) {
        this.dietDayAdminRepository = dietDayAdminRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
    }

    public Map<String, Set<Meal>> generateDiet(User user, Double weight) {
        List<DietDayAdmin> availableDietDays = dietDayAdminRepository.findAll();
        // Логика для создания диеты на основе данных пользователя
        Map<String, Set<Meal>> generatedDiet = new HashMap<>();
        for (DietDayAdmin dietDay : availableDietDays) {
            // Фильтрация по доступным дням, цели пользователя и уровню активности
            if (!hasAllergenMeals(dietDay, user) && isSuitableForUser(user, dietDay)) {
                // Проверяем, есть ли у пользователя аллергия на блюда в этом дне
                // Добавляем блюда в диету, если нет аллергий
                Set<Meal> meals = selectMealsForDiet(dietDay);
                generatedDiet.put(dietDay.getName(), meals);

            }
        }
        return generatedDiet;
    }

    // Метод для проверки, подходит ли диета пользователю
    private boolean isSuitableForUser(User user, DietDayAdmin dietDay) {
        // Пример фильтрации: проверка уровня активности, доступных дней, и других критериев
        return user.getActivityLevel() >= 2 && user.getAvailableDays() >= 3;
    }

    // Метод для проверки, есть ли у пользователя аллергия на блюда в этом дне
    private boolean hasAllergenMeals(DietDayAdmin dietDay, User user) {
        Set<MealDietDayAdmin> mealDietDayAdmins = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDay);

        // Если хотя бы одно блюдо вызывает аллергию у пользователя, возвращаем true
        return mealDietDayAdmins.stream()
                .anyMatch(mealDietDayAdmin -> isMealAllergenic(mealDietDayAdmin.getMeal(), user));
    }

    // Метод для выбора блюд на основе диеты
    private Set<Meal> selectMealsForDiet(DietDayAdmin dietDay) {
        Set<MealDietDayAdmin> mealDietDayAdmins = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDay);
        return mealDietDayAdmins.stream()
                .map(MealDietDayAdmin::getMeal)
                .collect(Collectors.toSet());
    }

    private boolean isMealAllergenic(Meal meal, User user) {
        // Проверяем, есть ли у пользователя аллергия на это блюдо
        return user.getAllergies().stream()
                .anyMatch(allergy -> meal.getAllergies().contains(allergy));
    }
}
