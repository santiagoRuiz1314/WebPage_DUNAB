package com.unab.dunab.repository;

import com.unab.dunab.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByEstudianteIdOrderByFechaCreacionDesc(Long estudianteId);

    List<Notificacion> findByEstudianteIdAndLeida(Long estudianteId, Boolean leida);

    @Query("SELECT COUNT(n) FROM Notificacion n WHERE n.estudiante.id = :estudianteId AND n.leida = false")
    Long countNoLeidas(@Param("estudianteId") Long estudianteId);

    List<Notificacion> findByTipo(String tipo);

    void deleteByEstudianteId(Long estudianteId);
}
