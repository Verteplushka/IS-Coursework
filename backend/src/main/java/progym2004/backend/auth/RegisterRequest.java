package progym2004.backend.auth;

import lombok.*;
import progym2004.backend.entity.Role;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  private String login;
  private String password;
  private Role role;
}
