import api from './api';

const notificationService = {
  // TODO: Obtener notificaciones (desde Cola)
  getNotifications: async () => {
    // const response = await api.get('/notifications');
    // return response.data;
  },

  // TODO: Marcar como leída
  markAsRead: async (notificationId) => {
    // const response = await api.put(`/notifications/${notificationId}/read`);
    // return response.data;
  },

  // TODO: Eliminar notificación
  deleteNotification: async (notificationId) => {
    // const response = await api.delete(`/notifications/${notificationId}`);
    // return response.data;
  },
};

export default notificationService;
