import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { MdInbox } from 'react-icons/md';

const NotificationCenter = ({ onClose }) => {
  const { t } = useTranslation();
  const { notifications, markAsRead, deleteNotification, clearAll } = useNotifications();

  return (
    <div className="notification-center">
      <div className="notification-header">
        <h3>{t('notifications.title')}</h3>
        {notifications.length > 0 && (
          <button className="clear-all-btn" onClick={clearAll}>
            {t('notifications.clearAll')}
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p><MdInbox size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />{t('notifications.noNotifications')}</p>
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
