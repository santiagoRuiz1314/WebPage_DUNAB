package com.unab.dunab.service;

import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.Notificacion;
import com.unab.dunab.model.User;
import com.unab.dunab.repository.NotificacionRepository;
import com.unab.dunab.repository.UserRepository;
import com.unab.dunab.utils.NotificationQueue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de notificaciones que utiliza una Cola (Queue) para gestionar
 * las notificaciones en memoria antes de persistirlas.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificacionRepository notificacionRepository;
    private final UserRepository userRepository;
    private final NotificationQueue notificationQueue;

    /**
     * Crea y encola una nueva notificación
     */
    @Transactional
    public Notificacion crearNotificacion(Long estudianteId, String tipo, String mensaje) {
        User estudiante = userRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", estudianteId));

        Notificacion notificacion = Notificacion.builder()
                .estudiante(estudiante)
                .tipo(tipo)
                .mensaje(mensaje)
                .leida(false)
                .build();

        // Guardar en base de datos
        notificacion = notificacionRepository.save(notificacion);

        // Agregar a la cola (Queue) para procesamiento en memoria
        notificationQueue.enqueue(notificacion);

        log.info("Notificación creada y encolada - ID: {}, Estudiante: {}, Tipo: {}",
                notificacion.getId(), estudianteId, tipo);

        return notificacion;
    }

    /**
     * Obtiene todas las notificaciones de un estudiante
     */
    @Transactional(readOnly = true)
    public List<Notificacion> getNotificacionesByEstudiante(Long estudianteId) {
        return notificacionRepository.findByEstudianteIdOrderByFechaCreacionDesc(estudianteId);
    }

    /**
     * Obtiene notificaciones no leídas de un estudiante
     */
    @Transactional(readOnly = true)
    public List<Notificacion> getNotificacionesNoLeidas(Long estudianteId) {
        return notificacionRepository.findByEstudianteIdAndLeida(estudianteId, false);
    }

    /**
     * Cuenta las notificaciones no leídas
     */
    @Transactional(readOnly = true)
    public Long contarNoLeidas(Long estudianteId) {
        return notificacionRepository.countNoLeidas(estudianteId);
    }

    /**
     * Marca una notificación como leída
     */
    @Transactional
    public Notificacion marcarComoLeida(Long notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación", "id", notificacionId));

        notificacion.marcarComoLeida();
        return notificacionRepository.save(notificacion);
    }

    /**
     * Elimina una notificación
     */
    @Transactional
    public void eliminarNotificacion(Long notificacionId) {
        if (!notificacionRepository.existsById(notificacionId)) {
            throw new ResourceNotFoundException("Notificación", "id", notificacionId);
        }
        notificacionRepository.deleteById(notificacionId);
    }

    /**
     * Procesa la siguiente notificación de la cola (dequeue)
     */
    public Notificacion procesarSiguienteNotificacion() {
        return notificationQueue.dequeue().orElse(null);
    }

    /**
     * Obtiene estadísticas de la cola de notificaciones
     */
    public String getEstadisticasQueue() {
        return notificationQueue.getEstadisticas();
    }

    // Métodos helper para crear notificaciones específicas

    public Notificacion notificarCredito(Long estudianteId, String monto, String descripcion) {
        String mensaje = String.format("Has recibido %s DUNAB por %s", monto, descripcion);
        return crearNotificacion(estudianteId, Notificacion.TIPO_CREDITO, mensaje);
    }

    public Notificacion notificarDebito(Long estudianteId, String monto, String descripcion) {
        String mensaje = String.format("Se han debitado %s DUNAB por %s", monto, descripcion);
        return crearNotificacion(estudianteId, Notificacion.TIPO_DEBITO, mensaje);
    }

    public Notificacion notificarEvento(Long estudianteId, String nombreEvento, String dias) {
        String mensaje = String.format("Evento próximo: %s - %s días", nombreEvento, dias);
        return crearNotificacion(estudianteId, Notificacion.TIPO_EVENTO, mensaje);
    }

    public Notificacion notificarLogro(Long estudianteId, String descripcion) {
        String mensaje = String.format("¡Nuevo logro desbloqueado! %s", descripcion);
        return crearNotificacion(estudianteId, Notificacion.TIPO_LOGRO, mensaje);
    }
}
