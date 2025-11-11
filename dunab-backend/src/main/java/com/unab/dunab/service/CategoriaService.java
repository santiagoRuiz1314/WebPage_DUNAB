package com.unab.dunab.service;

import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.CategoriaTransaccion;
import com.unab.dunab.model.TransactionType;
import com.unab.dunab.repository.CategoriaTransaccionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Servicio para gestión de categorías de transacciones
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaTransaccionRepository categoriaRepository;

    /**
     * Obtiene todas las categorías
     */
    @Transactional(readOnly = true)
    public List<CategoriaTransaccion> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    /**
     * Obtiene las categorías activas
     */
    @Transactional(readOnly = true)
    public List<CategoriaTransaccion> getCategoriasActivas() {
        return categoriaRepository.findByActivaTrue();
    }

    /**
     * Obtiene una categoría por ID
     */
    @Transactional(readOnly = true)
    public CategoriaTransaccion getCategoriaById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", id));
    }

    /**
     * Obtiene una categoría por nombre
     */
    @Transactional(readOnly = true)
    public CategoriaTransaccion getCategoriaByNombre(String nombre) {
        return categoriaRepository.findByNombre(nombre)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", "nombre", nombre));
    }

    /**
     * Obtiene categorías por tipo
     */
    @Transactional(readOnly = true)
    public List<CategoriaTransaccion> getCategoriasByTipo(TransactionType tipo) {
        return categoriaRepository.findByTipo(tipo);
    }

    /**
     * Crea una nueva categoría
     */
    @Transactional
    public CategoriaTransaccion crearCategoria(CategoriaTransaccion categoria) {
        if (categoriaRepository.existsByNombre(categoria.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una categoría con el nombre: " + categoria.getNombre()
            );
        }
        return categoriaRepository.save(categoria);
    }

    /**
     * Actualiza una categoría
     */
    @Transactional
    public CategoriaTransaccion actualizarCategoria(Long id, CategoriaTransaccion categoriaActualizada) {
        CategoriaTransaccion categoria = getCategoriaById(id);

        if (categoriaActualizada.getNombre() != null) {
            // Verificar que el nuevo nombre no exista en otra categoría
            if (!categoria.getNombre().equals(categoriaActualizada.getNombre()) &&
                    categoriaRepository.existsByNombre(categoriaActualizada.getNombre())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Ya existe una categoría con el nombre: " + categoriaActualizada.getNombre()
                );
            }
            categoria.setNombre(categoriaActualizada.getNombre());
        }
        if (categoriaActualizada.getDescripcion() != null) {
            categoria.setDescripcion(categoriaActualizada.getDescripcion());
        }
        if (categoriaActualizada.getTipo() != null) {
            categoria.setTipo(categoriaActualizada.getTipo());
        }

        return categoriaRepository.save(categoria);
    }

    /**
     * Activa o desactiva una categoría
     */
    @Transactional
    public CategoriaTransaccion cambiarEstadoCategoria(Long id, boolean activa) {
        CategoriaTransaccion categoria = getCategoriaById(id);
        categoria.setActiva(activa);
        return categoriaRepository.save(categoria);
    }

    /**
     * Elimina una categoría (soft delete)
     */
    @Transactional
    public void eliminarCategoria(Long id) {
        CategoriaTransaccion categoria = getCategoriaById(id);
        categoria.setActiva(false);
        categoriaRepository.save(categoria);
        log.info("Categoría desactivada - ID: {}", id);
    }
}
