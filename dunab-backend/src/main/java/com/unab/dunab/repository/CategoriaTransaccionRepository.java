package com.unab.dunab.repository;

import com.unab.dunab.model.CategoriaTransaccion;
import com.unab.dunab.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaTransaccionRepository extends JpaRepository<CategoriaTransaccion, Long> {

    Optional<CategoriaTransaccion> findByNombre(String nombre);

    List<CategoriaTransaccion> findByTipo(TransactionType tipo);

    List<CategoriaTransaccion> findByActivaTrue();

    boolean existsByNombre(String nombre);
}
