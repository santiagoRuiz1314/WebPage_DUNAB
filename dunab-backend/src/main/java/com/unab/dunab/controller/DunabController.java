package com.unab.dunab.controller;

import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.dto.response.CuentaDunabResponse;
import com.unab.dunab.model.AccountStatus;
import com.unab.dunab.service.DunabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controlador de cuentas DUNAB
 */
@RestController
@RequestMapping("/api/dunab")
@RequiredArgsConstructor
public class DunabController {

    private final DunabService dunabService;

    /**
     * POST /api/dunab/accounts - Crear cuenta DUNAB
     */
    @PostMapping("/accounts")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> crearCuenta(@RequestParam Long estudianteId) {
        CuentaDunabResponse response = dunabService.crearCuenta(estudianteId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Cuenta DUNAB creada exitosamente"));
    }

    /**
     * GET /api/dunab/accounts/{id} - Consultar cuenta específica
     */
    @GetMapping("/accounts/{id}")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> getCuenta(@PathVariable Long id) {
        CuentaDunabResponse response = dunabService.getCuentaById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/dunab/accounts/student/{estudianteId} - Consultar cuenta por estudiante
     */
    @GetMapping("/accounts/student/{estudianteId}")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> getCuentaByEstudiante(@PathVariable Long estudianteId) {
        CuentaDunabResponse response = dunabService.getCuentaByEstudianteId(estudianteId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/dunab/accounts/{id}/balance - Consultar saldo
     */
    @GetMapping("/accounts/{id}/balance")
    public ResponseEntity<ApiResponse<BigDecimal>> getSaldo(@PathVariable Long id) {
        BigDecimal saldo = dunabService.getSaldo(id);
        return ResponseEntity.ok(ApiResponse.success(saldo, "Saldo obtenido exitosamente"));
    }

    /**
     * GET /api/dunab/accounts - Listar todas las cuentas
     */
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<CuentaDunabResponse>>> getAllCuentas() {
        List<CuentaDunabResponse> cuentas = dunabService.getAllCuentas();
        return ResponseEntity.ok(ApiResponse.success(cuentas));
    }

    /**
     * GET /api/dunab/ranking - Ranking de estudiantes por saldo
     */
    @GetMapping("/ranking")
    public ResponseEntity<ApiResponse<List<CuentaDunabResponse>>> getRanking() {
        List<CuentaDunabResponse> ranking = dunabService.getRanking();
        return ResponseEntity.ok(ApiResponse.success(ranking, "Ranking obtenido exitosamente"));
    }

    /**
     * PUT /api/dunab/accounts/{id}/limite - Actualizar límite de transacción
     */
    @PutMapping("/accounts/{id}/limite")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> actualizarLimite(
            @PathVariable Long id,
            @RequestParam BigDecimal nuevoLimite) {
        CuentaDunabResponse response = dunabService.actualizarLimite(id, nuevoLimite);
        return ResponseEntity.ok(ApiResponse.success(response, "Límite actualizado exitosamente"));
    }

    /**
     * PUT /api/dunab/accounts/{id}/estado - Cambiar estado de cuenta
     */
    @PutMapping("/accounts/{id}/estado")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam AccountStatus nuevoEstado) {
        CuentaDunabResponse response = dunabService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponse.success(response, "Estado actualizado exitosamente"));
    }

    /**
     * PUT /api/dunab/accounts/{id}/suspender - Suspender cuenta
     */
    @PutMapping("/accounts/{id}/suspender")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> suspenderCuenta(@PathVariable Long id) {
        CuentaDunabResponse response = dunabService.suspenderCuenta(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Cuenta suspendida exitosamente"));
    }

    /**
     * PUT /api/dunab/accounts/{id}/activar - Activar cuenta
     */
    @PutMapping("/accounts/{id}/activar")
    public ResponseEntity<ApiResponse<CuentaDunabResponse>> activarCuenta(@PathVariable Long id) {
        CuentaDunabResponse response = dunabService.activarCuenta(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Cuenta activada exitosamente"));
    }

    /**
     * GET /api/dunab/statistics - Estadísticas generales
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEstadisticasGenerales() {
        Map<String, Object> estadisticas = dunabService.getEstadisticasGenerales();
        return ResponseEntity.ok(ApiResponse.success(estadisticas, "Estadísticas obtenidas exitosamente"));
    }

    /**
     * GET /api/dunab/statistics/{cuentaId} - Estadísticas por cuenta
     */
    @GetMapping("/statistics/{cuentaId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEstadisticasCuenta(@PathVariable Long cuentaId) {
        Map<String, Object> estadisticas = dunabService.getEstadisticasCuenta(cuentaId);
        return ResponseEntity.ok(ApiResponse.success(estadisticas));
    }

    /**
     * DELETE /api/dunab/accounts/{id} - Eliminar cuenta (soft delete)
     */
    @DeleteMapping("/accounts/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminarCuenta(@PathVariable Long id) {
        dunabService.eliminarCuenta(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Cuenta eliminada exitosamente"));
    }
}
