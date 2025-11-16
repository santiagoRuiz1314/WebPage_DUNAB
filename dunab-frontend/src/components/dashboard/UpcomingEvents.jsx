import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import { formatDate, formatCurrency } from '../../utils/formatters';
import {
  MdEvent,
  MdMic,
  MdConstruction,
  MdSportsBasketball,
  MdTheaterComedy,
  MdSchool,
  MdCelebration,
  MdCalendarToday,
  MdAttachMoney,
  MdCardGiftcard,
  MdStars
} from 'react-icons/md';
import './UpcomingEvents.css';

/**
 * Componente que muestra los eventos próximos en el Dashboard
 * Permite inscripción rápida y visualización de eventos destacados
 */
const UpcomingEvents = ({ limit = 3 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Cargar eventos próximos - DELEGA AL BACKEND
   */
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // EL BACKEND debe tener un endpoint específico para eventos próximos
        // GET /api/events/upcoming?limit=3
        const response = await eventService.getUpcomingEvents(limit);

        // Asegurarse de que siempre sea un array
        const upcoming = Array.isArray(response) ? response :
                         Array.isArray(response?.data) ? response.data :
                         Array.isArray(response?.content) ? response.content : [];

        setEvents(upcoming);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError('No se pudieron cargar los eventos');
        setEvents([]); // Asegurar que events sea un array incluso en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [limit]);

  /**
   * Obtener icono del evento según su tipo o categoría
   */
  const getEventIcon = (event) => {
    const category = (event.categoria || event.category || '').toLowerCase();
    const icons = {
      'conferencia': MdMic,
      'taller': MdConstruction,
      'deportivo': MdSportsBasketball,
      'cultural': MdTheaterComedy,
      'académico': MdSchool,
      'social': MdCelebration,
      'default': MdEvent
    };
    return icons[category] || icons.default;
  };

  /**
   * Obtener color del badge según el costo
   */
  const getCostBadgeColor = (cost) => {
    if (!cost || cost === 0) return 'free';
    if (cost < 100) return 'low';
    if (cost < 200) return 'medium';
    return 'high';
  };

  if (loading) {
    return (
      <div className="upcoming-events">
        <div className="events-header">
          <h3><MdEvent size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Eventos Próximos</h3>
        </div>
        <div className="events-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="event-skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="upcoming-events">
        <div className="events-header">
          <h3><MdEvent size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Eventos Próximos</h3>
        </div>
        <div className="events-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="upcoming-events">
        <div className="events-header">
          <h3><MdEvent size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Eventos Próximos</h3>
          <Link to="/events" className="view-all-link">
            Ver todos →
          </Link>
        </div>
        <div className="events-empty">
          <div className="empty-icon"><MdCalendarToday size={48} /></div>
          <p>No hay eventos próximos</p>
          <span>Los próximos eventos aparecerán aquí</span>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events">
      <div className="events-header">
        <h3><MdEvent size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Eventos Próximos</h3>
        <Link to="/events" className="view-all-link">
          Ver todos →
        </Link>
      </div>

      <div className="events-list">
        {events.map((event) => {
          const IconComponent = getEventIcon(event);
          const cost = event.costoDunab || event.cost || 0;
          const reward = event.recompensaDunab || event.reward || 0;
          const costBadgeColor = getCostBadgeColor(cost);

          return (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="event-item"
            >
              <div className="event-icon">
                <IconComponent size={32} />
              </div>

              <div className="event-details">
                <h4 className="event-title">
                  {event.nombre || event.name}
                </h4>
                <p className="event-date">
                  <MdEvent size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{formatDate(event.fecha || event.date)}
                </p>
                {event.descripcion && (
                  <p className="event-description">
                    {event.descripcion.length > 100
                      ? `${event.descripcion.substring(0, 100)}...`
                      : event.descripcion}
                  </p>
                )}
              </div>

              <div className="event-badges">
                {cost > 0 ? (
                  <span className={`badge badge-cost badge-${costBadgeColor}`}>
                    <MdAttachMoney size={16} style={{ verticalAlign: 'middle' }} /> {formatCurrency(cost, false)} D
                  </span>
                ) : (
                  <span className="badge badge-free">
                    <MdStars size={16} style={{ verticalAlign: 'middle' }} /> Gratis
                  </span>
                )}

                {reward > 0 && (
                  <span className="badge badge-reward">
                    <MdCardGiftcard size={16} style={{ verticalAlign: 'middle' }} /> +{formatCurrency(reward, false)} D
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="events-footer">
        <Link to="/events" className="view-all-button">
          Ver Todos los Eventos
        </Link>
      </div>
    </div>
  );
};

export default UpcomingEvents;
