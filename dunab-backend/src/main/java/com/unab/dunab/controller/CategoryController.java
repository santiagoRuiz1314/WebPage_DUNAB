package com.unab.dunab.controller;

import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.model.CategoriaTransaccion;
import com.unab.dunab.model.TransactionType;
import com.unab.dunab.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de categorías de transacciones
 */
@RestController
@RequestMapping("/api/dunab/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoriaService categoriaService;

    /**
     * GET /api/dunab/categories - Obtener todas las categorías
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoriaTransaccion>>> getAllCategorias() {
        List<CategoriaTransaccion> categorias = categoriaService.getAllCategorias();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * GET /api/dunab/categories/active - Obtener categorías activas
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CategoriaTransaccion>>> getCategoriasActivas() {
        List<CategoriaTransaccion> categorias = categoriaService.getCategoriasActivas();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * GET /api/dunab/categories/{id} - Obtener categoría por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> getCategoria(@PathVariable Long id) {
        CategoriaTransaccion categoria = categoriaService.getCategoriaById(id);
        return ResponseEntity.ok(ApiResponse.success(categoria));
    }

    /**
     * GET /api/dunab/categories/by-name/{nombre} - Obtener categoría por nombre
     */
    @GetMapping("/by-name/{nombre}")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> getCategoriaByNombre(@PathVariable String nombre) {
        CategoriaTransaccion categoria = categoriaService.getCategoriaByNombre(nombre);
        return ResponseEntity.ok(ApiResponse.success(categoria));
    }

    /**
     * GET /api/dunab/categories/by-type - Obtener categorías por tipo
     */
    @GetMapping("/by-type")
    public ResponseEntity<ApiResponse<List<CategoriaTransaccion>>> getCategoriasByTipo(
            @RequestParam TransactionType tipo) {
        List<CategoriaTransaccion> categorias = categoriaService.getCategoriasByTipo(tipo);
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * POST /api/dunab/categories - Crear nueva categoría
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> crearCategoria(
            @Valid @RequestBody CategoriaTransaccion categoria) {
        CategoriaTransaccion nuevaCategoria = categoriaService.crearCategoria(categoria);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(nuevaCategoria, "Categoría creada exitosamente"));
    }

    /**
     * PUT /api/dunab/categories/{id} - Actualizar categoría
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaTransaccion categoria) {
        CategoriaTransaccion categoriaActualizada = categoriaService.actualizarCategoria(id, categoria);
        return ResponseEntity.ok(ApiResponse.success(categoriaActualizada, "Categoría actualizada exitosamente"));
    }

    /**
     * PUT /api/dunab/categories/{id}/status - Cambiar estado de categoría
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam boolean activa) {
        CategoriaTransaccion categoria = categoriaService.cambiarEstadoCategoria(id, activa);
        return ResponseEntity.ok(ApiResponse.success(categoria, "Estado actualizado exitosamente"));
    }

    /**
     * DELETE /api/dunab/categories/{id} - Eliminar categoría (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Categoría eliminada exitosamente"));
    }
}
