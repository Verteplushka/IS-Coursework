package progym2004.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @DecimalMax("100")
    @DecimalMax("250")
    @Column(name = "height")
    private Double height;

    @Size(max = 50)
    @Column(name = "goal")
    private String goal;

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

}
