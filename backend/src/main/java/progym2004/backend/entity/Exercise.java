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
    private Long id;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private User createdBy;

    @Column(name = "when_created", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate whenCreated;

    @PrePersist
    protected void onCreate() {
        this.whenCreated = LocalDate.now();
    }

    @NotNull
    @Size(max = 50)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Size(max = 50)
    @Column(name = "muscle_group", nullable = false)
    @Enumerated(EnumType.STRING)
    private MuscleGroup muscleGroup;

    @Size(max = 200)
    @Column(name = "description")
    private String description;

    @NotNull
    @Size(max = 500)
    @Column(name = "execution_instructions", nullable = false)
    private String executionInstructions;

    @Column(name = "is_compound", nullable = false)
    private boolean isCompound;

    @ManyToMany(mappedBy = "exercises")
    private Set<TrainingDay> trainingDays;

    public Exercise(User user, String name, MuscleGroup muscleGroup, String description, String executionInstructions, boolean isCompound) {
        this.createdBy = user;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.description = description;
        this.executionInstructions = executionInstructions;
        this.isCompound = isCompound;
    }
}
