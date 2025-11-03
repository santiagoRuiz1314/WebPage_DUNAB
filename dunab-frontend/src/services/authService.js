/**
 * Servicio de Autenticación
 * Maneja login, registro, logout y gestión de tokens
 */

import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';
import {
  setAuthToken,
  setRefreshToken,
  setUser,
  clearSession,
} from '../utils/storage';

const authService = {
  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<object>} Datos del usuario y tokens
   */
  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

      // Guardar tokens y datos del usuario en localStorage
      if (response.token) {
        setAuthToken(response.token);
      }
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      if (response.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  /**
   * Registrar nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise<object>} Datos del usuario registrado
   */
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);

      // Opcionalmente, auto-login después del registro
      if (response.token) {
        setAuthToken(response.token);
      }
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      if (response.user) {
        setUser(response.user);
      }

      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar localStorage independientemente del resultado
      clearSession();
    }
  },

  /**
   * Refrescar token de acceso
   * @returns {Promise<string>} Nuevo token de acceso
   */
  refreshToken: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH);

      if (response.token) {
        setAuthToken(response.token);
      }

      return response.token;
    } catch (error) {
      console.error('Error refrescando token:', error);
      // Si falla el refresh, limpiar sesión
      clearSession();
      throw error;
    }
  },

  /**
   * Verificar si el token actual es válido
   * @returns {Promise<object>} Datos del usuario si el token es válido
   */
  verifyToken: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VERIFY);
      return response;
    } catch (error) {
      console.error('Error verificando token:', error);
      throw error;
    }
  },

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise<object>} Datos del perfil
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.VERIFY);
      if (response.user) {
        setUser(response.user);
      }
      return response.user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      throw error;
    }
  },

  /**
   * Verificar si hay una sesión activa
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('dunab_token');
    const user = localStorage.getItem('dunab_user');
    return !!(token && user);
  },
};

export default authService;
