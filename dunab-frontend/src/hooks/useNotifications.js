/**
 * Custom hook para gestión de notificaciones
 * Wrapper alrededor del NotificationContext
 */

import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }

  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = context;

  // Helper para añadir notificación de tipo específico
  const addSuccessNotification = (message) => {
    addNotification({
      type: 'success',
      message,
    });
  };

  const addErrorNotification = (message) => {
    addNotification({
      type: 'error',
      message,
    });
  };

  const addInfoNotification = (message) => {
    addNotification({
      type: 'info',
      message,
    });
  };

  const addWarningNotification = (message) => {
    addNotification({
      type: 'warning',
      message,
    });
  };

  // Notificación de DUNAB recibido
  const notifyDunabReceived = (amount, reason) => {
    addNotification({
      type: 'dunab_received',
      message: `Has recibido ${amount} DUNAB: ${reason}`,
      amount,
    });
  };

  // Notificación de DUNAB gastado
  const notifyDunabSpent = (amount, reason) => {
    addNotification({
      type: 'dunab_spent',
      message: `Se han debitado ${amount} DUNAB: ${reason}`,
      amount,
    });
  };

  // Notificación de evento
  const notifyEvent = (eventName, daysUntil) => {
    addNotification({
      type: 'event_reminder',
      message: `Evento próximo: ${eventName} - ${daysUntil} días`,
      eventName,
    });
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    // Helpers
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    addWarningNotification,
    notifyDunabReceived,
    notifyDunabSpent,
    notifyEvent,
  };
};

export default useNotifications;
