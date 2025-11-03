import api from './api';

const dunabService = {
  // ============ CUENTAS DUNAB ============

  // TODO: Crear cuenta DUNAB
  createAccount: async (accountData) => {
    // const response = await api.post('/dunab/accounts', accountData);
    // return response.data;
  },

  // TODO: Obtener cuenta por ID
  getAccount: async (accountId) => {
    // const response = await api.get(`/dunab/accounts/${accountId}`);
    // return response.data;
  },

  // TODO: Obtener saldo
  getBalance: async (accountId) => {
    // const response = await api.get(`/dunab/accounts/${accountId}/balance`);
    // return response.data;
  },

  // TODO: Actualizar cuenta
  updateAccount: async (accountId, accountData) => {
    // const response = await api.put(`/dunab/accounts/${accountId}`, accountData);
    // return response.data;
  },

  // TODO: Eliminar cuenta (soft delete)
  deleteAccount: async (accountId) => {
    // const response = await api.delete(`/dunab/accounts/${accountId}`);
    // return response.data;
  },

  // ============ TRANSACCIONES ============

  // TODO: Crear transacción
  createTransaction: async (transactionData) => {
    // const response = await api.post('/dunab/transactions', transactionData);
    // return response.data;
  },

  // TODO: Listar todas las transacciones (con paginación)
  getAllTransactions: async (page = 0, size = 10) => {
    // const response = await api.get('/dunab/transactions', { params: { page, size } });
    // return response.data;
  },

  // TODO: Obtener transacción por ID
  getTransaction: async (transactionId) => {
    // const response = await api.get(`/dunab/transactions/${transactionId}`);
    // return response.data;
  },

  // TODO: Obtener historial de estudiante
  getStudentTransactions: async (studentId, page = 0, size = 10) => {
    // const response = await api.get(`/dunab/transactions/student/${studentId}`, { params: { page, size } });
    // return response.data;
  },

  // TODO: Filtrar transacciones
  filterTransactions: async (filters) => {
    // const response = await api.get('/dunab/transactions/filter', { params: filters });
    // return response.data;
  },

  // TODO: Actualizar transacción
  updateTransaction: async (transactionId, transactionData) => {
    // const response = await api.put(`/dunab/transactions/${transactionId}`, transactionData);
    // return response.data;
  },

  // TODO: Anular transacción
  deleteTransaction: async (transactionId) => {
    // const response = await api.delete(`/dunab/transactions/${transactionId}`);
    // return response.data;
  },

  // ============ ESTADÍSTICAS ============

  // TODO: Obtener estadísticas generales
  getGeneralStatistics: async () => {
    // const response = await api.get('/dunab/statistics');
    // return response.data;
  },

  // TODO: Obtener estadísticas por estudiante
  getStudentStatistics: async (studentId) => {
    // const response = await api.get(`/dunab/statistics/${studentId}`);
    // return response.data;
  },

  // TODO: Generar reportes
  generateReport: async (reportParams) => {
    // const response = await api.get('/dunab/reports', { params: reportParams });
    // return response.data;
  },

  // TODO: Obtener ranking de estudiantes
  getRanking: async () => {
    // const response = await api.get('/dunab/ranking');
    // return response.data;
  },

  // ============ CATEGORÍAS ============

  // TODO: Crear categoría
  createCategory: async (categoryData) => {
    // const response = await api.post('/dunab/categories', categoryData);
    // return response.data;
  },

  // TODO: Listar categorías
  getCategories: async () => {
    // const response = await api.get('/dunab/categories');
    // return response.data;
  },

  // TODO: Actualizar categoría
  updateCategory: async (categoryId, categoryData) => {
    // const response = await api.put(`/dunab/categories/${categoryId}`, categoryData);
    // return response.data;
  },

  // TODO: Eliminar categoría
  deleteCategory: async (categoryId) => {
    // const response = await api.delete(`/dunab/categories/${categoryId}`);
    // return response.data;
  },
};

export default dunabService;
