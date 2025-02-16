package progym2004.backend.form;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.Allergy;
import progym2004.backend.entity.Role;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FormRequest {
    private LocalDate birthDate;
    private Double height;
    private Double currentWeight;
    private String goal;
    private Integer fitnessLevel;
    private Integer activityLevel;
    private Integer availableDays;
    private Role role;
    private Set<Allergy> allergies;
    private LocalDate trainingStartDate;
}
