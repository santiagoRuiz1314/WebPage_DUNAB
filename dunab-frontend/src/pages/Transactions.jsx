import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDunab } from '../context/DunabContext';
import { useAuth } from '../context/AuthContext';
import TransactionTable from '../components/dunab/TransactionTable';
import FilterBar from '../components/dunab/FilterBar';
import CreateTransaction from '../components/dunab/CreateTransaction';
import TransactionCard from '../components/shared/TransactionCard';
import {
  FiCreditCard, FiPlus, FiDownload, FiTable, FiGrid, FiX
} from 'react-icons/fi';
import { MdAccountBalance, MdInbox, MdAdd } from 'react-icons/md';
import './Transactions.css';

const Transactions = () => {
  const { t } = useTranslation();
  const {
    transactions,
    fetchTransactions,
    deleteTransaction,
    categories,
    loadCategories,
    statistics,
    fetchStatistics
  } = useDunab();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'all',
    category: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  // Cargar datos iniciales solo una vez al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTransactions(),
          loadCategories && loadCategories(),
          fetchStatistics && fetchStatistics()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío: solo se ejecuta al montar el componente

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
      if (filters.type && filters.type !== 'all' && transaction.tipo?.toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }

      // Filtro por categoría
      if (filters.category && filters.category !== 'all' && transaction.categoria !== filters.category) {
        return false;
      }

      // Filtro por estado
      if (filters.status && filters.status !== 'all' && transaction.estado?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Filtro por fecha de inicio
      if (filters.dateFrom) {
        const transactionDate = new Date(transaction.fecha);
        const startDate = new Date(filters.dateFrom);
        if (transactionDate < startDate) return false;
      }

      // Filtro por fecha fin
      if (filters.dateTo) {
        const transactionDate = new Date(transaction.fecha);
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59, 999); // Final del día
        if (transactionDate > endDate) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  // Manejar cambios de filtros
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Manejar limpieza de filtros
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
    if (!window.confirm(t('transactions.confirmVoid', { id: transaction.id }))) {
      return;
    }

    try {
      await deleteTransaction(transaction.id);
      await fetchTransactions(); // Recargar lista
      if (fetchStatistics) {
        await fetchStatistics(); // Recargar estadísticas
      }
    } catch (error) {
      alert(t('transactions.errorVoiding') + ': ' + (error.response?.data?.message || error.message));
    }
  };

  // Manejar éxito de creación/edición
  const handleTransactionSuccess = async () => {
    setShowCreateModal(false);
    setSelectedTransaction(null);
    await fetchTransactions(); // Recargar lista
    if (fetchStatistics) {
      await fetchStatistics(); // Recargar estadísticas
    }
  };

  // Exportar transacciones a CSV
  const handleExport = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert(t('transactions.noTransactionsToExport'));
      return;
    }

    const headers = [
      t('transactions.csvHeaders.id'),
      t('transactions.csvHeaders.date'),
      t('transactions.csvHeaders.type'),
      t('transactions.csvHeaders.amount'),
      t('transactions.csvHeaders.category'),
      t('transactions.csvHeaders.description'),
      t('transactions.csvHeaders.status')
    ];
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

  // Todos los usuarios autenticados tienen acceso completo
  const isAdmin = true;

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1><FiCreditCard /> {t('transactions.myTransactions')}</h1>
          <p className="page-subtitle">
            {t('transactions.historyComplete')}
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
              <FiPlus /> {t('transactions.newTransaction')}
            </button>
          )}
          <button
            className="btn-export"
            onClick={handleExport}
            disabled={!filteredTransactions || filteredTransactions.length === 0}
          >
            <FiDownload /> {t('common.export')}
          </button>
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title={t('transactions.viewTable')}
            >
              <FiTable />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title={t('transactions.viewCards')}
            >
              <FiGrid />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        categories={categories}
        resultCount={filteredTransactions?.length || 0}
      />

      {/* Estadísticas rápidas */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-label">{t('transactions.totalTransactions')}</span>
          <span className="stat-value">{statistics?.totalTransacciones || filteredTransactions?.length || 0}</span>
        </div>
        <div className="stat-card income">
          <span className="stat-label">{t('transactions.totalEarned')}</span>
          <span className="stat-value">
            {statistics?.totalGanado?.toFixed(2) || '0.00'} D
          </span>
        </div>
        <div className="stat-card expense">
          <span className="stat-label">{t('transactions.totalSpent')}</span>
          <span className="stat-value">
            {statistics?.totalGastado?.toFixed(2) || '0.00'} D
          </span>
        </div>
        <div className="stat-card balance">
          <span className="stat-label">{t('transactions.currentBalance')}</span>
          <span className="stat-value">
            {statistics?.saldoActual?.toFixed(2) || '0.00'} D
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
                <p>{t('transactions.loadingTransactions')}</p>
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
                <div className="empty-icon"><MdInbox size={64} /></div>
                <h3>{t('transactions.noTransactions')}</h3>
                <p>
                  {(filters.searchTerm || filters.type !== 'all' || filters.category !== 'all' ||
                    filters.status !== 'all' || filters.dateFrom || filters.dateTo)
                    ? t('transactions.noFiltersMatch')
                    : t('transactions.startEarning')}
                </p>
                {!(filters.searchTerm || filters.type !== 'all' || filters.category !== 'all' ||
                   filters.status !== 'all' || filters.dateFrom || filters.dateTo) && isAdmin && (
                  <button
                    className="btn-create"
                    onClick={() => setShowCreateModal(true)}
                    style={{ marginTop: '1rem' }}
                  >
                    <MdAdd size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{t('transactions.createFirst')}
                  </button>
                )}
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
              <FiX />
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
