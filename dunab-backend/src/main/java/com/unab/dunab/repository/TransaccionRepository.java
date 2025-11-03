package com.unab.dunab.repository;

import com.unab.dunab.model.Transaccion;
import com.unab.dunab.model.TransactionStatus;
import com.unab.dunab.model.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    List<Transaccion> findByCuentaId(Long cuentaId);

    Page<Transaccion> findByCuentaId(Long cuentaId, Pageable pageable);

    List<Transaccion> findByCuentaIdOrderByFechaCreacionDesc(Long cuentaId);

    List<Transaccion> findByTipo(TransactionType tipo);

    List<Transaccion> findByEstado(TransactionStatus estado);

    List<Transaccion> findByCuentaIdAndTipo(Long cuentaId, TransactionType tipo);

    List<Transaccion> findByCuentaIdAndEstado(Long cuentaId, TransactionStatus estado);

    @Query("SELECT t FROM Transaccion t WHERE t.cuenta.id = :cuentaId " +
           "AND t.fechaCreacion BETWEEN :fechaInicio AND :fechaFin")
    List<Transaccion> findByCuentaIdAndFechaBetween(
            @Param("cuentaId") Long cuentaId,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    @Query("SELECT t FROM Transaccion t WHERE t.cuenta.id = :cuentaId " +
           "AND t.tipo = :tipo AND t.estado = :estado")
    List<Transaccion> findByCuentaIdAndTipoAndEstado(
            @Param("cuentaId") Long cuentaId,
            @Param("tipo") TransactionType tipo,
            @Param("estado") TransactionStatus estado);

    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.cuenta.id = :cuentaId " +
           "AND t.tipo = :tipo AND t.estado = 'COMPLETADA'")
    BigDecimal getTotalByTipo(
            @Param("cuentaId") Long cuentaId,
            @Param("tipo") TransactionType tipo);

    @Query("SELECT t FROM Transaccion t WHERE t.cuenta.id = :cuentaId " +
           "AND t.categoria.id = :categoriaId")
    List<Transaccion> findByCuentaIdAndCategoriaId(
            @Param("cuentaId") Long cuentaId,
            @Param("categoriaId") Long categoriaId);

    @Query("SELECT COUNT(t) FROM Transaccion t WHERE t.cuenta.id = :cuentaId " +
           "AND t.estado = 'COMPLETADA'")
    Long countTransaccionesCompletadas(@Param("cuentaId") Long cuentaId);
}
