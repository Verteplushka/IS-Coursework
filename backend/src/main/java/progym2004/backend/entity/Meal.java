package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "meals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_id")
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

    @DecimalMin("0")
    @DecimalMax("1000")
    @Column(name = "calories")
    private Double calories;

    @DecimalMin("0")
    @DecimalMax("100")
    @Column(name = "protein")
    private Double protein;

    @DecimalMin("0")
    @DecimalMax("100")
    @Column(name = "fats")
    private Double fats;

    @DecimalMin("0")
    @DecimalMax("100")
    @Column(name = "carbs")
    private Double carbs;

    @ManyToMany(mappedBy = "meals")
    private Set<Allergy> allergies;
}
