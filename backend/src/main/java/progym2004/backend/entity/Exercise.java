package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exercise_id")
    private Long exerciseId;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private User createdBy;

    @Column(name = "when_created", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate whenCreated;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Size(max = 50)
    @Column(name = "muscle_group", nullable = false)
    private String muscleGroup;

    @Size(max = 200)
    @Column(name = "description")
    private String description;

    @ManyToMany(mappedBy = "exercises")
    private Set<TrainingDay> trainingDays;
}
