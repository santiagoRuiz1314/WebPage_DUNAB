import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // TODO: Implementar obtención de notificaciones (Queue)
  const fetchNotifications = async () => {
    // Implementación pendiente
  };

  // TODO: Implementar marcar como leída
  const markAsRead = async (notificationId) => {
    // Implementación pendiente
  };

  // TODO: Implementar eliminar notificación
  const deleteNotification = async (notificationId) => {
    // Implementación pendiente
  };

  // TODO: Implementar agregar notificación local
  const addNotification = (notification) => {
    // Implementación pendiente
  };

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    addNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
