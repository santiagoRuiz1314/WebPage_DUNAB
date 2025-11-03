import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDunab } from '../context/DunabContext';
import { useAuth } from '../context/AuthContext';
import TransactionTable from '../components/dunab/TransactionTable';
import FilterBar from '../components/dunab/FilterBar';
import CreateTransaction from '../components/dunab/CreateTransaction';
import TransactionCard from '../components/shared/TransactionCard';
import { useMockTransactions, useMockCategories } from '../hooks/useMockData';
import './Transactions.css';

const Transactions = () => {
  const { transactions: contextTransactions, loadTransactions, deleteTransaction, categories: contextCategories, loadCategories } = useDunab();
  const { user } = useAuth();

  // USAR DATOS MOCK SI NO HAY BACKEND
  const mockTransactions = useMockTransactions();
  const mockCategories = useMockCategories();
  const transactions = contextTransactions && contextTransactions.length > 0 ? contextTransactions : mockTransactions;
  const categories = contextCategories && contextCategories.length > 0 ? contextCategories : mockCategories;

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadTransactions(),
          loadCategories && loadCategories()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loadTransactions, loadCategories]);

  // Aplicar filtros a las transacciones
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    return transactions.filter(transaction => {
      // Filtro por búsqueda de texto
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          transaction.descripcion?.toLowerCase().includes(searchLower) ||
          transaction.id?.toString().includes(searchLower) ||
          transaction.monto?.toString().includes(searchLower) ||
          transaction.referencia?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Filtro por tipo
      if (filters.tipo && transaction.tipo?.toLowerCase() !== filters.tipo.toLowerCase()) {
        return false;
      }

      // Filtro por categoría
      if (filters.categoria && transaction.categoria !== filters.categoria) {
        return false;
      }

      // Filtro por estado
      if (filters.estado && transaction.estado?.toLowerCase() !== filters.estado.toLowerCase()) {
        return false;
      }

      // Filtro por fecha de inicio
      if (filters.fechaInicio) {
        const transactionDate = new Date(transaction.fecha);
        const startDate = new Date(filters.fechaInicio);
        if (transactionDate < startDate) return false;
      }

      // Filtro por fecha fin
      if (filters.fechaFin) {
        const transactionDate = new Date(transaction.fecha);
        const endDate = new Date(filters.fechaFin);
        endDate.setHours(23, 59, 59, 999); // Final del día
        if (transactionDate > endDate) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Manejar cambios de filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Manejar click en transacción
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Manejar edición
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowCreateModal(true);
  };

  // Manejar eliminación
  const handleDelete = async (transaction) => {
    if (!window.confirm(`¿Estás seguro de que deseas anular la transacción #${transaction.id}?`)) {
      return;
    }

    try {
      await deleteTransaction(transaction.id);
      await loadTransactions(); // Recargar lista
    } catch (error) {
      alert('Error al anular la transacción: ' + (error.response?.data?.message || error.message));
    }
  };

  // Manejar éxito de creación/edición
  const handleTransactionSuccess = async () => {
    setShowCreateModal(false);
    setSelectedTransaction(null);
    await loadTransactions(); // Recargar lista
  };

  // Exportar transacciones a CSV
  const handleExport = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert('No hay transacciones para exportar');
      return;
    }

    const headers = ['ID', 'Fecha', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Estado'];
    const csvData = [
      headers.join(','),
      ...filteredTransactions.map(t =>
        [
          t.id,
          t.fecha,
          t.tipo,
          t.monto,
          t.categoria || '',
          `"${t.descripcion || ''}"`,
          t.estado || ''
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacciones_dunab_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Verificar si el usuario es admin
  const isAdmin = user?.role === 'admin' || user?.rol === 'admin' || user?.role === 'ADMIN';

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>💳 Mis Transacciones</h1>
          <p className="page-subtitle">
            Historial completo de tus movimientos DUNAB
          </p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button
              className="btn-create"
              onClick={() => {
                setSelectedTransaction(null);
                setShowCreateModal(true);
              }}
            >
              ➕ Nueva Transacción
            </button>
          )}
          <button
            className="btn-export"
            onClick={handleExport}
            disabled={!filteredTransactions || filteredTransactions.length === 0}
          >
            📥 Exportar
          </button>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista de tabla"
            >
              📊
            </button>
            <button
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista de tarjetas"
            >
              🗂️
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        onFilter={handleFilterChange}
        categories={categories}
      />

      {/* Estadísticas rápidas */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-label">Total Transacciones</span>
          <span className="stat-value">{filteredTransactions?.length || 0}</span>
        </div>
        <div className="stat-card income">
          <span className="stat-label">Ingresos</span>
          <span className="stat-value">
            {filteredTransactions?.filter(t =>
              t.tipo?.toLowerCase() === 'ingreso' || t.tipo?.toLowerCase() === 'credito'
            ).length || 0}
          </span>
        </div>
        <div className="stat-card expense">
          <span className="stat-label">Egresos</span>
          <span className="stat-value">
            {filteredTransactions?.filter(t =>
              t.tipo?.toLowerCase() === 'egreso' || t.tipo?.toLowerCase() === 'debito'
            ).length || 0}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="transactions-content">
        {viewMode === 'table' ? (
          <TransactionTable
            transactions={filteredTransactions}
            loading={loading}
            onTransactionClick={handleTransactionClick}
            showActions={isAdmin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="transactions-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando transacciones...</p>
              </div>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleTransactionClick(transaction)}
                  showActions={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No hay transacciones</h3>
                <p>No se encontraron transacciones con los filtros aplicados</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de creación/edición */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            <CreateTransaction
              onSuccess={handleTransactionSuccess}
              onCancel={() => setShowCreateModal(false)}
              initialData={selectedTransaction}
              mode={selectedTransaction ? 'edit' : 'create'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
