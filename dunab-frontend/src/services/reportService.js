/**
 * Servicio para generación de reportes del sistema DUNAB
 */

import { get, post } from './api';

/**
 * Generar reporte de transacciones
 * @param {Object} filters - Filtros para el reporte
 * @param {string} filters.startDate - Fecha inicial
 * @param {string} filters.endDate - Fecha final
 * @param {string} filters.type - Tipo de transacción (INCOME/EXPENSE)
 * @param {number} filters.categoryId - ID de categoría
 * @returns {Promise<Object>} Reporte de transacciones
 */
export const generateTransactionReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await get(`/dunab/reports/transactions?${params}`);
    return response;
  } catch (error) {
    console.error('Error generating transaction report:', error);
    throw error;
  }
};

/**
 * Generar reporte de estudiantes
 * @param {Object} filters - Filtros para el reporte
 * @returns {Promise<Object>} Reporte de estudiantes
 */
export const generateStudentReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await get(`/dunab/reports/students?${params}`);
    return response;
  } catch (error) {
    console.error('Error generating student report:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas generales del sistema
 * @returns {Promise<Object>} Estadísticas del sistema
 */
export const getSystemStatistics = async () => {
  try {
    const response = await get('/dunab/statistics');
    return response;
  } catch (error) {
    console.error('Error fetching system statistics:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas por estudiante
 * @param {number} studentId - ID del estudiante
 * @returns {Promise<Object>} Estadísticas del estudiante
 */
export const getStudentStatistics = async (studentId) => {
  try {
    const response = await get(`/dunab/statistics/${studentId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching student statistics for ${studentId}:`, error);
    throw error;
  }
};

/**
 * Obtener ranking de estudiantes por saldo DUNAB
 * @param {number} limit - Número de estudiantes a obtener
 * @returns {Promise<Array>} Ranking de estudiantes
 */
export const getStudentRanking = async (limit = 10) => {
  try {
    const response = await get(`/dunab/ranking?limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Error fetching student ranking:', error);
    throw error;
  }
};

/**
 * Exportar reporte a CSV
 * @param {Object} reportData - Datos del reporte
 * @param {string} reportType - Tipo de reporte
 * @returns {Promise<Blob>} Archivo CSV
 */
export const exportReportToCSV = async (reportData, reportType) => {
  try {
    const response = await post('/dunab/reports/export/csv', {
      data: reportData,
      type: reportType,
    }, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error exporting report to CSV:', error);
    throw error;
  }
};

/**
 * Exportar reporte a PDF
 * @param {Object} reportData - Datos del reporte
 * @param {string} reportType - Tipo de reporte
 * @returns {Promise<Blob>} Archivo PDF
 */
export const exportReportToPDF = async (reportData, reportType) => {
  try {
    const response = await post('/dunab/reports/export/pdf', {
      data: reportData,
      type: reportType,
    }, {
      responseType: 'blob',
    });
    return response;
  } catch (error) {
    console.error('Error exporting report to PDF:', error);
    throw error;
  }
};

/**
 * Obtener balance general del sistema DUNAB
 * @returns {Promise<Object>} Balance general
 */
export const getSystemBalance = async () => {
  try {
    const response = await get('/dunab/reports/balance');
    return response;
  } catch (error) {
    console.error('Error fetching system balance:', error);
    throw error;
  }
};

/**
 * Generar reporte de eventos
 * @param {Object} filters - Filtros para el reporte
 * @returns {Promise<Object>} Reporte de eventos
 */
export const generateEventReport = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await get(`/dunab/reports/events?${params}`);
    return response;
  } catch (error) {
    console.error('Error generating event report:', error);
    throw error;
  }
};

export default {
  generateTransactionReport,
  generateStudentReport,
  getSystemStatistics,
  getStudentStatistics,
  getStudentRanking,
  exportReportToCSV,
  exportReportToPDF,
  getSystemBalance,
  generateEventReport,
};
