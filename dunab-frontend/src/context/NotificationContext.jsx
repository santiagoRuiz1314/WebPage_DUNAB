import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';
import { MAX_NOTIFICATIONS } from '../utils/constants';

const NotificationContext = createContext(null);

/**
 * NotificationProvider
 * Implementa Queue (FIFO - First In First Out) para las notificaciones
 * Las notificaciones se procesan en el orden en que llegan
 */
export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]); // Queue de notificaciones
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  /**
   * Calcular notificaciones no leídas
   */
  const calculateUnreadCount = useCallback((notifs) => {
    return notifs.filter((n) => !n.read).length;
  }, []);

  /**
   * Obtener notificaciones del servidor (Queue - FIFO)
   * Las notificaciones más antiguas se procesan primero
   */
  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await notificationService.getNotifications();

      // Asegurarse de que siempre sea un array
      const notifs = Array.isArray(response) ? response :
                     Array.isArray(response?.data) ? response.data :
                     Array.isArray(response?.content) ? response.content : [];

      // Implementar Queue: Ordenar por fecha (las más antiguas primero - FIFO)
      const sortedNotifs = notifs.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      setNotifications(sortedNotifs);
      setUnreadCount(calculateUnreadCount(sortedNotifs));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  /**
   * Marcar notificación como leída
   */
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter((n) => !n.read);

      await Promise.all(
        unreadNotifs.map((notif) => notificationService.markAsRead(notif.id))
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  /**
   * Eliminar notificación
   */
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);

      // Actualizar estado local
      setNotifications((prev) => {
        const filtered = prev.filter((notif) => notif.id !== notificationId);
        setUnreadCount(calculateUnreadCount(filtered));
        return filtered;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  /**
   * Limpiar todas las notificaciones leídas
   */
  const clearReadNotifications = async () => {
    try {
      const readNotifs = notifications.filter((n) => n.read);

      await Promise.all(
        readNotifs.map((notif) => notificationService.deleteNotification(notif.id))
      );

      setNotifications((prev) => prev.filter((notif) => !notif.read));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      throw error;
    }
  };

  /**
   * Agregar notificación local (enqueue - FIFO)
   * Se agrega al final de la queue
   */
  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now(), // ID temporal
      message: notification.message,
      type: notification.type || 'SYSTEM',
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };

    setNotifications((prev) => {
      // Agregar al final de la queue (FIFO)
      const updated = [...prev, newNotif];

      // Limitar el tamaño de la queue
      if (updated.length > MAX_NOTIFICATIONS) {
        // Dequeue: Remover la más antigua (primera en la queue)
        updated.shift();
      }

      return updated;
    });

    setUnreadCount((prev) => prev + 1);
  };

  /**
   * Dequeue: Obtener y eliminar la notificación más antigua (FIFO)
   */
  const dequeueNotification = () => {
    if (notifications.length === 0) return null;

    const [oldest, ...rest] = notifications;
    setNotifications(rest);

    if (!oldest.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    return oldest;
  };

  /**
   * Peek: Ver la notificación más antigua sin eliminarla
   */
  const peekNotification = () => {
    return notifications.length > 0 ? notifications[0] : null;
  };

  /**
   * Verificar si la queue está vacía
   */
  const isEmpty = () => {
    return notifications.length === 0;
  };

  /**
   * Obtener el tamaño de la queue
   */
  const getSize = () => {
    return notifications.length;
  };

  // Cargar notificaciones cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
    }
  }, [isAuthenticated, user?.id]);

  // Polling: Actualizar notificaciones cada 30 segundos (opcional)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.id]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    addNotification,
    dequeueNotification,
    peekNotification,
    isEmpty,
    getSize,
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
