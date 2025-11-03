import React from 'react';

const NotificationItem = ({ notification }) => {
  // TODO: Implementar item individual de notificación

  return (
    <li className="notification-item">
      <p>{notification?.message || 'Notificación'}</p>
      {/* TODO: Botones de marcar como leída y eliminar */}
    </li>
  );
};

export default NotificationItem;
