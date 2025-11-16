import React from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import { MdCheckCircle, MdInfo, MdWarning, MdError, MdAttachMoney, MdCheck, MdClose } from 'react-icons/md';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const { id, type, message, timestamp, read } = notification;

  const typeIcons = {
    success: MdCheckCircle,
    info: MdInfo,
    warning: MdWarning,
    error: MdError,
    dunab: MdAttachMoney,
  };

  const IconComponent = typeIcons[type] || MdInfo;

  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <div className="notification-icon">
        <IconComponent size={24} />
      </div>
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
            <MdCheck size={18} />
          </button>
        )}
        <button
          className="notification-action-btn delete"
          onClick={() => onDelete(id)}
          title="Eliminar"
        >
          <MdClose size={18} />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
