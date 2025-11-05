/**
 * Servicio para operaciones administrativas del sistema DUNAB
 */

import { get, post, put, del } from './api';

// ==================== GESTIÓN DE USUARIOS ====================

/**
 * Obtener todos los usuarios
 * @param {Object} params - Parámetros de paginación y filtrado
 * @returns {Promise<Object>} Lista paginada de usuarios
 */
export const getAllUsers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await get(`/students?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Crear nuevo usuario/estudiante
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
export const createUser = async (userData) => {
  try {
    const response = await post('/students', userData);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Actualizar usuario existente
 * @param {number} userId - ID del usuario
 * @param {Object} userData - Datos a actualizar
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await put(`/students/${userId}`, userData);
    return response;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

/**
 * Eliminar usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    const response = await del(`/students/${userId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

/**
 * Obtener progreso académico de un estudiante
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Object>} Progreso académico
 */
export const getStudentProgress = async (studentId) => {
  try {
    const response = await get(`/students/${studentId}/progress`);
    return response;
  } catch (error) {
    console.error(`Error fetching progress for student ${studentId}:`, error);
    throw error;
  }
};

// ==================== GESTIÓN DE TRANSACCIONES (ADMIN) ====================

/**
 * Crear transacción manualmente (solo admin)
 * @param {Object} transactionData - Datos de la transacción
 * @returns {Promise<Object>} Transacción creada
 */
export const createTransactionAdmin = async (transactionData) => {
  try {
    const response = await post('/dunab/transactions', transactionData);
    return response;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

/**
 * Actualizar transacción existente
 * @param {number} transactionId - ID de la transacción
 * @param {Object} transactionData - Datos a actualizar
 * @returns {Promise<Object>} Transacción actualizada
 */
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    const response = await put(`/dunab/transactions/${transactionId}`, transactionData);
    return response;
  } catch (error) {
    console.error(`Error updating transaction ${transactionId}:`, error);
    throw error;
  }
};

/**
 * Anular transacción
 * @param {number} transactionId - ID de la transacción
 * @param {string} reason - Razón de la anulación
 * @returns {Promise<void>}
 */
export const cancelTransaction = async (transactionId, reason) => {
  try {
    const response = await del(`/dunab/transactions/${transactionId}`, {
      data: { reason },
    });
    return response;
  } catch (error) {
    console.error(`Error cancelling transaction ${transactionId}:`, error);
    throw error;
  }
};

/**
 * Obtener todas las transacciones con filtros
 * @param {Object} filters - Filtros para búsqueda
 * @returns {Promise<Object>} Lista paginada de transacciones
 */
export const getAllTransactions = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await get(`/dunab/transactions?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// ==================== GESTIÓN DE CUENTAS DUNAB ====================

/**
 * Crear cuenta DUNAB para estudiante
 * @param {Object} accountData - Datos de la cuenta
 * @returns {Promise<Object>} Cuenta creada
 */
export const createDunabAccount = async (accountData) => {
  try {
    const response = await post('/dunab/accounts', accountData);
    return response;
  } catch (error) {
    console.error('Error creating DUNAB account:', error);
    throw error;
  }
};

/**
 * Actualizar cuenta DUNAB
 * @param {number} accountId - ID de la cuenta
 * @param {Object} accountData - Datos a actualizar
 * @returns {Promise<Object>} Cuenta actualizada
 */
export const updateDunabAccount = async (accountId, accountData) => {
  try {
    const response = await put(`/dunab/accounts/${accountId}`, accountData);
    return response;
  } catch (error) {
    console.error(`Error updating DUNAB account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Obtener todas las cuentas DUNAB
 * @param {Object} params - Parámetros de paginación
 * @returns {Promise<Object>} Lista de cuentas
 */
export const getAllDunabAccounts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await get(`/dunab/accounts?${queryParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching DUNAB accounts:', error);
    throw error;
  }
};

// ==================== GESTIÓN DE EVENTOS (ADMIN) ====================

/**
 * Crear nuevo evento
 * @param {Object} eventData - Datos del evento
 * @returns {Promise<Object>} Evento creado
 */
export const createEvent = async (eventData) => {
  try {
    const response = await post('/events', eventData);
    return response;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Actualizar evento existente
 * @param {number} eventId - ID del evento
 * @param {Object} eventData - Datos a actualizar
 * @returns {Promise<Object>} Evento actualizado
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await put(`/events/${eventId}`, eventData);
    return response;
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Eliminar evento
 * @param {number} eventId - ID del evento
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await del(`/events/${eventId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Confirmar asistencia a evento (otorga DUNAB)
 * @param {number} eventId - ID del evento
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Object>} Confirmación
 */
export const confirmEventAttendance = async (eventId, studentId) => {
  try {
    const response = await post(`/events/${eventId}/confirm`, { studentId });
    return response;
  } catch (error) {
    console.error(`Error confirming attendance for event ${eventId}:`, error);
    throw error;
  }
};

// ==================== CONFIGURACIÓN DEL SISTEMA ====================

/**
 * Obtener configuración del sistema
 * @returns {Promise<Object>} Configuración actual
 */
export const getSystemConfig = async () => {
  try {
    const response = await get('/admin/config');
    return response;
  } catch (error) {
    console.error('Error fetching system config:', error);
    throw error;
  }
};

/**
 * Actualizar configuración del sistema
 * @param {Object} configData - Nueva configuración
 * @returns {Promise<Object>} Configuración actualizada
 */
export const updateSystemConfig = async (configData) => {
  try {
    const response = await put('/admin/config', configData);
    return response;
  } catch (error) {
    console.error('Error updating system config:', error);
    throw error;
  }
};

/**
 * Obtener logs de auditoría
 * @param {Object} filters - Filtros para los logs
 * @returns {Promise<Array>} Logs de auditoría
 */
export const getAuditLogs = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await get(`/admin/audit-logs?${params}`);
    return response;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

export default {
  // Usuarios
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getStudentProgress,
  // Transacciones
  createTransactionAdmin,
  updateTransaction,
  cancelTransaction,
  getAllTransactions,
  // Cuentas DUNAB
  createDunabAccount,
  updateDunabAccount,
  getAllDunabAccounts,
  // Eventos
  createEvent,
  updateEvent,
  deleteEvent,
  confirmEventAttendance,
  // Sistema
  getSystemConfig,
  updateSystemConfig,
  getAuditLogs,
};
