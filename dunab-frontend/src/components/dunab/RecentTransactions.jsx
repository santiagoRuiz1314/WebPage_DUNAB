import React from 'react';
import { useDunab } from '../../context/DunabContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import {
  MdTrendingUp,
  MdTrendingDown,
  MdCreditCard,
  MdSchool,
  MdCelebration,
  MdBuild,
  MdCardGiftcard,
  MdShoppingCart,
  MdAttachMoney
} from 'react-icons/md';
import './RecentTransactions.css';

/**
 * Componente que muestra las transacciones recientes usando Stack (LIFO)
 * Las transacciones más recientes se muestran primero
 */
const RecentTransactions = ({ limit = 5 }) => {
  const { recentTransactions, loading } = useDunab();
  const { t } = useTranslation();

  // Limitar el número de transacciones mostradas
  const displayedTransactions = recentTransactions.slice(0, limit);

  /**
   * Obtener icono y color según el tipo de transacción
   */
  const getTransactionStyle = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'ingreso':
      case 'credito':
      case 'credit':
        return { icon: MdTrendingUp, color: 'success', symbol: '+' };
      case 'egreso':
      case 'debito':
      case 'debit':
        return { icon: MdTrendingDown, color: 'danger', symbol: '-' };
      default:
        return { icon: MdCreditCard, color: 'info', symbol: '' };
    }
  };

  /**
   * Obtener icono de categoría
   */
  const getCategoryIcon = (category) => {
    const icons = {
      'académico': MdSchool,
      'academico': MdSchool,
      'evento': MdCelebration,
      'servicio': MdBuild,
      'recompensa': MdCardGiftcard,
      'compra': MdShoppingCart,
      'default': MdAttachMoney
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  if (loading) {
    return (
      <div className="recent-transactions">
        <div className="transactions-header">
          <h3><MdCreditCard /> {t('dunab.recentTransactions')}</h3>
        </div>
        <div className="transactions-loading">
          {[1, 2, 3].map(i => (
            <div key={i} className="transaction-skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
              <div className="skeleton-amount"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!displayedTransactions || displayedTransactions.length === 0) {
    return (
      <div className="recent-transactions">
        <div className="transactions-header">
          <h3><MdCreditCard /> {t('dunab.recentTransactions')}</h3>
        </div>
        <div className="transactions-empty">
          <p>{t('transactions.noTransactions')}</p>
          <span>{t('dunab.recentTransactionsPlaceholder')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h3><MdCreditCard /> {t('dunab.recentTransactions')}</h3>
        <Link to="/transactions" className="view-all-link">
          {t('dunab.viewAll')} →
        </Link>
      </div>

      <div className="transactions-list">
        {displayedTransactions.map((transaction) => {
          const style = getTransactionStyle(transaction.tipo || transaction.type);
          const CategoryIcon = getCategoryIcon(transaction.categoria || transaction.category);

          return (
            <div
              key={transaction.id}
              className={`transaction-item transaction-${style.color}`}
            >
              <div className="transaction-icon">
                <CategoryIcon />
              </div>

              <div className="transaction-details">
                <p className="transaction-description">
                  {transaction.descripcion || transaction.description}
                </p>
                <div className="transaction-meta">
                  <span className="transaction-category">
                    {transaction.categoria || transaction.category}
                  </span>
                  <span className="transaction-separator">•</span>
                  <span className="transaction-date">
                    {formatDate(transaction.fecha || transaction.date)}
                  </span>
                </div>
              </div>

              <div className={`transaction-amount amount-${style.color}`}>
                <span className="amount-symbol">{style.symbol}</span>
                <span className="amount-value">
                  {formatCurrency(transaction.monto || transaction.amount)}
                </span>
                <span className="amount-currency">D</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="transactions-footer">
        <p className="transactions-info">
          {t('dunab.showingRecent', { count: displayedTransactions.length })}
        </p>
      </div>
    </div>
  );
};

export default RecentTransactions;
