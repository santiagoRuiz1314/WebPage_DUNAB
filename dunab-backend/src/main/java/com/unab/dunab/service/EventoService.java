package com.unab.dunab.service;

import com.unab.dunab.dto.request.EventoRequest;
import com.unab.dunab.model.Evento;
import com.unab.dunab.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;

    /**
     * Crear nuevo evento
     */
    @Transactional
    public Evento crearEvento(EventoRequest request) {
        Evento evento = Evento.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .fechaEvento(request.getFechaEvento())
                .ubicacion(request.getUbicacion())
                .capacidadMaxima(request.getCapacidadMaxima())
                .costoDunab(request.getCostoDunab())
                .recompensaDunab(request.getRecompensaDunab())
                .requiereConfirmacion(request.getRequiereConfirmacion())
                .activo(true)
                .build();

        return eventoRepository.save(evento);
    }

    /**
     * Obtener todos los eventos con paginación
     */
    @Transactional(readOnly = true)
    public Page<Evento> getAllEventos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaEvento").descending());
        return eventoRepository.findAll(pageable);
    }

    /**
     * Obtener eventos próximos
     */
    @Transactional(readOnly = true)
    public List<Evento> getEventosProximos(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return eventoRepository.findEventosProximos(LocalDateTime.now());
    }

    /**
     * Obtener evento por ID
     */
    @Transactional(readOnly = true)
    public Evento getEventoById(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Evento no encontrado con ID: " + id
                ));
    }

    /**
     * Actualizar evento
     */
    @Transactional
    public Evento actualizarEvento(Long id, EventoRequest request) {
        Evento evento = getEventoById(id);

        evento.setNombre(request.getNombre());
        evento.setDescripcion(request.getDescripcion());
        evento.setFechaEvento(request.getFechaEvento());
        evento.setUbicacion(request.getUbicacion());
        evento.setCapacidadMaxima(request.getCapacidadMaxima());
        evento.setCostoDunab(request.getCostoDunab());
        evento.setRecompensaDunab(request.getRecompensaDunab());
        evento.setRequiereConfirmacion(request.getRequiereConfirmacion());

        return eventoRepository.save(evento);
    }

    /**
     * Eliminar evento (soft delete)
     */
    @Transactional
    public void eliminarEvento(Long id) {
        Evento evento = getEventoById(id);
        evento.setActivo(false);
        eventoRepository.save(evento);
    }

    /**
     * Obtener eventos activos
     */
    @Transactional(readOnly = true)
    public List<Evento> getEventosActivos() {
        return eventoRepository.findByActivoTrue();
    }

    /**
     * Obtener eventos gratuitos
     */
    @Transactional(readOnly = true)
    public List<Evento> getEventosGratuitos() {
        return eventoRepository.findEventosGratuitos();
    }

    /**
     * Obtener eventos con recompensa
     */
    @Transactional(readOnly = true)
    public List<Evento> getEventosConRecompensa() {
        return eventoRepository.findEventosConRecompensa();
    }
}
