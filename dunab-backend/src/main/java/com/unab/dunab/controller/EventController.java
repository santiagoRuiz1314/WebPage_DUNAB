package com.unab.dunab.controller;

import com.unab.dunab.dto.request.EventoRequest;
import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.model.Evento;
import com.unab.dunab.service.EventoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de eventos institucionales
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventoService eventoService;

    /**
     * POST /api/events - Crear nuevo evento
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Evento>> crearEvento(@Valid @RequestBody EventoRequest request) {
        Evento evento = eventoService.crearEvento(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(evento, "Evento creado exitosamente"));
    }

    /**
     * GET /api/events - Obtener todos los eventos con paginación
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Evento>>> getAllEventos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Evento> eventos = eventoService.getAllEventos(page, size);
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }

    /**
     * GET /api/events/upcoming - Obtener eventos próximos
     */
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<Evento>>> getEventosProximos(
            @RequestParam(defaultValue = "3") int limit) {
        List<Evento> eventos = eventoService.getEventosProximos(limit);
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }

    /**
     * GET /api/events/{id} - Obtener evento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Evento>> getEvento(@PathVariable Long id) {
        Evento evento = eventoService.getEventoById(id);
        return ResponseEntity.ok(ApiResponse.success(evento));
    }

    /**
     * PUT /api/events/{id} - Actualizar evento
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Evento>> actualizarEvento(
            @PathVariable Long id,
            @Valid @RequestBody EventoRequest request) {
        Evento evento = eventoService.actualizarEvento(id, request);
        return ResponseEntity.ok(ApiResponse.success(evento, "Evento actualizado exitosamente"));
    }

    /**
     * DELETE /api/events/{id} - Eliminar evento (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarEvento(@PathVariable Long id) {
        eventoService.eliminarEvento(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Evento eliminado exitosamente"));
    }

    /**
     * GET /api/events/active - Obtener eventos activos
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Evento>>> getEventosActivos() {
        List<Evento> eventos = eventoService.getEventosActivos();
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }

    /**
     * GET /api/events/free - Obtener eventos gratuitos
     */
    @GetMapping("/free")
    public ResponseEntity<ApiResponse<List<Evento>>> getEventosGratuitos() {
        List<Evento> eventos = eventoService.getEventosGratuitos();
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }

    /**
     * GET /api/events/with-reward - Obtener eventos con recompensa
     */
    @GetMapping("/with-reward")
    public ResponseEntity<ApiResponse<List<Evento>>> getEventosConRecompensa() {
        List<Evento> eventos = eventoService.getEventosConRecompensa();
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }
}
