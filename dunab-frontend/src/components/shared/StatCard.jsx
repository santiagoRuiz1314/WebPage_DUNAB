import React from 'react';
import PropTypes from 'prop-types';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import './StatCard.css';

/**
 * Componente reutilizable para mostrar estadísticas
 * @param {string} label - Etiqueta de la estadística
 * @param {number|string} value - Valor a mostrar
 * @param {ReactNode} icon - Ícono de la estadística
 * @param {string} color - Color del tema: 'primary', 'success', 'danger', 'warning', 'info'
 * @param {Object} trend - Tendencia opcional { value: number, direction: 'up' | 'down' }
 * @param {boolean} loading - Estado de carga
 * @param {Function} onClick - Callback opcional al hacer click
 */
const StatCard = ({
  label,
  value,
  icon,
  color = 'primary',
  trend,
  loading = false,
  onClick,
  className = ''
}) => {
  const cardClasses = `stat-card stat-card--${color} ${onClick ? 'stat-card--clickable' : ''} ${className}`;

  const renderTrend = () => {
    if (!trend) return null;

    const trendClasses = `stat-trend stat-trend--${trend.direction}`;
    const TrendIcon = trend.direction === 'up' ? MdTrendingUp : MdTrendingDown;

    return (
      <span className={trendClasses}>
        <TrendIcon size={16} /> {Math.abs(trend.value)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`stat-card stat-card--loading ${className}`}>
        <div className="stat-card__skeleton">
          <div className="skeleton skeleton--circle"></div>
          <div className="skeleton skeleton--text"></div>
          <div className="skeleton skeleton--title"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className="stat-card__content">
        <div className="stat-card__header">
          <div className={`stat-card__icon stat-card__icon--${color}`}>
            {icon}
          </div>
          {renderTrend()}
        </div>

        <div className="stat-card__body">
          <p className="stat-card__value">{value}</p>
          <p className="stat-card__label">{label}</p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'success', 'danger', 'warning', 'info']),
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['up', 'down']).isRequired
  }),
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default StatCard;
