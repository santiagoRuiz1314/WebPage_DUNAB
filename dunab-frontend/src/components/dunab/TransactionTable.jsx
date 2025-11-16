import React, { useState, useMemo } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import usePagination from '../../hooks/usePagination';
import {
  FiArrowUp, FiArrowDown, FiEdit3, FiTrash2, FiChevronsUp,
  FiChevronsDown, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { MdInbox } from 'react-icons/md';
import './TransactionTable.css';

const TransactionTable = ({
  transactions = [],
  loading = false,
  onTransactionClick = null,
  showActions = false,
  onEdit = null,
  onDelete = null
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });
  const itemsPerPage = 10;

  /**
   * NOTA: Este ordenamiento es solo para UX en tablas pequeñas.
   * Para producción con muchos datos, esto debería:
   * 1. Enviar sortBy y order al backend
   * 2. El backend ordena en SQL
   * 3. Implementar paginación real (no solo visual)
   *
   * Actual: Ordenamiento cliente - ACEPTABLE solo para conjuntos pequeños
   * Ideal: GET /api/dunab/transactions?sortBy=fecha&order=desc&page=0
   */
  const sortedTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const sorted = [...transactions].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Manejo especial para fechas
      if (sortConfig.key === 'fecha') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Manejo especial para montos
      if (sortConfig.key === 'monto') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [transactions, sortConfig]);

  // Paginación
  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious
  } = usePagination(sortedTransactions, itemsPerPage);

  // Función para cambiar el ordenamiento
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Obtener icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FiChevronsUp style={{ opacity: 0.3 }} />;
    return sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />;
  };

  // Obtener clase de tipo de transacción
  const getTransactionTypeClass = (tipo) => {
    return tipo?.toLowerCase() === 'ingreso' || tipo?.toLowerCase() === 'credito'
      ? 'transaction-income'
      : 'transaction-expense';
  };

  // Obtener icono de tipo
  const getTransactionIcon = (tipo) => {
    return tipo?.toLowerCase() === 'ingreso' || tipo?.toLowerCase() === 'credito'
      ? <FiArrowUp />
      : <FiArrowDown />;
  };

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="transaction-table-loading">
        <div className="loading-spinner"></div>
        <p>Cargando transacciones...</p>
      </div>
    );
  }

  // Renderizar estado vacío
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-table-empty">
        <div className="empty-icon"><MdInbox size={64} /></div>
        <h3>No hay transacciones</h3>
        <p>Aún no tienes transacciones registradas en tu cuenta DUNAB</p>
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      {/* Información de paginación */}
      <div className="table-info">
        <p>
          Mostrando {currentItems.length} de {transactions.length} transacciones
        </p>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {getSortIcon('id')}
              </th>
              <th onClick={() => handleSort('fecha')} className="sortable">
                Fecha {getSortIcon('fecha')}
              </th>
              <th onClick={() => handleSort('tipo')} className="sortable">
                Tipo {getSortIcon('tipo')}
              </th>
              <th onClick={() => handleSort('monto')} className="sortable">
                Monto {getSortIcon('monto')}
              </th>
              <th onClick={() => handleSort('categoria')} className="sortable">
                Categoría {getSortIcon('categoria')}
              </th>
              <th>Descripción</th>
              <th>Estado</th>
              {showActions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((transaction) => (
              <tr
                key={transaction.id}
                onClick={() => onTransactionClick && onTransactionClick(transaction)}
                className={onTransactionClick ? 'clickable' : ''}
              >
                <td className="transaction-id">#{transaction.id}</td>
                <td className="transaction-date">
                  {formatDate(transaction.fecha)}
                </td>
                <td className={`transaction-type ${getTransactionTypeClass(transaction.tipo)}`}>
                  <span className="type-badge">
                    <span className="type-icon">{getTransactionIcon(transaction.tipo)}</span>
                    {transaction.tipo}
                  </span>
                </td>
                <td className={`transaction-amount ${getTransactionTypeClass(transaction.tipo)}`}>
                  <strong>
                    {transaction.tipo?.toLowerCase() === 'ingreso' || transaction.tipo?.toLowerCase() === 'credito' ? '+' : '-'}
                    {formatCurrency(transaction.monto)}
                  </strong>
                </td>
                <td className="transaction-category">
                  <span className="category-tag">
                    {transaction.categoria || 'Sin categoría'}
                  </span>
                </td>
                <td className="transaction-description">
                  {transaction.descripcion || '-'}
                </td>
                <td className="transaction-status">
                  <span className={`status-badge status-${transaction.estado?.toLowerCase() || 'activa'}`}>
                    {transaction.estado || 'Activa'}
                  </span>
                </td>
                {showActions && (
                  <td className="transaction-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit && onEdit(transaction);
                      }}
                      title="Editar"
                    >
                      <FiEdit3 />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete && onDelete(transaction);
                      }}
                      title="Anular"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="table-pagination">
          <button
            onClick={previousPage}
            disabled={!canGoPrevious}
            className="pagination-btn"
          >
            <FiChevronLeft /> Anterior
          </button>

          <div className="pagination-info">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={!canGoNext}
            className="pagination-btn"
          >
            Siguiente <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
