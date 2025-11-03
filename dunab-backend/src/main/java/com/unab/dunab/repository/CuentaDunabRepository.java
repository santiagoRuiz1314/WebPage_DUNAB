package com.unab.dunab.repository;

import com.unab.dunab.model.AccountStatus;
import com.unab.dunab.model.CuentaDunab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaDunabRepository extends JpaRepository<CuentaDunab, Long> {

    Optional<CuentaDunab> findByEstudianteId(Long estudianteId);

    List<CuentaDunab> findByEstado(AccountStatus estado);

    List<CuentaDunab> findBySaldoActualGreaterThan(BigDecimal saldo);

    @Query("SELECT c FROM CuentaDunab c ORDER BY c.saldoActual DESC")
    List<CuentaDunab> findAllOrderBySaldoDesc();

    @Query("SELECT SUM(c.saldoActual) FROM CuentaDunab c WHERE c.estado = :estado")
    BigDecimal getTotalSaldoByEstado(AccountStatus estado);

    @Query("SELECT SUM(c.totalGanado) FROM CuentaDunab c WHERE c.estado = :estado")
    BigDecimal getTotalGanadoByEstado(AccountStatus estado);

    @Query("SELECT SUM(c.totalGastado) FROM CuentaDunab c WHERE c.estado = :estado")
    BigDecimal getTotalGastadoByEstado(AccountStatus estado);
}
