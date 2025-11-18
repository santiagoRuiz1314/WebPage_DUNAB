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
        firstName: authData.nombre,
        lastName: authData.apellido,
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
      console.log('📝 Intentando registro con:', userData);

      // Mapear campos del formulario al formato esperado por el backend
      const registerData = {
        email: userData.email,
        password: userData.password,
        nombre: userData.firstName,
        apellido: userData.lastName,
        codigoEstudiante: userData.studentCode,
      };

      console.log('📤 Datos enviados al backend:', registerData);
      const response = await api.post(API_ENDPOINTS.REGISTER, registerData);

      console.log('📦 Response completo:', response);

      // El interceptor ya retorna response.data (ApiResponse)
      // Necesitamos extraer la propiedad 'data' de ApiResponse
      const authData = response.data || response;

      console.log('✅ authData extraído:', authData);

      // Don't auto-login after registration
      // User should manually login with their credentials
      console.log('✅ Registro exitoso - usuario debe iniciar sesión manualmente');

      return authData;
    } catch (error) {
      console.error('❌ Error en registro:', error);
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
        firstName: authData.nombre,
        lastName: authData.apellido,
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
        firstName: authData.nombre,
        lastName: authData.apellido,
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
      console.log('🔐 Cambiando contraseña...');
      const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      console.log('✅ Contraseña cambiada exitosamente');
      return response.data || response;
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      throw error;
    }
  },

  /**
   * Actualizar perfil del usuario
   * @param {number} userId - ID del usuario
   * @param {object} profileData - Datos del perfil a actualizar
   * @returns {Promise<object>} Usuario actualizado
   */
  updateUserProfile: async (userId, profileData) => {
    try {
      console.log('🔄 Actualizando perfil del usuario:', userId, profileData);

      // Mapear campos del formulario al formato esperado por el backend
      const updateData = {
        nombre: profileData.firstName,
        apellido: profileData.lastName,
        email: profileData.email,
        telefono: profileData.phone,
        programa: profileData.program,
        semestre: profileData.semester,
      };

      console.log('📤 Datos enviados al backend:', updateData);
      const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE(userId), updateData);

      console.log('📦 Response completo:', response);

      // El interceptor ya retorna response.data (ApiResponse)
      const userData = response.data || response;

      console.log('✅ Perfil actualizado exitosamente:', userData);

      return userData;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  },
};

export default authService;
