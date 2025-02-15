package progym2004.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import progym2004.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}

