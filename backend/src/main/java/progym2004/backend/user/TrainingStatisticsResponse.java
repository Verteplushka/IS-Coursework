package progym2004.backend.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Month;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingStatisticsResponse {
    private long totalTrainings;
    private long completedTrainings;
    private double completionPercentage;
    private double averageExercisesPerTraining;
    private Map<Month, Long> trainingMonthCount;
    private Map<Month, Long> completedTrainingMonthCount;
    private LocalDate firstTrainingDate;
    private long totalCompletedExercises;
    private long cardioExercisesCount;
}

