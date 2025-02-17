package progym2004.backend.mapper;

import progym2004.backend.entity.Exercise;
import progym2004.backend.user.ExerciseDto;

import java.util.Set;
import java.util.stream.Collectors;

public class ExerciseMapper {
    public static Set<ExerciseDto> toDtos(Set<Exercise> exercises){
        return exercises.stream()
                .map(exercise -> new ExerciseDto(
                        exercise.getId(),
                        exercise.getName(),
                        exercise.getMuscleGroup(),
                        exercise.getDescription(),
                        exercise.getExecutionInstructions()
                ))
                .collect(Collectors.toSet());
    }
}
