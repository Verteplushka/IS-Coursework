package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "allergies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Allergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "allergy_id")
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
    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "allergies")
    private Set<User> users;

    @ManyToMany
    @JoinTable(
            name = "allergy_meal", // имя промежуточной таблицы
            joinColumns = @JoinColumn(name = "allergy_id"), // внешний ключ для Allergy
            inverseJoinColumns = @JoinColumn(name = "meal_id") // внешний ключ для Meal
    )
    private Set<Meal> meals;

    public Allergy(User user, String name, Set<Meal> meals){
        this.createdBy = user;
        this.name = name;
        this.meals = meals;
    }
}
