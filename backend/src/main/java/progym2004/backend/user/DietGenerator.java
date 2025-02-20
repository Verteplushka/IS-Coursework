package progym2004.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import progym2004.backend.entity.*;
import progym2004.backend.repository.*;
import progym2004.backend.repository.DietDayUserRepository;

import java.time.Clock;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DietGenerator {
    private final Clock clock;
    private final DietDayAdminRepository dietDayAdminRepository;
    private final MealDietDayAdminRepository mealDietDayAdminRepository;
    private final DietDayUserRepository dietDayUserRepository;
    private final WeightJournalRepository weightJournalRepository;
    private final int generatedDaysAmount = 30;

    @Autowired
    public DietGenerator(Clock clock, DietDayAdminRepository dietDayAdminRepository,
                         MealDietDayAdminRepository mealDietDayAdminRepository,
                         DietDayUserRepository dietDayUserRepository,
                         WeightJournalRepository weightJournalRepository) {
        this.clock = clock;
        this.dietDayAdminRepository = dietDayAdminRepository;
        this.mealDietDayAdminRepository = mealDietDayAdminRepository;
        this.dietDayUserRepository = dietDayUserRepository;
        this.weightJournalRepository = weightJournalRepository;
    }

    public void continueDiet(User user) {
        Double weight = weightJournalRepository.findTopByUserOrderByIdDesc(user).getWeight();
        List<DietDayAdmin> availableDietDays = dietDayAdminRepository.findAll();

        // Фильтруем доступные диеты, оставляя только те, где нет аллергенов
        List<DietDayAdmin> filteredDietDays = availableDietDays.stream()
                .filter(dietDay -> !hasAllergenMeals(dietDay, user))
                .collect(Collectors.toList());

        // Если после фильтрации список пустой, значит нет подходящей диеты
        if (filteredDietDays.isEmpty()) {
            throw new IllegalStateException("Нет доступных диет без аллергенов для пользователя " + user.getId());
        }

        int currentlyGeneratedDays = 0;
        while (currentlyGeneratedDays < generatedDaysAmount) {
            for (DietDayAdmin dietDay : filteredDietDays) {
                Double dailyCalories = calculateDailyCalories(user, weight);
                Double rate = dailyCalories / dietDay.getCalories();
                LocalDate dietDate = LocalDate.now(clock).plusDays(currentlyGeneratedDays);

                dietDayUserRepository.save(new DietDayUser(user, dietDay, rate, dietDate));
                currentlyGeneratedDays++;

                if (currentlyGeneratedDays == generatedDaysAmount) {
                    break;
                }
            }
        }
    }


    public void rewriteDiet(User user, Double weight) {
        // Удаляем все будущие и текущие DietDayUser для пользователя
        dietDayUserRepository.deleteAllByUserAndDayDateGreaterThanEqual(user, LocalDate.now(clock));

        List<DietDayAdmin> availableDietDays = dietDayAdminRepository.findAll();

        // Фильтруем доступные диеты, исключая те, где есть аллергены
        List<DietDayAdmin> filteredDietDays = availableDietDays.stream()
                .filter(dietDay -> !hasAllergenMeals(dietDay, user))
                .collect(Collectors.toList());

        // Если нет подходящих диет, выбрасываем исключение
        if (filteredDietDays.isEmpty()) {
            throw new IllegalStateException("Нет доступных диет без аллергенов для пользователя " + user.getId());
        }

        int currentlyGeneratedDays = 0;
        while (currentlyGeneratedDays < generatedDaysAmount) {
            for (DietDayAdmin dietDay : filteredDietDays) {
                Double dailyCalories = calculateDailyCalories(user, weight);
                Double rate = dailyCalories / dietDay.getCalories();
                LocalDate dietDate = LocalDate.now(clock).plusDays(currentlyGeneratedDays);

                // Создаём новый `DietDayUser`
                dietDayUserRepository.save(new DietDayUser(user, dietDay, rate, dietDate));
                currentlyGeneratedDays++;

                // Если уже сгенерировали нужное количество дней — выходим из цикла
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
        int age = Period.between(user.getBirthDate(), LocalDate.now(clock)).getYears();
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
