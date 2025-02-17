package progym2004.backend.admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import progym2004.backend.entity.MuscleGroup;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExerciseRequest {
    private String name;
    private MuscleGroup muscleGroup;
    private boolean isCompound;
    private String description;
    private String executionInstructions;
}
