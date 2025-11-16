import React from 'react';
import { useDunab } from '../../context/DunabContext';
import { formatCurrency } from '../../utils/formatters';
import { MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown, MdCreditCard, MdBarChart } from 'react-icons/md';
import './StatisticsWidget.css';

/**
 * Widget de estadísticas clave para el Dashboard
 * Muestra métricas importantes del sistema DUNAB
 */
const StatisticsWidget = () => {
  const { balance, statistics, loading } = useDunab();

  const stats = [
    {
      id: 'balance',
      icon: MdAccountBalanceWallet,
      label: 'Saldo Actual',
      value: formatCurrency(balance || 0),
      suffix: 'D',
      color: 'primary',
      trend: null
    },
    {
      id: 'earned',
      icon: MdTrendingUp,
      label: 'Total Ganado',
      value: formatCurrency(statistics?.totalEarned || 0),
      suffix: 'D',
      color: 'success',
      trend: '+' + (statistics?.earnedPercentage || 0) + '%'
    },
    {
      id: 'spent',
      icon: MdTrendingDown,
      label: 'Total Gastado',
      value: formatCurrency(statistics?.totalSpent || 0),
      suffix: 'D',
      color: 'danger',
      trend: '-' + (statistics?.spentPercentage || 0) + '%'
    },
    {
      id: 'transactions',
      icon: MdCreditCard,
      label: 'Transacciones',
      value: statistics?.totalTransactions || 0,
      suffix: '',
      color: 'info',
      trend: null
    }
  ];

  if (loading) {
    return (
      <div className="statistics-widget">
        <div className="widget-header">
          <h3><MdBarChart size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Estadísticas</h3>
        </div>
        <div className="stats-grid loading">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-widget">
      <div className="widget-header">
        <h3><MdBarChart size={24} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Estadísticas</h3>
        <span className="widget-subtitle">Resumen de tu actividad DUNAB</span>
      </div>

      <div className="stats-grid">
        {stats.map(stat => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.id} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon"><IconComponent size={28} /></div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <div className="stat-value-container">
                <p className="stat-value">
                  {stat.value}
                  {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
                </p>
                {stat.trend && (
                  <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsWidget;
