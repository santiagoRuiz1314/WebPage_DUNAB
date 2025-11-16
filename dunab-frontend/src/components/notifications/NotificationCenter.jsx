import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { MdInbox } from 'react-icons/md';

const NotificationCenter = ({ onClose }) => {
  const { notifications, markAsRead, deleteNotification, clearAll } = useNotifications();

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>Notificaciones</h3>
        {notifications.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll}>
            Limpiar todo
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p><MdInbox size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />No tienes notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
