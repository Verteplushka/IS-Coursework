package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "diet_day_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DietDayUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_day_user_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "diet_day_id", referencedColumnName = "diet_day_admin_id", nullable = false)
    private DietDayAdmin dietDayAdmin;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @DecimalMin("0")
    @DecimalMax("100")
    @Column(name = "rate")
    private Double rate;

    @Column(name = "day_date", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate dayDate;
}

