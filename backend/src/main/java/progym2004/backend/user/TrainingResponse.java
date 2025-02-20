package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingResponse {
    List<ExerciseDto> exercises;
    LocalDate trainingDate;
    boolean isCompleted;
    public TrainingResponse(List<ExerciseDto> exercises, LocalDate trainingDate){
        this.exercises = exercises;
        this.trainingDate = trainingDate;
        this.isCompleted = false;
    }
}
