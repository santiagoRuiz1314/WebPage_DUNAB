package com.unab.dunab.utils;

import com.unab.dunab.model.Transaccion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Stack;
import java.util.stream.Collectors;

/**
 * Pila (Stack) para gestión del historial reciente de transacciones DUNAB.
 * Implementa LIFO (Last In, First Out) - Las últimas transacciones en entrar son las primeras en salir.
 *
 * Caso de uso: Mostrar las últimas N transacciones realizadas, permitiendo acceso rápido
 *              a las transacciones más recientes.
 *
 * Operaciones principales:
 * - push: Agregar transacción a la pila
 * - pop: Obtener y remover la última transacción
 * - peek: Ver la última transacción sin removerla
 * - isEmpty: Verificar si la pila está vacía
 * - size: Obtener cantidad de transacciones en pila
 * - getRecent: Obtener las N transacciones más recientes
 */
@Slf4j
@Component
public class TransactionHistoryStack {

    private final Stack<Transaccion> stack;
    private static final int MAX_SIZE = 100; // Límite de transacciones en memoria

    public TransactionHistoryStack() {
        this.stack = new Stack<>();
        log.info("TransactionHistoryStack inicializada - Estructura: Stack (LIFO), Tamaño máximo: {}",
                MAX_SIZE);
    }

    /**
     * Agrega una transacción al tope de la pila (push)
     * Si la pila alcanza el tamaño máximo, remueve la más antigua
     * Complejidad temporal: O(1)
     *
     * @param transaccion Transacción a agregar
     */
    public void push(Transaccion transaccion) {
        if (transaccion == null) {
            log.warn("Intento de agregar transacción nula a la pila");
            return;
        }

        // Si alcanzamos el tamaño máximo, removemos la transacción más antigua (del fondo)
        if (stack.size() >= MAX_SIZE) {
            stack.remove(0);
            log.debug("Tamaño máximo alcanzado. Transacción más antigua removida.");
        }

        stack.push(transaccion);
        log.debug("Transacción agregada a la pila. ID: {}, Cuenta: {}, Monto: {}",
                 transaccion.getId(),
                 transaccion.getCuenta().getId(),
                 transaccion.getMonto());
    }

    /**
     * Obtiene y remueve la última transacción de la pila (pop)
     * Complejidad temporal: O(1)
     *
     * @return Optional con la transacción o empty si la pila está vacía
     */
    public Optional<Transaccion> pop() {
        if (stack.isEmpty()) {
            log.debug("Intento de pop en pila vacía");
            return Optional.empty();
        }

        Transaccion transaccion = stack.pop();
        log.debug("Transacción removida de la pila. ID: {}, Cuenta: {}",
                 transaccion.getId(),
                 transaccion.getCuenta().getId());
        return Optional.of(transaccion);
    }

    /**
     * Obtiene la última transacción sin removerla (peek)
     * Complejidad temporal: O(1)
     *
     * @return Optional con la transacción o empty si la pila está vacía
     */
    public Optional<Transaccion> peek() {
        if (stack.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(stack.peek());
    }

    /**
     * Verifica si la pila está vacía
     * Complejidad temporal: O(1)
     *
     * @return true si la pila no tiene elementos
     */
    public boolean isEmpty() {
        return stack.isEmpty();
    }

    /**
     * Obtiene el tamaño de la pila
     * Complejidad temporal: O(1)
     *
     * @return Cantidad de transacciones en la pila
     */
    public int size() {
        return stack.size();
    }

    /**
     * Limpia todas las transacciones de la pila
     * Complejidad temporal: O(1)
     */
    public void clear() {
        int size = stack.size();
        stack.clear();
        log.info("Pila de transacciones limpiada. Elementos removidos: {}", size);
    }

    /**
     * Obtiene las N transacciones más recientes sin removerlas
     * Este es el caso de uso principal de la pila
     * Complejidad temporal: O(n) donde n es el límite solicitado
     *
     * @param limit Cantidad de transacciones a obtener
     * @return Lista con las transacciones más recientes (ordenadas de más reciente a más antigua)
     */
    public List<Transaccion> getRecent(int limit) {
        if (limit <= 0) {
            log.warn("Límite inválido para getRecent: {}", limit);
            return new ArrayList<>();
        }

        int count = Math.min(limit, stack.size());
        List<Transaccion> recent = new ArrayList<>();

        // Obtenemos los últimos N elementos sin modificar la pila
        for (int i = stack.size() - 1; i >= stack.size() - count; i--) {
            recent.add(stack.get(i));
        }

        log.debug("Obtenidas {} transacciones recientes de la pila", recent.size());
        return recent;
    }

    /**
     * Obtiene todas las transacciones de la pila sin removerlas
     * Complejidad temporal: O(n)
     *
     * @return Lista con todas las transacciones (ordenadas de más reciente a más antigua)
     */
    public List<Transaccion> getAll() {
        List<Transaccion> all = new ArrayList<>(stack);
        // Revertir para que las más recientes estén primero
        java.util.Collections.reverse(all);
        return all;
    }

    /**
     * Obtiene transacciones de una cuenta específica
     * Complejidad temporal: O(n)
     *
     * @param cuentaId ID de la cuenta
     * @return Lista de transacciones de la cuenta
     */
    public List<Transaccion> getTransaccionesByCuenta(Long cuentaId) {
        return stack.stream()
                .filter(t -> t.getCuenta().getId().equals(cuentaId))
                .collect(Collectors.toList());
    }

    /**
     * Obtiene las N transacciones más recientes de una cuenta específica
     * Complejidad temporal: O(n)
     *
     * @param cuentaId ID de la cuenta
     * @param limit Cantidad de transacciones a obtener
     * @return Lista con las transacciones más recientes de la cuenta
     */
    public List<Transaccion> getRecentByCuenta(Long cuentaId, int limit) {
        return stack.stream()
                .filter(t -> t.getCuenta().getId().equals(cuentaId))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene estadísticas de la pila
     *
     * @return String con información de la pila
     */
    public String getEstadisticas() {
        return String.format("Pila de Historial de Transacciones - Tamaño: %d/%d, Vacía: %s",
                           size(), MAX_SIZE, isEmpty());
    }
}
