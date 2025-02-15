package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "diet_day_admin")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DietDayAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_day_admin_id")
    private Long dietDayAdminId;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private User createdBy;

    @Column(name = "when_created", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate whenCreated;

    @DecimalMin("0")
    @DecimalMax("5000")
    @Column(name = "calories", nullable = false)
    private Double calories;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", nullable = false)
    private String name;
}


