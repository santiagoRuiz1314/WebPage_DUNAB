package com.unab.dunab.repository;

import com.unab.dunab.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    List<Evento> findByActivoTrue();

    List<Evento> findByFechaEventoAfter(LocalDateTime fecha);

    List<Evento> findByFechaEventoBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT e FROM Evento e WHERE e.activo = true AND e.fechaEvento > :ahora ORDER BY e.fechaEvento ASC")
    List<Evento> findEventosProximos(@Param("ahora") LocalDateTime ahora);

    @Query("SELECT e FROM Evento e WHERE e.activo = true AND e.costoDunab = 0")
    List<Evento> findEventosGratuitos();

    @Query("SELECT e FROM Evento e WHERE e.activo = true AND e.recompensaDunab > 0")
    List<Evento> findEventosConRecompensa();
}
