package progym2004.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "training_day")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "training_day_id")
    private Long trainingDayId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @Column(name = "training_date")
    private LocalDate trainingDate;

    @ManyToMany
    @JoinTable(
            name = "exercise_training_day", // имя промежуточной таблицы
            joinColumns = @JoinColumn(name = "training_day_id"), // внешний ключ для TrainingDay
            inverseJoinColumns = @JoinColumn(name = "exercise_id") // внешний ключ для Exercise
    )
    private Set<Exercise> exercises;
}
