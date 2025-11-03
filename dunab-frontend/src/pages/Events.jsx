import React, { useState } from 'react';
import EventsCatalog from '../components/events/EventsCatalog';
import EventDetail from '../components/events/EventDetail';
import './Events.css';

/**
 * Página principal de eventos
 * Muestra el catálogo y permite ver detalles de eventos
 */
const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /**
   * Manejar click en un evento del catálogo
   */
  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  /**
   * Cerrar el detalle del evento
   */
  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="events-page">
      {/* Header de la página */}
      <div className="events-page__header">
        <h1 className="events-page__title">🎉 Eventos Institucionales</h1>
        <p className="events-page__subtitle">
          Participa en eventos y gana DUNAB por tu asistencia
        </p>
      </div>

      {/* Catálogo de eventos */}
      {!selectedEvent && (
        <EventsCatalog onEventClick={handleEventClick} />
      )}

      {/* Detalle del evento (Modal) */}
      {selectedEvent && (
        <div className="events-page__modal-overlay" onClick={handleCloseDetail}>
          <div
            className="events-page__modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <EventDetail
              eventId={selectedEvent.id}
              onClose={handleCloseDetail}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
