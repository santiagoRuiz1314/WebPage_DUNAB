import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EventsCatalog from '../components/events/EventsCatalog';
import EventDetail from '../components/events/EventDetail';
import { MdCelebration } from 'react-icons/md';
import './Events.css';

/**
 * Página principal de eventos
 * Muestra el catálogo y permite ver detalles de eventos
 */
const Events = () => {
  const { t } = useTranslation();
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
        <h1 className="events-page__title"><MdCelebration size={32} style={{ verticalAlign: 'middle', marginRight: '8px' }} />{t('events.institutionalEvents')}</h1>
        <p className="events-page__subtitle">
          {t('events.participateAndEarn')}
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
