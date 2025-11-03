package com.unab.dunab.utils;

import com.unab.dunab.model.Notificacion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.Optional;
import java.util.Queue;
import java.util.stream.Collectors;

/**
 * Cola (Queue) para gestión de notificaciones del sistema DUNAB.
 * Implementa FIFO (First In, First Out) - Las primeras notificaciones en entrar son las primeras en salir.
 *
 * Caso de uso: Gestionar notificaciones de movimientos DUNAB y eventos próximos.
 *
 * Operaciones principales:
 * - enqueue: Agregar notificación a la cola
 * - dequeue: Obtener y remover la primera notificación
 * - peek: Ver la primera notificación sin removerla
 * - isEmpty: Verificar si la cola está vacía
 * - size: Obtener cantidad de notificaciones en cola
 */
@Slf4j
@Component
public class NotificationQueue {

    private final Queue<Notificacion> queue;

    public NotificationQueue() {
        this.queue = new LinkedList<>();
        log.info("NotificationQueue inicializada - Estructura: Queue (FIFO)");
    }

    /**
     * Agrega una notificación al final de la cola (enqueue)
     * Complejidad temporal: O(1)
     *
     * @param notificacion Notificación a agregar
     * @return true si se agregó exitosamente
     */
    public boolean enqueue(Notificacion notificacion) {
        if (notificacion == null) {
            log.warn("Intento de agregar notificación nula a la cola");
            return false;
        }

        boolean resultado = queue.offer(notificacion);
        if (resultado) {
            log.debug("Notificación agregada a la cola. ID: {}, Estudiante: {}, Tipo: {}",
                     notificacion.getId(),
                     notificacion.getEstudiante().getId(),
                     notificacion.getTipo());
        }
        return resultado;
    }

    /**
     * Obtiene y remueve la primera notificación de la cola (dequeue)
     * Complejidad temporal: O(1)
     *
     * @return Optional con la notificación o empty si la cola está vacía
     */
    public Optional<Notificacion> dequeue() {
        Notificacion notificacion = queue.poll();
        if (notificacion != null) {
            log.debug("Notificación removida de la cola. ID: {}, Estudiante: {}",
                     notificacion.getId(),
                     notificacion.getEstudiante().getId());
        } else {
            log.debug("Intento de dequeue en cola vacía");
        }
        return Optional.ofNullable(notificacion);
    }

    /**
     * Obtiene la primera notificación sin removerla (peek)
     * Complejidad temporal: O(1)
     *
     * @return Optional con la notificación o empty si la cola está vacía
     */
    public Optional<Notificacion> peek() {
        return Optional.ofNullable(queue.peek());
    }

    /**
     * Verifica si la cola está vacía
     * Complejidad temporal: O(1)
     *
     * @return true si la cola no tiene elementos
     */
    public boolean isEmpty() {
        return queue.isEmpty();
    }

    /**
     * Obtiene el tamaño de la cola
     * Complejidad temporal: O(1)
     *
     * @return Cantidad de notificaciones en la cola
     */
    public int size() {
        return queue.size();
    }

    /**
     * Limpia todas las notificaciones de la cola
     * Complejidad temporal: O(1)
     */
    public void clear() {
        int size = queue.size();
        queue.clear();
        log.info("Cola de notificaciones limpiada. Elementos removidos: {}", size);
    }

    /**
     * Obtiene notificaciones de un estudiante específico sin removerlas
     * Complejidad temporal: O(n)
     *
     * @param estudianteId ID del estudiante
     * @return Lista de notificaciones del estudiante
     */
    public java.util.List<Notificacion> getNotificacionesByEstudiante(Long estudianteId) {
        return queue.stream()
                .filter(n -> n.getEstudiante().getId().equals(estudianteId))
                .collect(Collectors.toList());
    }

    /**
     * Remueve notificaciones de un estudiante específico
     * Complejidad temporal: O(n)
     *
     * @param estudianteId ID del estudiante
     * @return Cantidad de notificaciones removidas
     */
    public int removeNotificacionesByEstudiante(Long estudianteId) {
        int initialSize = queue.size();
        queue.removeIf(n -> n.getEstudiante().getId().equals(estudianteId));
        int removedCount = initialSize - queue.size();

        if (removedCount > 0) {
            log.info("Notificaciones removidas de la cola para estudiante {}: {}",
                     estudianteId, removedCount);
        }
        return removedCount;
    }

    /**
     * Obtiene estadísticas de la cola
     *
     * @return String con información de la cola
     */
    public String getEstadisticas() {
        return String.format("Cola de Notificaciones - Tamaño: %d, Vacía: %s",
                           size(), isEmpty());
    }
}
