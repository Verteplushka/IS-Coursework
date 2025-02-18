package progym2004.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import progym2004.backend.user.ExerciseDto;
import progym2004.backend.user.TrainingGenerator;

import java.time.LocalDate;

@Entity
@Table(name = "exercise_training_day")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseTrainingDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_training_day_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "training_day_id", referencedColumnName = "training_day_id", nullable = false)
    private TrainingDay trainingDay;

    @ManyToOne
    @JoinColumn(name = "exercise_id", referencedColumnName = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "exercise_number", nullable = false)
    private Integer exerciseNumber;

    @Column(name = "sets")
    private Integer sets;

    @Column(name = "repetitions")
    private Integer repetitions;

    public ExerciseTrainingDay(TrainingDay trainingDay, Exercise exercise, Integer exerciseNumber, Integer sets, Integer repetitions) {
        this.trainingDay = trainingDay;
        this.exercise = exercise;
        this.exerciseNumber = exerciseNumber;
        this.sets = sets;
        this.repetitions = repetitions;
    }

}

