package com.unab.dunab.service;

import com.unab.dunab.dto.request.TransaccionRequest;
import com.unab.dunab.dto.response.EstadisticasTransaccionResponse;
import com.unab.dunab.dto.response.TransaccionResponse;
import com.unab.dunab.exception.InsufficientBalanceException;
import com.unab.dunab.exception.InvalidOperationException;
import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.*;
import com.unab.dunab.repository.CategoriaTransaccionRepository;
import com.unab.dunab.repository.CuentaDunabRepository;
import com.unab.dunab.repository.TransaccionRepository;
import com.unab.dunab.repository.UserRepository;
import com.unab.dunab.utils.TransactionHistoryStack;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de transacciones que utiliza una Pila (Stack) para gestionar
 * el historial reciente de transacciones en memoria.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransaccionRepository transaccionRepository;
    private final CuentaDunabRepository cuentaDunabRepository;
    private final CategoriaTransaccionRepository categoriaTransaccionRepository;
    private final UserRepository userRepository;
    private final TransactionHistoryStack transactionHistoryStack;
    private final NotificationService notificationService;

    /**
     * Crea una nueva transacción (crédito o débito)
     */
    @Transactional
    public TransaccionResponse crearTransaccion(TransaccionRequest request, Long userId) {
        // Validar cuenta
        CuentaDunab cuenta = cuentaDunabRepository.findById(request.getCuentaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", request.getCuentaId()));

        if (!cuenta.isActiva()) {
            throw new InvalidOperationException("La cuenta DUNAB no está activa");
        }

        // Validar categoría si se proporciona
        CategoriaTransaccion categoria = null;
        if (request.getCategoriaId() != null) {
            categoria = categoriaTransaccionRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría", "id", request.getCategoriaId()));
        }

        // Obtener usuario que crea la transacción
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

        // Validar saldo para débitos
        if (request.getTipo() == TransactionType.DEBITO) {
            if (!cuenta.tieneSaldoSuficiente(request.getMonto())) {
                throw new InsufficientBalanceException(
                        String.format("Saldo insuficiente. Saldo actual: %s, Monto requerido: %s",
                                cuenta.getSaldoActual(), request.getMonto()));
            }
        }

        // Guardar saldo anterior
        BigDecimal saldoAnterior = cuenta.getSaldoActual();

        // Aplicar transacción a la cuenta
        if (request.getTipo() == TransactionType.CREDITO) {
            cuenta.agregarDunab(request.getMonto());
        } else {
            cuenta.restarDunab(request.getMonto());
        }

        // Crear transacción
        Transaccion transaccion = Transaccion.builder()
                .cuenta(cuenta)
                .tipo(request.getTipo())
                .monto(request.getMonto())
                .categoria(categoria)
                .descripcion(request.getDescripcion())
                .referencia(request.getReferencia())
                .estado(TransactionStatus.COMPLETADA)
                .saldoAnterior(saldoAnterior)
                .saldoPosterior(cuenta.getSaldoActual())
                .creadoPor(usuario)
                .build();

        // Guardar transacción en base de datos
        transaccion = transaccionRepository.save(transaccion);

        // Actualizar cuenta
        cuentaDunabRepository.save(cuenta);

        // Agregar a la pila (Stack) para historial reciente
        transactionHistoryStack.push(transaccion);

        log.info("Transacción creada - ID: {}, Cuenta: {}, Tipo: {}, Monto: {}",
                transaccion.getId(), cuenta.getId(), transaccion.getTipo(), transaccion.getMonto());

        // Crear notificación
        if (request.getTipo() == TransactionType.CREDITO) {
            notificationService.notificarCredito(
                    cuenta.getEstudiante().getId(),
                    request.getMonto().toString(),
                    request.getDescripcion());
        } else {
            notificationService.notificarDebito(
                    cuenta.getEstudiante().getId(),
                    request.getMonto().toString(),
                    request.getDescripcion());
        }

        return mapToResponse(transaccion);
    }

    /**
     * Obtiene todas las transacciones de una cuenta
     */
    @Transactional(readOnly = true)
    public List<TransaccionResponse> getTransaccionesByCuenta(Long cuentaId, Long userId) {
        // Verificar que la cuenta pertenece al usuario
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        if (!cuenta.getEstudiante().getId().equals(userId)) {
            throw new InvalidOperationException("No tienes permiso para acceder a esta cuenta");
        }

        List<Transaccion> transacciones = transaccionRepository
                .findByCuentaIdOrderByFechaCreacionDesc(cuentaId);
        return transacciones.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene transacciones paginadas de una cuenta
     */
    @Transactional(readOnly = true)
    public Page<TransaccionResponse> getTransaccionesByCuentaPaginado(Long cuentaId, Pageable pageable, Long userId) {
        // Verificar que la cuenta pertenece al usuario
        CuentaDunab cuenta = cuentaDunabRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "id", cuentaId));

        if (!cuenta.getEstudiante().getId().equals(userId)) {
            throw new InvalidOperationException("No tienes permiso para acceder a esta cuenta");
        }

        Page<Transaccion> transacciones = transaccionRepository.findByCuentaId(cuentaId, pageable);
        return transacciones.map(this::mapToResponse);
    }

    /**
     * Obtiene las N transacciones más recientes de una cuenta desde el Stack
     */
    public List<TransaccionResponse> getTransaccionesRecientes(Long cuentaId, int limit) {
        List<Transaccion> transacciones = transactionHistoryStack.getRecentByCuenta(cuentaId, limit);
        return transacciones.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene transacciones por rango de fechas
     */
    @Transactional(readOnly = true)
    public List<TransaccionResponse> getTransaccionesByFechas(
            Long cuentaId, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<Transaccion> transacciones = transaccionRepository
                .findByCuentaIdAndFechaBetween(cuentaId, fechaInicio, fechaFin);
        return transacciones.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene transacciones por tipo
     */
    @Transactional(readOnly = true)
    public List<TransaccionResponse> getTransaccionesByTipo(Long cuentaId, TransactionType tipo) {
        List<Transaccion> transacciones = transaccionRepository
                .findByCuentaIdAndTipo(cuentaId, tipo);
        return transacciones.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una transacción por ID
     */
    @Transactional(readOnly = true)
    public TransaccionResponse getTransaccionById(Long id) {
        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", "id", id));
        return mapToResponse(transaccion);
    }

    /**
     * Anula una transacción (solo administradores)
     */
    @Transactional
    public TransaccionResponse anularTransaccion(Long transaccionId, String justificacion, Long userId) {
        Transaccion transaccion = transaccionRepository.findById(transaccionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", "id", transaccionId));

        if (transaccion.getEstado() == TransactionStatus.ANULADA) {
            throw new InvalidOperationException("La transacción ya está anulada");
        }

        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

        CuentaDunab cuenta = transaccion.getCuenta();

        // Revertir la transacción
        if (transaccion.getTipo() == TransactionType.CREDITO) {
            cuenta.restarDunab(transaccion.getMonto());
        } else {
            cuenta.agregarDunab(transaccion.getMonto());
        }

        // Anular transacción
        transaccion.anular(usuario, justificacion);

        transaccionRepository.save(transaccion);
        cuentaDunabRepository.save(cuenta);

        log.warn("Transacción anulada - ID: {}, Usuario: {}, Justificación: {}",
                transaccionId, userId, justificacion);

        return mapToResponse(transaccion);
    }

    /**
     * Obtiene el total de transacciones por tipo
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalByTipo(Long cuentaId, TransactionType tipo) {
        BigDecimal total = transaccionRepository.getTotalByTipo(cuentaId, tipo);
        return total != null ? total : BigDecimal.ZERO;
    }

    /**
     * Cuenta las transacciones completadas de una cuenta
     */
    @Transactional(readOnly = true)
    public Long contarTransaccionesCompletadas(Long cuentaId) {
        return transaccionRepository.countTransaccionesCompletadas(cuentaId);
    }

    /**
     * Obtiene estadísticas del Stack de transacciones
     */
    public String getEstadisticasStack() {
        return transactionHistoryStack.getEstadisticas();
    }

    /**
     * Obtiene transacciones por ID de usuario
     */
    @Transactional(readOnly = true)
    public List<TransaccionResponse> getTransaccionesByUserId(Long userId, int page, int size, Long currentUserId) {
        // Verificar que el usuario está consultando sus propias transacciones
        if (!userId.equals(currentUserId)) {
            throw new InvalidOperationException("No tienes permiso para acceder a las transacciones de otro usuario");
        }

        // Buscar la cuenta DUNAB del usuario
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "usuario_id", userId));

        // Obtener transacciones de la cuenta
        return getTransaccionesByCuenta(cuenta.getId(), currentUserId);
    }

    /**
     * Obtiene transacciones paginadas del usuario autenticado
     */
    @Transactional(readOnly = true)
    public Page<TransaccionResponse> getMisTransaccionesPaginadas(Long userId, Pageable pageable) {
        // Buscar la cuenta DUNAB del usuario
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "usuario_id", userId));

        // Obtener transacciones paginadas
        Page<Transaccion> transacciones = transaccionRepository.findByCuentaId(cuenta.getId(), pageable);
        return transacciones.map(this::mapToResponse);
    }

    /**
     * Obtiene estadísticas de transacciones del usuario
     */
    @Transactional(readOnly = true)
    public EstadisticasTransaccionResponse getEstadisticasUsuario(Long userId) {
        // Buscar la cuenta DUNAB del usuario
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "usuario_id", userId));

        // Calcular estadísticas
        BigDecimal totalCreditos = getTotalByTipo(cuenta.getId(), TransactionType.CREDITO);
        BigDecimal totalDebitos = getTotalByTipo(cuenta.getId(), TransactionType.DEBITO);
        Long totalTransacciones = contarTransaccionesCompletadas(cuenta.getId());

        return EstadisticasTransaccionResponse.builder()
                .cuentaId(cuenta.getId())
                .saldoActual(cuenta.getSaldoActual())
                .totalGanado(cuenta.getTotalGanado())
                .totalGastado(cuenta.getTotalGastado())
                .totalCreditos(totalCreditos)
                .totalDebitos(totalDebitos)
                .totalTransacciones(totalTransacciones)
                .build();
    }

    /**
     * Obtiene transacciones por categoría del usuario autenticado
     */
    @Transactional(readOnly = true)
    public List<TransaccionResponse> getTransaccionesByCategoria(Long userId, Long categoriaId) {
        // Buscar la cuenta DUNAB del usuario
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "usuario_id", userId));

        // Obtener transacciones por categoría
        List<Transaccion> transacciones = transaccionRepository.findByCuentaIdAndCategoriaId(cuenta.getId(), categoriaId);
        return transacciones.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene resumen mensual de transacciones
     */
    @Transactional(readOnly = true)
    public Object getResumenMensual(Long userId, Integer mes, Integer anio) {
        // Buscar la cuenta DUNAB del usuario
        CuentaDunab cuenta = cuentaDunabRepository.findByEstudianteId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta DUNAB", "usuario_id", userId));

        // Si no se proporciona mes y año, usar el mes actual
        LocalDateTime now = LocalDateTime.now();
        int mesActual = mes != null ? mes : now.getMonthValue();
        int anioActual = anio != null ? anio : now.getYear();

        // Calcular fechas de inicio y fin del mes
        LocalDateTime fechaInicio = LocalDateTime.of(anioActual, mesActual, 1, 0, 0, 0);
        LocalDateTime fechaFin = fechaInicio.plusMonths(1).minusSeconds(1);

        // Obtener transacciones del mes
        List<Transaccion> transacciones = transaccionRepository.findByCuentaIdAndFechaBetween(
                cuenta.getId(), fechaInicio, fechaFin);

        // Calcular estadísticas del mes
        BigDecimal totalCreditos = transacciones.stream()
                .filter(t -> t.getTipo() == TransactionType.CREDITO && t.getEstado() == TransactionStatus.COMPLETADA)
                .map(Transaccion::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDebitos = transacciones.stream()
                .filter(t -> t.getTipo() == TransactionType.DEBITO && t.getEstado() == TransactionStatus.COMPLETADA)
                .map(Transaccion::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long cantidadTransacciones = transacciones.stream()
                .filter(t -> t.getEstado() == TransactionStatus.COMPLETADA)
                .count();

        return new java.util.HashMap<String, Object>() {{
            put("mes", mesActual);
            put("anio", anioActual);
            put("totalCreditos", totalCreditos);
            put("totalDebitos", totalDebitos);
            put("diferencia", totalCreditos.subtract(totalDebitos));
            put("cantidadTransacciones", cantidadTransacciones);
            put("saldoActual", cuenta.getSaldoActual());
        }};
    }

    /**
     * Mapea Transaccion a TransaccionResponse
     */
    private TransaccionResponse mapToResponse(Transaccion transaccion) {
        return TransaccionResponse.builder()
                .id(transaccion.getId())
                .cuentaId(transaccion.getCuenta().getId())
                .estudianteNombre(transaccion.getCuenta().getEstudiante().getNombreCompleto())
                .tipo(transaccion.getTipo())
                .monto(transaccion.getMonto())
                .categoriaNombre(transaccion.getCategoria() != null ?
                        transaccion.getCategoria().getNombre() : null)
                .descripcion(transaccion.getDescripcion())
                .referencia(transaccion.getReferencia())
                .estado(transaccion.getEstado())
                .saldoAnterior(transaccion.getSaldoAnterior())
                .saldoPosterior(transaccion.getSaldoPosterior())
                .creadoPor(transaccion.getCreadoPor() != null ?
                        transaccion.getCreadoPor().getNombreCompleto() : null)
                .fechaCreacion(transaccion.getFechaCreacion())
                .fechaActualizacion(transaccion.getFechaActualizacion())
                .build();
    }
}
