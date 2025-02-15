package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "achievement")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "achievement_id")
    private Long achievementId;

    @ManyToOne
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", nullable = false)
    private User createdBy;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 200)
    @Column(name = "description")
    private String description;

    @Column(name = "when_created", columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate whenCreated;

    @ManyToMany(mappedBy = "achievements")
    private Set<User> users;
}
