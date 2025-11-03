/**
 * Configuración de Axios para la aplicación DUNAB
 * Incluye interceptores para manejo de tokens y errores
 */

import axios from 'axios';
import { getAuthToken, clearSession } from '../utils/storage';
import { ERROR_MESSAGES } from '../utils/constants';

// Configurar URL base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request
 * Agrega el token JWT a todas las peticiones
 */
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response
 * Maneja errores globales y tokens expirados
 */
api.interceptors.response.use(
  (response) => {
    // Retornar solo los datos de la respuesta
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Error de red
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        status: 0,
        error: error.message,
      });
    }

    const { status, data } = error.response;

    // Token expirado o no autorizado
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        // TODO: Implementar refresh token cuando el backend esté listo
        // const newToken = await refreshToken();
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // return api(originalRequest);

        // Por ahora, limpiar sesión y redirigir al login
        clearSession();
        window.location.href = '/login';
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
          data,
        });
      } catch (refreshError) {
        clearSession();
        window.location.href = '/login';
        return Promise.reject({
          message: ERROR_MESSAGES.UNAUTHORIZED,
          status,
          data,
        });
      }
    }

    // Permisos insuficientes
    if (status === 403) {
      return Promise.reject({
        message: ERROR_MESSAGES.FORBIDDEN,
        status,
        data,
      });
    }

    // Recurso no encontrado
    if (status === 404) {
      return Promise.reject({
        message: ERROR_MESSAGES.NOT_FOUND,
        status,
        data,
      });
    }

    // Error del servidor
    if (status >= 500) {
      return Promise.reject({
        message: ERROR_MESSAGES.SERVER_ERROR,
        status,
        data,
      });
    }

    // Otros errores (400, etc.)
    return Promise.reject({
      message: data?.message || 'Error en la petición',
      status,
      data,
    });
  }
);

/**
 * Helper para hacer peticiones GET
 * @param {string} url - URL del endpoint
 * @param {object} config - Configuración adicional
 * @returns {Promise} Respuesta de la API
 */
export const get = (url, config = {}) => api.get(url, config);

/**
 * Helper para hacer peticiones POST
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar
 * @param {object} config - Configuración adicional
 * @returns {Promise} Respuesta de la API
 */
export const post = (url, data, config = {}) => api.post(url, data, config);

/**
 * Helper para hacer peticiones PUT
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar
 * @param {object} config - Configuración adicional
 * @returns {Promise} Respuesta de la API
 */
export const put = (url, data, config = {}) => api.put(url, data, config);

/**
 * Helper para hacer peticiones DELETE
 * @param {string} url - URL del endpoint
 * @param {object} config - Configuración adicional
 * @returns {Promise} Respuesta de la API
 */
export const del = (url, config = {}) => api.delete(url, config);

/**
 * Helper para hacer peticiones PATCH
 * @param {string} url - URL del endpoint
 * @param {object} data - Datos a enviar
 * @param {object} config - Configuración adicional
 * @returns {Promise} Respuesta de la API
 */
export const patch = (url, data, config = {}) => api.patch(url, data, config);

export default api;
