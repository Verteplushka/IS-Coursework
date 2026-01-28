package progym2004.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "training_day")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "training_day_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(name = "training_date")
    private LocalDate trainingDate;

    @OneToMany(mappedBy = "trainingDay")
    private Set<ExerciseTrainingDay> exerciseTrainingDays;

    @Column(name = "is_completed")
    private Boolean isCompleted = false;

    public TrainingDay(User user, LocalDate trainingDate){
        this.user = user;
        this.trainingDate = trainingDate;
    }
}
