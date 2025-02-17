package progym2004.backend.mapper;

import progym2004.backend.entity.TrainingDay;
import progym2004.backend.user.ExerciseDto;
import progym2004.backend.user.TrainingResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class TrainingMapper {

    public static List<TrainingResponse> mapTrainingDaysToResponses(List<TrainingDay> trainingDays) {
        return trainingDays.stream()
                .map(trainingDay -> {
                    LocalDate trainingDate = trainingDay.getTrainingDate();

                    Set<ExerciseDto> exercises = trainingDay.getExercises().stream()
                            .map(exercise -> new ExerciseDto(
                                    exercise.getId(),
                                    exercise.getName(),
                                    exercise.getMuscleGroup(),
                                    exercise.getDescription(),
                                    exercise.getExecutionInstructions()))
                            .collect(Collectors.toSet());

                    // Возвращаем объект TrainingResponse с маппированными данными
                    return new TrainingResponse(exercises, trainingDate);
                })
                .collect(Collectors.toList());  // Собираем в список
    }
}
