package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.*;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormRequest {
    private LocalDate birthDate;
    private Gender gender;
    private Double height;
    private Double currentWeight;
    private Goal goal;
    private Integer fitnessLevel;
    private Integer activityLevel;
    private Integer availableDays;
    private Set<Long> allergiesIds;
    private LocalDate startTraining;
    private DietPreference dietPreference;
}
