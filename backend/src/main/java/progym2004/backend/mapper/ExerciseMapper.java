package progym2004.backend.mapper;

import progym2004.backend.entity.Exercise;
import progym2004.backend.entity.ExerciseTrainingDay;
import progym2004.backend.user.ExerciseDto;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class ExerciseMapper {
    public static List<ExerciseDto> toDtos(List<ExerciseTrainingDay> exerciseTrainingDays){
        return exerciseTrainingDays.stream()
                .map(exerciseTrainingDay -> new ExerciseDto(
                        exerciseTrainingDay.getExerciseNumber(),
                        exerciseTrainingDay.getExercise().getName(),
                        exerciseTrainingDay.getExercise().getMuscleGroup(),
                        exerciseTrainingDay.getExercise().getDescription(),
                        exerciseTrainingDay.getExercise().getExecutionInstructions(),
                        exerciseTrainingDay.getSets(),
                        exerciseTrainingDay.getRepetitions()
                ))
                .collect(Collectors.toList());
    }
}
