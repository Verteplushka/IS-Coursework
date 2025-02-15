package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "login", unique = true, nullable = false)
    private String login;

    @NotNull
    @Size(min = 8)
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "registration_date", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate registrationDate;

    @Past
    @Column(name = "birth_date")
    private LocalDate birthDate;

    @DecimalMax("100")
    @DecimalMax("250")
    @Column(name = "height")
    private Double height;

    @Size(max = 50)
    @Column(name = "goal")
    private String goal;

    @Min(1)
    @Max(3)
    @Column(name = "fitness_level")
    private Integer fitnessLevel;

    @Min(1)
    @Max(5)
    @Column(name = "activity_level")
    private Integer activityLevel;

    @Min(1)
    @Max(7)
    @Column(name = "available_days")
    private Integer availableDays;

    @NotNull
    @Column(name = "role", nullable = false)
    private String role;

    @ManyToMany
    @JoinTable(
            name = "user_allergy",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "allergy_id")
    )
    private Set<Allergy> allergies;

    @ManyToMany
    @JoinTable(
            name = "user_achievement", // имя промежуточной таблицы
            joinColumns = @JoinColumn(name = "user_id"), // внешний ключ для User
            inverseJoinColumns = @JoinColumn(name = "achievement_id") // внешний ключ для Achievement
    )
    private Set<Achievement> achievements;
}
