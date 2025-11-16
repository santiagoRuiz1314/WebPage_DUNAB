import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCenter from './NotificationCenter';
import { IoNotifications } from 'react-icons/io5';

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="notification-bell">
      <button
        className="notification-btn"
        onClick={toggleNotifications}
        aria-label="Notifications"
      >
        <span className="bell-icon">
          <IoNotifications size={22} />
        </span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <>
          <div className="notification-overlay" onClick={() => setShowNotifications(false)} />
          <NotificationCenter onClose={() => setShowNotifications(false)} />
        </>
      )}
    </div>
  );
};

export default NotificationBell;
