package com.unab.dunab.controller;

import com.unab.dunab.dto.request.TransaccionRequest;
import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.dto.response.TransaccionResponse;
import com.unab.dunab.model.TransactionType;
import com.unab.dunab.security.UserPrincipal;
import com.unab.dunab.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador de transacciones DUNAB
 */
@RestController
@RequestMapping("/api/dunab/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * POST /api/dunab/transactions - Crear transacción
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TransaccionResponse>> crearTransaccion(
            @Valid @RequestBody TransaccionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TransaccionResponse response = transactionService.crearTransaccion(request, currentUser.getId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Transacción creada exitosamente"));
    }

    /**
     * GET /api/dunab/transactions/{id} - Consultar transacción específica
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransaccionResponse>> getTransaccion(@PathVariable Long id) {
        TransaccionResponse response = transactionService.getTransaccionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId} - Historial de cuenta
     */
    @GetMapping("/cuenta/{cuentaId}")
    public ResponseEntity<ApiResponse<List<TransaccionResponse>>> getTransaccionesByCuenta(
            @PathVariable Long cuentaId) {
        List<TransaccionResponse> transacciones = transactionService.getTransaccionesByCuenta(cuentaId);
        return ResponseEntity.ok(ApiResponse.success(transacciones));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/paginado - Historial paginado
     */
    @GetMapping("/cuenta/{cuentaId}/paginado")
    public ResponseEntity<ApiResponse<Page<TransaccionResponse>>> getTransaccionesPaginadas(
            @PathVariable Long cuentaId,
            Pageable pageable) {
        Page<TransaccionResponse> transacciones = transactionService.getTransaccionesByCuentaPaginado(cuentaId, pageable);
        return ResponseEntity.ok(ApiResponse.success(transacciones));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/recientes - Transacciones recientes (desde Stack)
     */
    @GetMapping("/cuenta/{cuentaId}/recientes")
    public ResponseEntity<ApiResponse<List<TransaccionResponse>>> getTransaccionesRecientes(
            @PathVariable Long cuentaId,
            @RequestParam(defaultValue = "10") int limit) {
        List<TransaccionResponse> transacciones = transactionService.getTransaccionesRecientes(cuentaId, limit);
        return ResponseEntity.ok(ApiResponse.success(transacciones, "Transacciones recientes obtenidas desde el Stack"));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/filtrar - Filtrar por fechas
     */
    @GetMapping("/cuenta/{cuentaId}/filtrar")
    public ResponseEntity<ApiResponse<List<TransaccionResponse>>> filtrarPorFechas(
            @PathVariable Long cuentaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        List<TransaccionResponse> transacciones = transactionService.getTransaccionesByFechas(cuentaId, fechaInicio, fechaFin);
        return ResponseEntity.ok(ApiResponse.success(transacciones));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/tipo - Filtrar por tipo
     */
    @GetMapping("/cuenta/{cuentaId}/tipo")
    public ResponseEntity<ApiResponse<List<TransaccionResponse>>> filtrarPorTipo(
            @PathVariable Long cuentaId,
            @RequestParam TransactionType tipo) {
        List<TransaccionResponse> transacciones = transactionService.getTransaccionesByTipo(cuentaId, tipo);
        return ResponseEntity.ok(ApiResponse.success(transacciones));
    }

    /**
     * DELETE /api/dunab/transactions/{id}/anular - Anular transacción
     */
    @DeleteMapping("/{id}/anular")
    public ResponseEntity<ApiResponse<TransaccionResponse>> anularTransaccion(
            @PathVariable Long id,
            @RequestParam String justificacion,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        TransaccionResponse response = transactionService.anularTransaccion(id, justificacion, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Transacción anulada exitosamente"));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/total - Total por tipo
     */
    @GetMapping("/cuenta/{cuentaId}/total")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalPorTipo(
            @PathVariable Long cuentaId,
            @RequestParam TransactionType tipo) {
        BigDecimal total = transactionService.getTotalByTipo(cuentaId, tipo);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    /**
     * GET /api/dunab/transactions/cuenta/{cuentaId}/count - Contar transacciones completadas
     */
    @GetMapping("/cuenta/{cuentaId}/count")
    public ResponseEntity<ApiResponse<Long>> contarTransacciones(@PathVariable Long cuentaId) {
        Long count = transactionService.contarTransaccionesCompletadas(cuentaId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }

    /**
     * GET /api/dunab/transactions/stack/stats - Estadísticas del Stack
     */
    @GetMapping("/stack/stats")
    public ResponseEntity<ApiResponse<String>> getEstadisticasStack() {
        String stats = transactionService.getEstadisticasStack();
        return ResponseEntity.ok(ApiResponse.success(stats, "Estadísticas del Stack de transacciones"));
    }

    /**
     * GET /api/dunab/transactions/user/{userId} - Obtener transacciones por usuario
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TransaccionResponse>>> getTransaccionesByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<TransaccionResponse> transacciones = transactionService.getTransaccionesByUserId(userId, page, size);
        return ResponseEntity.ok(ApiResponse.success(transacciones));
    }
}
