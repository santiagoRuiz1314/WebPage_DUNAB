/**
 * Servicio DUNAB - Core del Sistema
 * Maneja todas las operaciones CRUD de cuentas, transacciones, estadísticas y categorías
 */

import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const dunabService = {
  // ============================================
  // CUENTAS DUNAB
  // ============================================

  /**
   * Crear cuenta DUNAB para un estudiante
   * @param {object} accountData - Datos de la cuenta
   * @returns {Promise<object>} Cuenta creada
   */
  createAccount: async (accountData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DUNAB_ACCOUNTS, accountData);
      return response;
    } catch (error) {
      console.error('Error creando cuenta DUNAB:', error);
      throw error;
    }
  },

  /**
   * Obtener cuenta DUNAB por ID
   * @param {number|string} accountId - ID de la cuenta
   * @returns {Promise<object>} Datos de la cuenta
   */
  getAccount: async (accountId) => {
    try {
      const response = await api.get(`${API_ENDPOINTS.DUNAB_ACCOUNTS}/${accountId}`);
      return response;
    } catch (error) {
      console.error('Error obteniendo cuenta DUNAB:', error);
      throw error;
    }
  },

  /**
   * Obtener saldo de una cuenta DUNAB
   * @param {number|string} accountId - ID de la cuenta
   * @returns {Promise<number>} Saldo actual
   */
  getBalance: async (accountId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_BALANCE(accountId));
      return response;
    } catch (error) {
      console.error('Error obteniendo saldo:', error);
      throw error;
    }
  },

  /**
   * Actualizar cuenta DUNAB
   * @param {number|string} accountId - ID de la cuenta
   * @param {object} accountData - Datos a actualizar
   * @returns {Promise<object>} Cuenta actualizada
   */
  updateAccount: async (accountId, accountData) => {
    try {
      const response = await api.put(`${API_ENDPOINTS.DUNAB_ACCOUNTS}/${accountId}`, accountData);
      return response;
    } catch (error) {
      console.error('Error actualizando cuenta DUNAB:', error);
      throw error;
    }
  },

  /**
   * Eliminar cuenta DUNAB (soft delete)
   * @param {number|string} accountId - ID de la cuenta
   * @returns {Promise<void>}
   */
  deleteAccount: async (accountId) => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.DUNAB_ACCOUNTS}/${accountId}`);
      return response;
    } catch (error) {
      console.error('Error eliminando cuenta DUNAB:', error);
      throw error;
    }
  },

  // ============================================
  // TRANSACCIONES
  // ============================================

  /**
   * Crear una nueva transacción DUNAB
   * @param {object} transactionData - Datos de la transacción
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
   * Listar todas las transacciones (con paginación)
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @returns {Promise<object>} Lista de transacciones paginada
   */
  getAllTransactions: async (page = 0, size = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTIONS, {
        params: { page, size },
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      throw error;
    }
  },

  /**
   * Obtener una transacción específica por ID
   * @param {number|string} transactionId - ID de la transacción
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
   * Obtener historial de transacciones de un usuario
   * @param {number|string} userId - ID del usuario
   * @param {number} page - Número de página
   * @param {number} size - Tamaño de página
   * @returns {Promise<object>} Lista de transacciones del usuario
   */
  getUserTransactions: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_USER_TRANSACTIONS(userId), {
        params: { page, size },
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo transacciones del usuario:', error);
      throw error;
    }
  },

  /**
   * Filtrar transacciones por diversos criterios
   * @param {object} filters - Filtros (fecha, tipo, categoría, etc.)
   * @returns {Promise<array>} Lista de transacciones filtradas
   */
  filterTransactions: async (filters) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_TRANSACTIONS_FILTER, {
        params: filters,
      });
      return response;
    } catch (error) {
      console.error('Error filtrando transacciones:', error);
      throw error;
    }
  },

  /**
   * Actualizar una transacción
   * @param {number|string} transactionId - ID de la transacción
   * @param {object} transactionData - Datos a actualizar
   * @returns {Promise<object>} Transacción actualizada
   */
  updateTransaction: async (transactionId, transactionData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.DUNAB_TRANSACTION(transactionId),
        transactionData
      );
      return response;
    } catch (error) {
      console.error('Error actualizando transacción:', error);
      throw error;
    }
  },

  /**
   * Anular una transacción
   * @param {number|string} transactionId - ID de la transacción
   * @param {string} reason - Motivo de anulación
   * @returns {Promise<void>}
   */
  deleteTransaction: async (transactionId, reason = '') => {
    try {
      const response = await api.delete(API_ENDPOINTS.DUNAB_TRANSACTION(transactionId), {
        data: { reason },
      });
      return response;
    } catch (error) {
      console.error('Error anulando transacción:', error);
      throw error;
    }
  },

  // ============================================
  // ESTADÍSTICAS Y REPORTES
  // ============================================

  /**
   * Obtener estadísticas generales del sistema DUNAB
   * @returns {Promise<object>} Estadísticas generales
   */
  getGeneralStatistics: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_STATISTICS);
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas generales:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de un estudiante específico
   * @param {number|string} studentId - ID del estudiante
   * @returns {Promise<object>} Estadísticas del estudiante
   */
  getStudentStatistics: async (studentId) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_STUDENT_STATISTICS(studentId));
      return response;
    } catch (error) {
      console.error('Error obteniendo estadísticas del estudiante:', error);
      throw error;
    }
  },

  /**
   * Generar reporte de transacciones
   * @param {object} reportParams - Parámetros del reporte (fechas, formato, etc.)
   * @returns {Promise<blob|object>} Reporte generado
   */
  generateReport: async (reportParams) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_REPORTS, {
        params: reportParams,
      });
      return response;
    } catch (error) {
      console.error('Error generando reporte:', error);
      throw error;
    }
  },

  /**
   * Obtener ranking de estudiantes por saldo DUNAB
   * @param {number} limit - Número de estudiantes a mostrar
   * @returns {Promise<array>} Lista ordenada de estudiantes
   */
  getRanking: async (limit = 10) => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_RANKING, {
        params: { limit },
      });
      return response;
    } catch (error) {
      console.error('Error obteniendo ranking:', error);
      throw error;
    }
  },

  // ============================================
  // CATEGORÍAS DE TRANSACCIONES
  // ============================================

  /**
   * Crear una nueva categoría de transacción
   * @param {object} categoryData - Datos de la categoría
   * @returns {Promise<object>} Categoría creada
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DUNAB_CATEGORIES, categoryData);
      return response;
    } catch (error) {
      console.error('Error creando categoría:', error);
      throw error;
    }
  },

  /**
   * Listar todas las categorías
   * @returns {Promise<array>} Lista de categorías
   */
  getCategories: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DUNAB_CATEGORIES);
      return response;
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  },

  /**
   * Actualizar una categoría
   * @param {number|string} categoryId - ID de la categoría
   * @param {object} categoryData - Datos a actualizar
   * @returns {Promise<object>} Categoría actualizada
   */
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.DUNAB_CATEGORY(categoryId),
        categoryData
      );
      return response;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      throw error;
    }
  },

  /**
   * Eliminar una categoría
   * @param {number|string} categoryId - ID de la categoría
   * @returns {Promise<void>}
   */
  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.DUNAB_CATEGORY(categoryId));
      return response;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      throw error;
    }
  },
};

export default dunabService;
