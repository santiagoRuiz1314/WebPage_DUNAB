package com.unab.dunab.repository;

import com.unab.dunab.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByCodigoEstudiante(String codigoEstudiante);

    boolean existsByEmail(String email);

    boolean existsByCodigoEstudiante(String codigoEstudiante);
}
