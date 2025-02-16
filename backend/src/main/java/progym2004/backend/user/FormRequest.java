package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.Gender;
import progym2004.backend.entity.Role;

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
    private String goal;
    private Integer fitnessLevel;
    private Integer activityLevel;
    private Integer availableDays;
    private Set<Long> allergiesIds;
}
