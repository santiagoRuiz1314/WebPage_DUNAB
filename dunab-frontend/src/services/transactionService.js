/**
 * Servicio de Transacciones DUNAB
 * Maneja todas las operaciones de transacciones del sistema
 */

import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const transactionService = {
  // ============================================
  // CREAR Y GESTIONAR TRANSACCIONES
  // ============================================

  /**
   * Crear una nueva transacción DUNAB
   * @param {object} transactionData - Datos de la transacción
   * @param {number} transactionData.cuentaId - ID de la cuenta
   * @param {string} transactionData.tipo - Tipo (CREDITO, DEBITO, INGRESO, EGRESO)
   * @param {number} transactionData.monto - Monto de la transacción
   * @param {number} transactionData.categoriaId - ID de la categoría
   * @param {string} transactionData.descripcion - Descripción
   * @param {string} transactionData.referencia - Referencia opcional
   * @returns {Promise<object>} Transacción creada
   */
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DUNAB_TRANSACTIONS, transactionData);
      return response;
    } catch (error) {
      console.error('Error creando transacción:', error);
      throw error;
    }
  },

  /**
   * Obtener una transacción específica por ID
   * @param {number} transactionId - ID de la transacción
   * @returns {Promise<object>} Datos de la transacción
   */
  getTransaction: async (transactionId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTION(transactionId));
      return response;
    } catch (error) {
      console.error('Error obteniendo transacción:', error);
      throw error;
    }
  },

  /**
   * Anular una transacción
   * @param {number} transactionId - ID de la transacción
   * @param {string} justificacion - Motivo de anulación
   * @returns {Promise<object>} Transacción anulada
   */
  cancelTransaction: async (transactionId, justificacion) => {
    try {
      const response = await api.delete(API_ENDPOINTS.DUNAB_TRANSACTION_CANCEL(transactionId), {
        params: { justificacion }
      });
      return response;
    } catch (error) {
      console.error('Error anulando transacción:', error);
      throw error;
    }
  },

  // ============================================
  // OBTENER TRANSACCIONES DEL USUARIO
  // ============================================

  /**
   * Obtener transacciones del usuario autenticado
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @returns {Promise<array>} Lista de transacciones
   */
  getMyTransactions: async (page = 0, size = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_MY_TRANSACTIONS, {
        params: { page, size }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo mis transacciones:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones del usuario autenticado con paginación
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @param {string} sort - Campo y dirección de ordenamiento (ej: "fechaCreacion,desc")
   * @returns {Promise<object>} Página de transacciones
   */
  getMyTransactionsPaginated: async (page = 0, size = 10, sort = 'fechaCreacion,desc') => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_MY_TRANSACTIONS_PAGINATED, {
        params: { page, size, sort }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones paginadas:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones de un usuario específico
   * @param {number} userId - ID del usuario
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @returns {Promise<array>} Lista de transacciones
   */
  getUserTransactions: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_USER_TRANSACTIONS(userId), {
        params: { page, size }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones del usuario:', error);
      throw error;
    }
  },

  // ============================================
  // TRANSACCIONES POR CUENTA
  // ============================================

  /**
   * Obtener transacciones de una cuenta
   * @param {number} cuentaId - ID de la cuenta
   * @returns {Promise<array>} Lista de transacciones
   */
  getAccountTransactions: async (cuentaId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_ACCOUNT_TRANSACTIONS(cuentaId));
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones de la cuenta:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones de una cuenta con paginación
   * @param {number} cuentaId - ID de la cuenta
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @param {string} sort - Campo y dirección de ordenamiento
   * @returns {Promise<object>} Página de transacciones
   */
  getAccountTransactionsPaginated: async (cuentaId, page = 0, size = 10, sort = 'fechaCreacion,desc') => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_ACCOUNT_TRANSACTIONS_PAGINATED(cuentaId), {
        params: { page, size, sort }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones paginadas de la cuenta:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones recientes de una cuenta (desde Stack)
   * @param {number} cuentaId - ID de la cuenta
   * @param {number} limit - Límite de transacciones
   * @returns {Promise<array>} Lista de transacciones recientes
   */
  getRecentTransactions: async (cuentaId, limit = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_ACCOUNT_TRANSACTIONS_RECENT(cuentaId), {
        params: { limit }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones recientes:', error);
      throw error;
    }
  },

  // ============================================
  // FILTROS Y BÚSQUEDAS
  // ============================================

  /**
   * Filtrar transacciones por fechas
   * @param {number} cuentaId - ID de la cuenta
   * @param {string} fechaInicio - Fecha de inicio (ISO 8601)
   * @param {string} fechaFin - Fecha fin (ISO 8601)
   * @returns {Promise<array>} Lista de transacciones filtradas
   */
  filterByDates: async (cuentaId, fechaInicio, fechaFin) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTIONS_FILTER(cuentaId), {
        params: { fechaInicio, fechaFin }
      });
      return response;
    } catch (error) {
      console.error('Error filtrando por fechas:', error);
      throw error;
    }
  },

  /**
   * Filtrar transacciones por tipo
   * @param {number} cuentaId - ID de la cuenta
   * @param {string} tipo - Tipo de transacción (CREDITO, DEBITO, INGRESO, EGRESO)
   * @returns {Promise<array>} Lista de transacciones filtradas
   */
  filterByType: async (cuentaId, tipo) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTIONS_BY_TYPE(cuentaId), {
        params: { tipo }
      });
      return response;
    } catch (error) {
      console.error('Error filtrando por tipo:', error);
      throw error;
    }
  },

  /**
   * Obtener transacciones por categoría
   * @param {number} categoriaId - ID de la categoría
   * @returns {Promise<array>} Lista de transacciones de la categoría
   */
  getByCategory: async (categoriaId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTIONS_BY_CATEGORY(categoriaId));
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones por categoría:', error);
      throw error;
    }
  },

  // ============================================
  // ESTADÍSTICAS Y RESÚMENES
  // ============================================

  /**
   * Obtener estadísticas de transacciones del usuario autenticado
   * @returns {Promise<object>} Estadísticas de transacciones
   */
  getStatistics: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_STATISTICS);
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  },

  /**
   * Obtener total por tipo de transacción
   * @param {number} cuentaId - ID de la cuenta
   * @param {string} tipo - Tipo de transacción
   * @returns {Promise<number>} Total del tipo
   */
  getTotalByType: async (cuentaId, tipo) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTION_TOTAL_BY_TYPE(cuentaId), {
        params: { tipo }
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo total por tipo:', error);
      throw error;
    }
  },

  /**
   * Contar transacciones completadas
   * @param {number} cuentaId - ID de la cuenta
   * @returns {Promise<number>} Cantidad de transacciones
   */
  countTransactions: async (cuentaId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTION_COUNT(cuentaId));
      return response;
    } catch (error) {
      console.error('Error contando transacciones:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen mensual de transacciones
   * @param {number} mes - Mes (opcional)
   * @param {number} anio - Año (opcional)
   * @returns {Promise<object>} Resumen mensual
   */
  getMonthlySummary: async (mes = null, anio = null) => {
    try {
      const params = {};
      if (mes !== null) params.mes = mes;
      if (anio !== null) params.anio = anio;

      const response = await api.get(API_ENDPOINTS.DUNAB_MONTHLY_SUMMARY, { params });
      return response;
    } catch (error) {
      console.error('Error obteniendo resumen mensual:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas del Stack de transacciones
   * @returns {Promise<string>} Estadísticas del Stack
   */
  getStackStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_STACK_STATS);
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas del Stack:', error);
      throw error;
    }
  },
};

export default transactionService;
