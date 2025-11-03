import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './TransactionCard.css';

const TransactionCard = ({
  transaction,
  onClick = null,
  showActions = false,
  onEdit = null,
  onDelete = null,
  compact = false
}) => {
  if (!transaction) return null;

  const isIncome = transaction.tipo?.toLowerCase() === 'ingreso' ||
                   transaction.tipo?.toLowerCase() === 'credito';

  const getStatusColor = (estado) => {
    const status = estado?.toLowerCase();
    switch (status) {
      case 'activa':
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'anulada':
      case 'rechazada':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div
      className={`transaction-card ${isIncome ? 'income' : 'expense'} ${compact ? 'compact' : ''} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="card-header">
        <div className="transaction-icon">
          {isIncome ? '↑' : '↓'}
        </div>
        <div className="transaction-info">
          <h4 className="transaction-description">
            {transaction.descripcion || 'Sin descripción'}
          </h4>
          <span className="transaction-id">#{transaction.id}</span>
        </div>
        <div className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
          <span className="amount-sign">{isIncome ? '+' : '-'}</span>
          <span className="amount-value">{formatCurrency(transaction.monto)}</span>
        </div>
      </div>

      {/* Details */}
      {!compact && (
        <div className="card-details">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">📅 Fecha</span>
              <span className="detail-value">{formatDate(transaction.fecha)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">📊 Tipo</span>
              <span className="detail-value">{transaction.tipo}</span>
            </div>
          </div>

          {transaction.categoria && (
            <div className="detail-row">
              <div className="detail-item full-width">
                <span className="detail-label">🏷️ Categoría</span>
                <span className="category-badge">{transaction.categoria}</span>
              </div>
            </div>
          )}

          {transaction.referencia && (
            <div className="detail-row">
              <div className="detail-item full-width">
                <span className="detail-label">🔗 Referencia</span>
                <span className="detail-value reference">{transaction.referencia}</span>
              </div>
            </div>
          )}

          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">✅ Estado</span>
              <span className={`status-badge ${getStatusColor(transaction.estado)}`}>
                {transaction.estado || 'Activa'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="card-actions">
          <button
            className="btn-card-action btn-edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(transaction);
            }}
          >
            ✏️ Editar
          </button>
          <button
            className="btn-card-action btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(transaction);
            }}
          >
            🗑️ Anular
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
