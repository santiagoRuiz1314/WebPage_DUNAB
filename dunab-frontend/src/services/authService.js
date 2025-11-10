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
      console.log('🔑 Intentando login con:', email);
      const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });

      console.log('📦 Response completo:', response);

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      console.log('✅ authData extraído:', authData);
      console.log('🔐 Token encontrado:', authData.token ? 'SÍ' : 'NO');

      // Guardar tokens y datos del usuario en localStorage
      if (authData.token) {
        setAuthToken(authData.token);
        console.log('💾 Token guardado en localStorage');
      }
      if (authData.refreshToken) {
        setRefreshToken(authData.refreshToken);
        console.log('💾 Refresh token guardado en localStorage');
      }

      // Construir objeto user a partir de authData
      const user = {
        id: authData.id,
        email: authData.email,
        nombre: authData.nombre,
        apellido: authData.apellido,
        rol: authData.rol,
      };
      setUser(user);
      console.log('👤 Usuario guardado:', user);

      return authData;
    } catch (error) {
      console.error('❌ Error en login:', error);
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

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      // Auto-login después del registro
      if (authData.token) {
        setAuthToken(authData.token);
      }
      if (authData.refreshToken) {
        setRefreshToken(authData.refreshToken);
      }

      // Construir objeto user a partir de authData
      const user = {
        id: authData.id,
        email: authData.email,
        nombre: authData.nombre,
        apellido: authData.apellido,
        rol: authData.rol,
      };
      setUser(user);

      return authData;
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
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<string>} Nuevo token de acceso
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post(`${API_ENDPOINTS.REFRESH}?refreshToken=${refreshToken}`);

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      if (authData.token) {
        setAuthToken(authData.token);
      }

      return authData.token;
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

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      // Construir objeto user a partir de authData
      const user = {
        id: authData.id,
        email: authData.email,
        nombre: authData.nombre,
        apellido: authData.apellido,
        rol: authData.rol,
      };

      return authData;
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

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      // Construir objeto user a partir de authData
      const user = {
        id: authData.id,
        email: authData.email,
        nombre: authData.nombre,
        apellido: authData.apellido,
        rol: authData.rol,
      };
      setUser(user);

      return user;
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

  /**
   * Cambiar contraseña del usuario autenticado
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Confirmación del cambio
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },
};

export default authService;
