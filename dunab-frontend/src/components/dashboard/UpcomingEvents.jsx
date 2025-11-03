import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import { formatDate, formatCurrency } from '../../utils/formatters';
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
   * Cargar eventos próximos
   */
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener todos los eventos y filtrar los próximos
        const response = await eventService.getAllEvents();
        const allEvents = response.content || response || [];

        // Filtrar eventos próximos (fecha futura) y limitar
        const now = new Date();
        const upcoming = allEvents
          .filter(event => {
            const eventDate = new Date(event.fecha || event.date);
            return eventDate > now && event.estado !== 'CANCELLED';
          })
          .sort((a, b) => {
            const dateA = new Date(a.fecha || a.date);
            const dateB = new Date(b.fecha || b.date);
            return dateA - dateB;
          })
          .slice(0, limit);

        setEvents(upcoming);
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError('No se pudieron cargar los eventos');
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
      'conferencia': '🎤',
      'taller': '🛠️',
      'deportivo': '⚽',
      'cultural': '🎭',
      'académico': '📚',
      'social': '🎉',
      'default': '🎉'
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
          <h3>🎉 Eventos Próximos</h3>
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
          <h3>🎉 Eventos Próximos</h3>
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
          <h3>🎉 Eventos Próximos</h3>
          <Link to="/events" className="view-all-link">
            Ver todos →
          </Link>
        </div>
        <div className="events-empty">
          <div className="empty-icon">📅</div>
          <p>No hay eventos próximos</p>
          <span>Los próximos eventos aparecerán aquí</span>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events">
      <div className="events-header">
        <h3>🎉 Eventos Próximos</h3>
        <Link to="/events" className="view-all-link">
          Ver todos →
        </Link>
      </div>

      <div className="events-list">
        {events.map((event) => {
          const icon = getEventIcon(event);
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
                {icon}
              </div>

              <div className="event-details">
                <h4 className="event-title">
                  {event.nombre || event.name}
                </h4>
                <p className="event-date">
                  📅 {formatDate(event.fecha || event.date)}
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
                    💰 {formatCurrency(cost, false)} D
                  </span>
                ) : (
                  <span className="badge badge-free">
                    ✨ Gratis
                  </span>
                )}

                {reward > 0 && (
                  <span className="badge badge-reward">
                    🎁 +{formatCurrency(reward, false)} D
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
