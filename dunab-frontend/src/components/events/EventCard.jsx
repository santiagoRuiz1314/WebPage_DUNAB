import React from 'react';

const EventCard = ({ event }) => {
  // TODO: Implementar tarjeta de evento

  return (
    <div className="event-card">
      <h3>{event?.name || 'Evento'}</h3>
      {/* TODO: Mostrar información resumida del evento */}
    </div>
  );
};

export default EventCard;
