package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "meal_diet_day_admin")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealDietDayAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meal_diet_day_admin_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "diet_day_admin_id", referencedColumnName = "diet_day_admin_id", nullable = false)
    private DietDayAdmin dietDayAdmin;

    @ManyToOne
    @JoinColumn(name = "meal_id", referencedColumnName = "meal_id", nullable = false)
    private Meal meal;

    @DecimalMin("0")
    @DecimalMax("1000")
    @Column(name = "portion_size")
    private Double portionSize;
}

