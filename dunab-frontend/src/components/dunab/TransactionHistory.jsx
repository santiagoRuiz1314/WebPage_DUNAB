import React, { useState, useEffect, useCallback } from 'react';
import { useDunab } from '../../context/DunabContext';
import TransactionTable from './TransactionTable';
import TransactionCard from '../shared/TransactionCard';
import FilterBar from './FilterBar';
import './TransactionHistory.css';

/**
 * Componente de historial completo de transacciones
 * Incluye filtros avanzados, búsqueda, paginación y vistas (tabla/tarjetas)
 */
const TransactionHistory = () => {
  const { transactions, loading, fetchTransactions } = useDunab();
  const [view, setView] = useState('table'); // 'table' o 'cards'
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'all', // 'all', 'ingreso', 'egreso'
    category: 'all',
    status: 'all', // 'all', 'activa', 'anulada'
    dateFrom: '',
    dateTo: ''
  });

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (!transactions) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = [...transactions];

    // Filtro de búsqueda de texto
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.descripcion?.toLowerCase().includes(searchLower) ||
        t.categoria?.toLowerCase().includes(searchLower) ||
        t.id?.toString().includes(searchLower)
      );
    }

    // Filtro de tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(t =>
        t.tipo?.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filtro de categoría
    if (filters.category !== 'all') {
      filtered = filtered.filter(t =>
        t.categoria?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filtro de estado
    if (filters.status !== 'all') {
      filtered = filtered.filter(t =>
        t.estado?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Filtro de fecha desde
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(t => new Date(t.fecha) >= fromDate);
    }

    // Filtro de fecha hasta
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Incluir todo el día
      filtered = filtered.filter(t => new Date(t.fecha) <= toDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  // Manejador de cambios en filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Limpiar filtros
  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      type: 'all',
      category: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  // Refrescar transacciones
  const handleRefresh = useCallback(() => {
    if (fetchTransactions) {
      fetchTransactions();
    }
  }, [fetchTransactions]);

  // Manejador de click en transacción
  const handleTransactionClick = useCallback((transaction) => {
    console.log('Transaction clicked:', transaction);
    // Aquí se podría abrir un modal con detalles
  }, []);

  // Calcular estadísticas del historial filtrado
  const statistics = {
    total: filteredTransactions.length,
    ingresos: filteredTransactions.filter(t =>
      t.tipo?.toLowerCase() === 'ingreso'
    ).length,
    egresos: filteredTransactions.filter(t =>
      t.tipo?.toLowerCase() === 'egreso'
    ).length,
    montoTotal: filteredTransactions.reduce((sum, t) => {
      const monto = parseFloat(t.monto || 0);
      return sum + (t.tipo?.toLowerCase() === 'ingreso' ? monto : -monto);
    }, 0)
  };

  return (
    <div className="transaction-history">
      {/* Header */}
      <div className="history-header">
        <div className="history-title">
          <h2>📜 Historial de Transacciones</h2>
          <p className="history-subtitle">
            Consulta y filtra todas tus transacciones DUNAB
          </p>
        </div>

        <div className="history-actions">
          <button
            className="btn-refresh"
            onClick={handleRefresh}
            disabled={loading}
            title="Refrescar"
          >
            🔄 Refrescar
          </button>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`toggle-btn ${view === 'table' ? 'active' : ''}`}
              onClick={() => setView('table')}
              title="Vista de tabla"
            >
              📊
            </button>
            <button
              className={`toggle-btn ${view === 'cards' ? 'active' : ''}`}
              onClick={() => setView('cards')}
              title="Vista de tarjetas"
            >
              🗂️
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="history-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{statistics.total}</span>
        </div>
        <div className="stat-item stat-success">
          <span className="stat-label">Ingresos:</span>
          <span className="stat-value">{statistics.ingresos}</span>
        </div>
        <div className="stat-item stat-danger">
          <span className="stat-label">Egresos:</span>
          <span className="stat-value">{statistics.egresos}</span>
        </div>
        <div className={`stat-item ${statistics.montoTotal >= 0 ? 'stat-success' : 'stat-danger'}`}>
          <span className="stat-label">Neto:</span>
          <span className="stat-value">
            {statistics.montoTotal >= 0 ? '+' : ''}
            {statistics.montoTotal.toFixed(2)} DUNAB
          </span>
        </div>
      </div>

      {/* Barra de filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={filteredTransactions.length}
      />

      {/* Contenido principal */}
      <div className="history-content">
        {loading ? (
          <div className="history-loading">
            <div className="loading-spinner"></div>
            <p>Cargando historial...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron transacciones</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
            <button className="btn-clear-filters" onClick={handleClearFilters}>
              Limpiar filtros
            </button>
          </div>
        ) : view === 'table' ? (
          <TransactionTable
            transactions={filteredTransactions}
            loading={loading}
            onTransactionClick={handleTransactionClick}
            showActions={false}
          />
        ) : (
          <div className="history-cards-grid">
            {filteredTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => handleTransactionClick(transaction)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
