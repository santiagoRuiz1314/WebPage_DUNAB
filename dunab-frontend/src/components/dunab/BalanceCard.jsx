import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import './BalanceCard.css';

/**
 * Tarjeta de balance DUNAB con diseño atractivo y animaciones
 * @param {number} balance - Saldo actual
 * @param {number} previousBalance - Saldo anterior (para calcular cambios)
 * @param {boolean} loading - Estado de carga
 * @param {Function} onRefresh - Callback para refrescar saldo
 */
const BalanceCard = ({
  balance = 0,
  previousBalance,
  loading = false,
  onRefresh
}) => {
  const [displayBalance, setDisplayBalance] = useState(0);
  const [variation, setVariation] = useState(null);

  // Animación de contador
  useEffect(() => {
    if (loading) return;

    const duration = 1000; // 1 segundo
    const steps = 60;
    const increment = (balance - displayBalance) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayBalance(balance);
        clearInterval(timer);
      } else {
        setDisplayBalance(prev => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [balance, loading]);

  // Calcular variación
  useEffect(() => {
    if (previousBalance !== undefined && previousBalance !== null) {
      const diff = balance - previousBalance;
      const percentChange = previousBalance !== 0
        ? ((diff / previousBalance) * 100).toFixed(2)
        : 0;

      setVariation({
        amount: diff,
        percent: percentChange,
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
      });
    }
  }, [balance, previousBalance]);

  if (loading) {
    return (
      <div className="balance-card balance-card--loading">
        <div className="balance-card__skeleton">
          <div className="skeleton skeleton--title"></div>
          <div className="skeleton skeleton--amount"></div>
          <div className="skeleton skeleton--info"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="balance-card">
      <div className="balance-card__background">
        <div className="balance-card__gradient"></div>
        <div className="balance-card__pattern"></div>
      </div>

      <div className="balance-card__content">
        <div className="balance-card__header">
          <div className="balance-card__label">
            <span className="balance-icon">💰</span>
            <h3>Saldo Disponible</h3>
          </div>

          {onRefresh && (
            <button
              className="balance-card__refresh"
              onClick={onRefresh}
              aria-label="Refrescar saldo"
            >
              🔄
            </button>
          )}
        </div>

        <div className="balance-card__amount">
          <span className="currency-symbol">D</span>
          <span className="amount-value">
            {formatCurrency(displayBalance)}
          </span>
          <span className="currency-label">DUNAB</span>
        </div>

        {variation && variation.direction !== 'neutral' && (
          <div className={`balance-card__variation variation--${variation.direction}`}>
            <span className="variation-icon">
              {variation.direction === 'up' ? '↑' : '↓'}
            </span>
            <span className="variation-amount">
              {Math.abs(variation.amount).toFixed(2)} DUNAB
            </span>
            <span className="variation-percent">
              ({variation.percent}%)
            </span>
            <span className="variation-label">
              vs. anterior
            </span>
          </div>
        )}

        {!variation && (
          <div className="balance-card__info">
            <p>Tu saldo actual de DUNAB</p>
          </div>
        )}
      </div>

      <div className="balance-card__shine"></div>
    </div>
  );
};

BalanceCard.propTypes = {
  balance: PropTypes.number,
  previousBalance: PropTypes.number,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func
};

export default BalanceCard;
