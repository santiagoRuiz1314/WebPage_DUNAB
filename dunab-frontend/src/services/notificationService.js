/**
 * Servicio de Notificaciones
 * Maneja operaciones CRUD de notificaciones (implementa Queue - FIFO)
 */

import api from './api';
import { API_ENDPOINTS } from '../config/apiConfig';

const notificationService = {
  /**
   * Obtener todas las notificaciones del usuario actual
   * @returns {Promise<array>} Lista de notificaciones (Queue - FIFO)
   */
  getNotifications: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.NOTIFICATIONS);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Obtener una notificación específica por ID
   * @param {number|string} notificationId - ID de la notificación
   * @returns {Promise<object>} Datos de la notificación
   */
  getNotification: async (notificationId) => {
    try {
      const response = await api.get(API_ENDPOINTS.NOTIFICATION(notificationId));
      return response;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  /**
   * Marcar notificación como leída
   * @param {number|string} notificationId - ID de la notificación
   * @returns {Promise<object>} Notificación actualizada
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(API_ENDPOINTS.NOTIFICATION_READ(notificationId));
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Eliminar notificación
   * @param {number|string} notificationId - ID de la notificación
   * @returns {Promise<void>}
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.NOTIFICATION(notificationId));
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva notificación (Admin/Sistema)
   * @param {object} notificationData - Datos de la notificación
   * @returns {Promise<object>} Notificación creada
   */
  createNotification: async (notificationData) => {
    try {
      const response = await api.post(API_ENDPOINTS.NOTIFICATIONS, notificationData);
      return response;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Marcar todas las notificaciones como leídas
   * @returns {Promise<void>}
   */
  markAllAsRead: async () => {
    try {
      const response = await api.put(`${API_ENDPOINTS.NOTIFICATIONS}/read-all`);
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Eliminar todas las notificaciones leídas
   * @returns {Promise<void>}
   */
  deleteAllRead: async () => {
    try {
      const response = await api.delete(`${API_ENDPOINTS.NOTIFICATIONS}/read`);
      return response;
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      throw error;
    }
  },

  /**
   * Obtener contador de notificaciones no leídas
   * @returns {Promise<number>} Número de notificaciones no leídas
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`);
      return response.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },
};

export default notificationService;
