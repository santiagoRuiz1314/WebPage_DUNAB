import React from 'react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import './EventCard.css';

/**
 * Tarjeta de evento para mostrar en el catálogo
 * Muestra información resumida y permite navegar al detalle
 */
const EventCard = ({ event, onClick }) => {
  if (!event) return null;

  const {
    id,
    nombre,
    descripcion,
    fecha,
    fechaInicio,
    lugar,
    categoria,
    costoDunab,
    recompensaDunab,
    cuposDisponibles,
    cuposTotal,
    imagen,
    estado
  } = event;

  // Calcular porcentaje de ocupación
  const ocupacionPorcentaje = cuposTotal > 0
    ? ((cuposTotal - cuposDisponibles) / cuposTotal * 100).toFixed(0)
    : 0;

  // Determinar si hay pocos cupos
  const pocosCupos = cuposDisponibles > 0 && cuposDisponibles <= cuposTotal * 0.2;
  const sinCupos = cuposDisponibles === 0;

  // Iconos por categoría
  const categoriaIconos = {
    'académico': '📚',
    'taller': '🛠️',
    'deportivo': '⚽',
    'competencia': '🏆',
    'conferencia': '🎤',
    'cultural': '🎭',
    'social': '🤝'
  };

  const categoriaIcon = categoriaIconos[categoria] || '📅';

  // Determinar si el evento es gratuito
  const esGratuito = costoDunab === 0;

  return (
    <div
      className={`event-card ${sinCupos ? 'event-card--sold-out' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Imagen del evento */}
      <div className="event-card__image">
        {imagen ? (
          <img src={imagen} alt={nombre} />
        ) : (
          <div className="event-card__image-placeholder">
            <span className="event-card__image-icon">{categoriaIcon}</span>
          </div>
        )}

        {/* Badge de estado */}
        {sinCupos && (
          <div className="event-card__badge event-card__badge--sold-out">
            Cupos Agotados
          </div>
        )}
        {pocosCupos && !sinCupos && (
          <div className="event-card__badge event-card__badge--limited">
            ¡Últimos Cupos!
          </div>
        )}
        {esGratuito && (
          <div className="event-card__badge event-card__badge--free">
            GRATIS
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="event-card__content">
        {/* Categoría */}
        <div className="event-card__category">
          <span className="event-card__category-icon">{categoriaIcon}</span>
          <span className="event-card__category-text">{categoria}</span>
        </div>

        {/* Título */}
        <h3 className="event-card__title">{nombre}</h3>

        {/* Descripción corta */}
        <p className="event-card__description">
          {descripcion.length > 100
            ? `${descripcion.substring(0, 100)}...`
            : descripcion}
        </p>

        {/* Información del evento */}
        <div className="event-card__info">
          {/* Fecha */}
          <div className="event-card__info-item">
            <span className="event-card__info-icon">📅</span>
            <span className="event-card__info-text">
              {formatDate(fechaInicio || fecha)}
            </span>
          </div>

          {/* Lugar */}
          <div className="event-card__info-item">
            <span className="event-card__info-icon">📍</span>
            <span className="event-card__info-text">{lugar}</span>
          </div>

          {/* Cupos */}
          <div className="event-card__info-item">
            <span className="event-card__info-icon">👥</span>
            <span className="event-card__info-text">
              {cuposDisponibles} de {cuposTotal} cupos
            </span>
          </div>
        </div>

        {/* Barra de progreso de cupos */}
        <div className="event-card__progress">
          <div
            className="event-card__progress-bar"
            style={{ width: `${ocupacionPorcentaje}%` }}
          />
        </div>

        {/* Footer con costos y recompensas */}
        <div className="event-card__footer">
          {/* Costo */}
          <div className="event-card__cost">
            {esGratuito ? (
              <span className="event-card__cost-free">Entrada Gratuita</span>
            ) : (
              <>
                <span className="event-card__cost-label">Costo:</span>
                <span className="event-card__cost-value">
                  {formatCurrency(costoDunab)}
                </span>
              </>
            )}
          </div>

          {/* Recompensa */}
          {recompensaDunab > 0 && (
            <div className="event-card__reward">
              <span className="event-card__reward-icon">🎁</span>
              <span className="event-card__reward-value">
                +{formatCurrency(recompensaDunab)}
              </span>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <button
          className={`event-card__button ${sinCupos ? 'event-card__button--disabled' : ''}`}
          disabled={sinCupos}
        >
          {sinCupos ? 'Agotado' : 'Ver Detalles'}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
