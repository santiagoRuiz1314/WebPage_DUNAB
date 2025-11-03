import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { id, type, message, timestamp, read } = notification;

  const typeIcons = {
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    dunab: '💰',
  };

  const icon = typeIcons[type] || 'ℹ️';

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <div className="notification-icon">{icon}</div>
      <div className="notification-content">
        <p className="notification-message">{message}</p>
        <span className="notification-time">{formatRelativeTime(timestamp)}</span>
      </div>
      <div className="notification-actions">
        {!read && (
          <button
            className="notification-action-btn"
            onClick={() => onMarkAsRead(id)}
            title="Marcar como leída"
          >
            ✓
          </button>
        )}
        <button
          className="notification-action-btn delete"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
