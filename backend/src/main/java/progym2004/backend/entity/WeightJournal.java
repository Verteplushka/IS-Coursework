package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "weight_journal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WeightJournal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weight_journal_id")
    private Long weightJournalId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", nullable = false)
    private User user;

    @DecimalMin("0")
    @DecimalMax("400")
    @Column(name = "weight", nullable = false)
    private Double weight;

    @Column(name = "weight_date", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate weightDate;
}

