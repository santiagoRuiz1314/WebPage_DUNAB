package com.unab.dunab.service;

import com.unab.dunab.dto.response.CuentaDunabResponse;
import com.unab.dunab.exception.DuplicateResourceException;
import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.AccountStatus;
import com.unab.dunab.model.CuentaDunab;
import com.unab.dunab.model.User;
import com.unab.dunab.repository.CuentaDunabRepository;
import com.unab.dunab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de cuentas DUNAB
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DunabService {

    private final CuentaDunabRepository cuentaDunabRepository;
    private final UserRepository userRepository;

    /**
     * Crea una cuenta DUNAB para un estudiante
     */
    @Transactional
    public CuentaDunabResponse crearCuenta(Long estudianteId) {
        User estudiante = userRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", estudianteId));

        // Verificar que no exista ya una cuenta
        if (cuentaDunabRepository.findByEstudianteId(estudianteId).isPresent()) {
            throw new DuplicateResourceException("Ya existe una cuenta DUNAB para este estudiante");
        }

        CuentaDunab cuenta = CuentaDunab.builder()
                .estudiante(estudiante)
                .saldoActual(new BigDecimal("500.00"))
                .totalGanado(new BigDecimal("500.00"))
                .totalGastado(BigDecimal.ZERO)
                .estado(AccountStatus.ACTIVA)
                .limiteTransaccion(new BigDecimal("10000.00"))
                .build();

        cuenta = cuentaDunabRepository.save(cuenta);

        log.info("Cuenta DUNAB creada - ID: {}, Estudiante: {}", cuenta.getId(), estudianteId);

        return mapToResponse(cuenta);
    }

    /**
     * Obtiene una cuenta DUNAB por ID
     */
    @Transactional(readOnly = true)
    public CuentaDunabResponse getCuentaById(Long cuentaId) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));
        return mapToResponse(cuenta);
    }

    /**
     * Obtiene una cuenta DUNAB por ID de estudiante
     */
    @Transactional(readOnly = true)
    public CuentaDunabResponse getCuentaByEstudianteId(Long estudianteId) {
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta DUNAB", "estudiante_id", estudianteId));
        return mapToResponse(cuenta);
    }

    /**
     * Obtiene el saldo de una cuenta
     */
    @Transactional(readOnly = true)
    public BigDecimal getSaldo(Long cuentaId) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));
        return cuenta.getSaldoActual();
    }

    /**
     * Obtiene todas las cuentas DUNAB
     */
    @Transactional(readOnly = true)
    public List<CuentaDunabResponse> getAllCuentas() {
        return cuentaDunabRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene cuentas por estado
     */
    @Transactional(readOnly = true)
    public List<CuentaDunabResponse> getCuentasByEstado(AccountStatus estado) {
        return cuentaDunabRepository.findByEstado(estado).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene ranking de cuentas por saldo
     */
    @Transactional(readOnly = true)
    public List<CuentaDunabResponse> getRanking() {
        return cuentaDunabRepository.findAllOrderBySaldoDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Actualiza el límite de transacción de una cuenta
     */
    @Transactional
    public CuentaDunabResponse actualizarLimite(Long cuentaId, BigDecimal nuevoLimite) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        cuenta.setLimiteTransaccion(nuevoLimite);
        cuenta = cuentaDunabRepository.save(cuenta);

        log.info("Límite actualizado - Cuenta: {}, Nuevo límite: {}", cuentaId, nuevoLimite);

        return mapToResponse(cuenta);
    }

    /**
     * Cambia el estado de una cuenta
     */
    @Transactional
    public CuentaDunabResponse cambiarEstado(Long cuentaId, AccountStatus nuevoEstado) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        cuenta.setEstado(nuevoEstado);
        cuenta = cuentaDunabRepository.save(cuenta);

        log.info("Estado de cuenta actualizado - Cuenta: {}, Nuevo estado: {}", cuentaId, nuevoEstado);

        return mapToResponse(cuenta);
    }

    /**
     * Suspende una cuenta DUNAB
     */
    @Transactional
    public CuentaDunabResponse suspenderCuenta(Long cuentaId) {
        return cambiarEstado(cuentaId, AccountStatus.SUSPENDIDA);
    }

    /**
     * Activa una cuenta DUNAB
     */
    @Transactional
    public CuentaDunabResponse activarCuenta(Long cuentaId) {
        return cambiarEstado(cuentaId, AccountStatus.ACTIVA);
    }

    /**
     * Obtiene estadísticas generales del sistema DUNAB
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getEstadisticasGenerales() {
        Map<String, Object> estadisticas = new HashMap<>();

        BigDecimal totalSaldo = cuentaDunabRepository.getTotalSaldoByEstado(AccountStatus.ACTIVA);
        BigDecimal totalGanado = cuentaDunabRepository.getTotalGanadoByEstado(AccountStatus.ACTIVA);
        BigDecimal totalGastado = cuentaDunabRepository.getTotalGastadoByEstado(AccountStatus.ACTIVA);

        estadisticas.put("totalSaldoSistema", totalSaldo != null ? totalSaldo : BigDecimal.ZERO);
        estadisticas.put("totalGanado", totalGanado != null ? totalGanado : BigDecimal.ZERO);
        estadisticas.put("totalGastado", totalGastado != null ? totalGastado : BigDecimal.ZERO);
        estadisticas.put("totalCuentasActivas", cuentaDunabRepository.findByEstado(AccountStatus.ACTIVA).size());
        estadisticas.put("totalCuentas", cuentaDunabRepository.count());

        return estadisticas;
    }

    /**
     * Obtiene estadísticas de una cuenta específica
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getEstadisticasCuenta(Long cuentaId) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("saldoActual", cuenta.getSaldoActual());
        estadisticas.put("totalGanado", cuenta.getTotalGanado());
        estadisticas.put("totalGastado", cuenta.getTotalGastado());
        estadisticas.put("estado", cuenta.getEstado());
        estadisticas.put("limiteTransaccion", cuenta.getLimiteTransaccion());
        estadisticas.put("fechaCreacion", cuenta.getFechaCreacion());

        return estadisticas;
    }

    /**
     * Elimina una cuenta DUNAB (soft delete)
     */
    @Transactional
    public void eliminarCuenta(Long cuentaId) {
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        cuenta.setEstado(AccountStatus.CERRADA);
        cuentaDunabRepository.save(cuenta);

        log.warn("Cuenta DUNAB cerrada - ID: {}", cuentaId);
    }

    /**
     * Mapea CuentaDunab a CuentaDunabResponse
     */
    private CuentaDunabResponse mapToResponse(CuentaDunab cuenta) {
        return CuentaDunabResponse.builder()
                .id(cuenta.getId())
                .estudianteId(cuenta.getEstudiante().getId())
                .estudianteNombre(cuenta.getEstudiante().getNombreCompleto())
                .saldoActual(cuenta.getSaldoActual())
                .totalGanado(cuenta.getTotalGanado())
                .totalGastado(cuenta.getTotalGastado())
                .estado(cuenta.getEstado())
                .limiteTransaccion(cuenta.getLimiteTransaccion())
                .fechaCreacion(cuenta.getFechaCreacion())
                .fechaActualizacion(cuenta.getFechaActualizacion())
                .build();
    }
}
