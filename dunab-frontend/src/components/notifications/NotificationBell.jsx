import React from 'react';

const NotificationBell = () => {
  // TODO: Implementar campana de notificaciones con badge

  return (
    <div className="notification-bell">
      <button>
        🔔
        <span className="badge">0</span>
      </button>
    </div>
  );
};

export default NotificationBell;
