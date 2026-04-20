package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.enums.Role;
import com.example.Disaster_Relief.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
}
