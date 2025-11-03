import React from 'react';
import { useDunab } from '../../context/DunabContext';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../shared/LoadingSpinner';

const DunabWallet = () => {
  const { balance, statistics, loading } = useDunab();

  if (loading) {
    return <LoadingSpinner message="Cargando tu wallet..." />;
  }

  return (
    <div className="dunab-wallet">
      <div className="wallet-header">
        <h2>💰 Mi Wallet DUNAB</h2>
      </div>

      <div className="wallet-content">
        {/* Balance Card */}
        <div className="balance-card-large">
          <div className="balance-card-header">
            <span className="balance-label">Saldo Actual</span>
          </div>
          <div className="balance-card-amount">
            <span className="currency-symbol">D</span>
            <span className="amount">{formatCurrency(balance || 0)}</span>
          </div>
          <div className="balance-card-footer">
            <p className="balance-hint">Dinero virtual UNAB</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <p className="stat-label">Total Ganado</p>
              <p className="stat-value">{formatCurrency(statistics?.totalEarned || 0)} D</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📉</div>
            <div className="stat-content">
              <p className="stat-label">Total Gastado</p>
              <p className="stat-value">{formatCurrency(statistics?.totalSpent || 0)} D</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-content">
              <p className="stat-label">Transacciones</p>
              <p className="stat-value">{statistics?.totalTransactions || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DunabWallet;
