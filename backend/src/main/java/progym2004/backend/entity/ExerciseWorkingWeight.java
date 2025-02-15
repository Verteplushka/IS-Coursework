package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "exercise_working_weight")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseWorkingWeight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_working_weight_id")
    private Long exerciseWorkingWeightId;

    @ManyToOne
    @JoinColumn(name = "exercise_id", referencedColumnName = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @DecimalMin("0")
    @DecimalMax("1000")
    @Column(name = "weight")
    private Double weight;

    @Column(name = "weight_date", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate weightDate;
}

