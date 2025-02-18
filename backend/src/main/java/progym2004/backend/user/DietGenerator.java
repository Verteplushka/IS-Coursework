package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.*;
import progym2004.backend.repository.*;
import progym2004.backend.repository.DietDayUserRepository;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DietGenerator {
    private final DietDayAdminRepository dietDayAdminRepository;
    private final MealDietDayAdminRepository mealDietDayAdminRepository;
    private final DietDayUserRepository dietDayUserRepository;
    private final WeightJournalRepository weightJournalRepository;
    private final int generatedDaysAmount = 2;

    @Autowired
    public DietGenerator(DietDayAdminRepository dietDayAdminRepository,
                         MealDietDayAdminRepository mealDietDayAdminRepository,
                         DietDayUserRepository dietDayUserRepository,
                         WeightJournalRepository weightJournalRepository) {
        this.dietDayAdminRepository = dietDayAdminRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
        this.dietDayUserRepository = dietDayUserRepository;
        this.weightJournalRepository = weightJournalRepository;
    }

    public void continueDiet(User user) {
        Double weight = weightJournalRepository.findTopByUserOrderByIdDesc(user).getWeight();
        List<DietDayAdmin> availableDietDays = dietDayAdminRepository.findAll();

        int currentlyGeneratedDays = 0;
        while (currentlyGeneratedDays < generatedDaysAmount) {
            for (DietDayAdmin dietDay : availableDietDays) {
                if (!hasAllergenMeals(dietDay, user)) {
                    Double dailyCalories = calculateDailyCalories(user, weight);
                    Double rate = dailyCalories / dietDay.getCalories();
                    LocalDate dietDate = LocalDate.now().plusDays(currentlyGeneratedDays);

                    dietDayUserRepository.save(new DietDayUser(user, dietDay, rate, dietDate));
                    currentlyGeneratedDays++;
                }
                if (currentlyGeneratedDays == generatedDaysAmount) {
                    break;
                }
            }
        }
    }

    public void rewriteDiet(User user, Double weight) {
        List<DietDayAdmin> availableDietDays = dietDayAdminRepository.findAll();

        int currentlyGeneratedDays = 0;
        while (currentlyGeneratedDays < generatedDaysAmount) {
            for (DietDayAdmin dietDay : availableDietDays) {
                if (!hasAllergenMeals(dietDay, user)) {
                    Double dailyCalories = calculateDailyCalories(user, weight);
                    Double rate = dailyCalories / dietDay.getCalories();
                    LocalDate dietDate = LocalDate.now().plusDays(currentlyGeneratedDays);

                    DietDayUser foundDietDayUser = dietDayUserRepository.findDietDayUserByDayDateAndUser(dietDate, user);
                    if (foundDietDayUser != null) {
                        dietDayUserRepository.delete(foundDietDayUser);
                    }
                    dietDayUserRepository.save(new DietDayUser(user, dietDay, rate, dietDate));
                    currentlyGeneratedDays++;
                }
                if (currentlyGeneratedDays == generatedDaysAmount) {
                    break;
                }
            }
        }
    }

    private boolean hasAllergenMeals(DietDayAdmin dietDay, User user) {
        Set<MealDietDayAdmin> mealDietDayAdmins = mealDietDayAdminRepository.findMealDietDayAdminsByDietDayAdmin(dietDay);

        return mealDietDayAdmins.stream()
                .anyMatch(mealDietDayAdmin -> isMealAllergenic(mealDietDayAdmin.getMeal(), user));
    }

    private boolean isMealAllergenic(Meal meal, User user) {
        return user.getAllergies().stream()
                .anyMatch(allergy -> meal.getAllergies().contains(allergy));
    }

    private Double calculateDailyCalories(User user, Double weight) {
        int age = Period.between(user.getBirthDate(), LocalDate.now()).getYears();
        double heightCm = user.getHeight();
        int activityLevel = user.getActivityLevel();

        // Расчет BMR (базового метаболизма)
        double bmr = 10 * weight + 6.25 * heightCm - 5 * age;
        if (user.getGender() == Gender.MALE) {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        // Коррекция на уровень активности
        double activityMultiplier = switch (activityLevel) {
            case 1 -> 1.2;   // Минимальная активность
            case 2 -> 1.375; // Легкие тренировки
            case 3 -> 1.55;  // Средняя активность
            case 4 -> 1.725; // Высокая активность
            case 5 -> 1.9;   // Экстремальная активность
            default -> throw new IllegalArgumentException("Incorrect activity level: " + activityLevel);
        };

        double dailyCalories = bmr * activityMultiplier;

        // Корректировка калорий в зависимости от цели пользователя
        switch (user.getGoal()) {
            case WEIGHT_LOSS:
                dailyCalories -= 500; // Дефицит калорий
                break;
            case MUSCLE_GAIN:
                dailyCalories += 500; // Избыток калорий
                break;
            case MAINTENANCE:
            default:
                break; // Без изменений
        }

        return dailyCalories;
    }

}
