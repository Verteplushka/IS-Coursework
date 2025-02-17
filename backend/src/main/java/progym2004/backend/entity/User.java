package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @DecimalMax("100")
    @DecimalMax("250")
    @Column(name = "height")
    private Double height;

    @Enumerated(EnumType.STRING)
    private Goal goal;

    @Column(name = "fitness_level")
    private Integer fitnessLevel;

    @Column(name = "activity_level")
    private Integer activityLevel;

    @Min(1)
    @Max(7)
    @Column(name = "available_days")
    private Integer availableDays;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public User(String login, String password){
        this.login = login;
        this.password = password;
    }

    public User(User other) {
        this.id = other.id;
        this.login = other.login;
        this.password = other.password;
        this.registrationDate = other.registrationDate;
        this.birthDate = other.birthDate;
        this.gender = other.gender;
        this.height = other.height;
        this.goal = other.goal;
        this.fitnessLevel = other.fitnessLevel;
        this.activityLevel = other.activityLevel;
        this.availableDays = other.availableDays;
        this.role = other.role;
        this.allergies = other.allergies != null ? new HashSet<>(other.allergies) : null;
        this.achievements = other.achievements != null ? new HashSet<>(other.achievements) : null;
    }
}
