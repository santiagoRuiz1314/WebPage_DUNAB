import React from 'react';
import PropTypes from 'prop-types';
import StatCard from '../shared/StatCard';
import { formatCurrency } from '../../utils/formatters';
import './QuickStats.css';

/**
 * Componente de estadísticas rápidas DUNAB
 * Muestra 4 tarjetas con métricas principales:
 * - Total Ganado (verde)
 * - Total Gastado (rojo)
 * - Transacciones Este Mes (azul)
 * - Promedio por Transacción (dorado)
 *
 * @param {Object} statistics - Objeto con las estadísticas
 * @param {number} statistics.totalEarned - Total DUNAB ganado
 * @param {number} statistics.totalSpent - Total DUNAB gastado
 * @param {number} statistics.monthlyTransactions - Transacciones del mes
 * @param {number} statistics.averageTransaction - Promedio por transacción
 * @param {Object} statistics.trends - Tendencias opcionales para cada métrica
 * @param {boolean} loading - Estado de carga
 * @param {Function} onStatClick - Callback al hacer click en una estadística
 */
const QuickStats = ({
  statistics = {
    totalEarned: 0,
    totalSpent: 0,
    monthlyTransactions: 0,
    averageTransaction: 0,
    trends: null
  },
  loading = false,
  onStatClick
}) => {
  const handleStatClick = (statType) => {
    if (onStatClick) {
      onStatClick(statType);
    }
  };

  // Configuración de las estadísticas
  const stats = [
    {
      id: 'earned',
      label: 'Total Ganado',
      value: formatCurrency(statistics.totalEarned, false),
      icon: '💰',
      color: 'success',
      trend: statistics.trends?.earned,
      suffix: 'DUNAB'
    },
    {
      id: 'spent',
      label: 'Total Gastado',
      value: formatCurrency(statistics.totalSpent, false),
      icon: '💸',
      color: 'danger',
      trend: statistics.trends?.spent,
      suffix: 'DUNAB'
    },
    {
      id: 'monthly',
      label: 'Transacciones Este Mes',
      value: statistics.monthlyTransactions,
      icon: '📊',
      color: 'info',
      trend: statistics.trends?.monthly,
      suffix: 'transacciones'
    },
    {
      id: 'average',
      label: 'Promedio por Transacción',
      value: formatCurrency(statistics.averageTransaction, false),
      icon: '⚖️',
      color: 'warning',
      trend: statistics.trends?.average,
      suffix: 'DUNAB'
    }
  ];

  if (loading) {
    return (
      <div className="quick-stats">
        <div className="quick-stats__grid">
          {[1, 2, 3, 4].map((index) => (
            <StatCard
              key={index}
              label="Cargando..."
              value="0"
              icon="⏳"
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quick-stats">
      <div className="quick-stats__header">
        <h3 className="quick-stats__title">Estadísticas Rápidas</h3>
        <p className="quick-stats__subtitle">Resumen de tu actividad DUNAB</p>
      </div>

      <div className="quick-stats__grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            onClick={onStatClick ? () => handleStatClick(stat.id) : undefined}
            className="quick-stats__card"
          />
        ))}
      </div>

      <div className="quick-stats__summary">
        <div className="quick-stats__net">
          <span className="quick-stats__net-label">Balance Neto:</span>
          <span className={`quick-stats__net-value ${
            statistics.totalEarned - statistics.totalSpent >= 0
              ? 'quick-stats__net-value--positive'
              : 'quick-stats__net-value--negative'
          }`}>
            {statistics.totalEarned >= statistics.totalSpent ? '+' : ''}
            {formatCurrency(statistics.totalEarned - statistics.totalSpent, false)} DUNAB
          </span>
        </div>
      </div>
    </div>
  );
};

QuickStats.propTypes = {
  statistics: PropTypes.shape({
    totalEarned: PropTypes.number,
    totalSpent: PropTypes.number,
    monthlyTransactions: PropTypes.number,
    averageTransaction: PropTypes.number,
    trends: PropTypes.shape({
      earned: PropTypes.shape({
        value: PropTypes.number,
        direction: PropTypes.oneOf(['up', 'down'])
      }),
      spent: PropTypes.shape({
        value: PropTypes.number,
        direction: PropTypes.oneOf(['up', 'down'])
      }),
      monthly: PropTypes.shape({
        value: PropTypes.number,
        direction: PropTypes.oneOf(['up', 'down'])
      }),
      average: PropTypes.shape({
        value: PropTypes.number,
        direction: PropTypes.oneOf(['up', 'down'])
      })
    })
  }),
  loading: PropTypes.bool,
  onStatClick: PropTypes.func
};

export default QuickStats;
