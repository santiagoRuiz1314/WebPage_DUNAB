package com.unab.dunab.controller;

import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.model.Notificacion;
import com.unab.dunab.security.UserPrincipal;
import com.unab.dunab.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de notificaciones
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * GET /api/notifications - Obtener notificaciones del usuario actual
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notificacion>>> getNotificaciones(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Notificacion> notificaciones = notificationService.getNotificacionesByEstudiante(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(notificaciones));
    }

    /**
     * GET /api/notifications/unread - Obtener notificaciones no leídas
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notificacion>>> getNotificacionesNoLeidas(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Notificacion> notificaciones = notificationService.getNotificacionesNoLeidas(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(notificaciones));
    }

    /**
     * GET /api/notifications/count - Contar notificaciones no leídas
     */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> contarNoLeidas(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long count = notificationService.contarNoLeidas(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * PUT /api/notifications/{id}/read - Marcar como leída
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notificacion>> marcarComoLeida(@PathVariable Long id) {
        Notificacion notificacion = notificationService.marcarComoLeida(id);
        return ResponseEntity.ok(ApiResponse.success(notificacion, "Notificación marcada como leída"));
    }

    /**
     * DELETE /api/notifications/{id} - Eliminar notificación
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarNotificacion(@PathVariable Long id) {
        notificationService.eliminarNotificacion(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Notificación eliminada exitosamente"));
    }

    /**
     * GET /api/notifications/queue/stats - Estadísticas de la Queue
     */
    @GetMapping("/queue/stats")
    public ResponseEntity<ApiResponse<String>> getEstadisticasQueue() {
        String stats = notificationService.getEstadisticasQueue();
        return ResponseEntity.ok(ApiResponse.success(stats, "Estadísticas de la Queue de notificaciones"));
    }
}
