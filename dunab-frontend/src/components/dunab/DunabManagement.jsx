import React, { useState, useEffect } from 'react';
import { useDunab } from '../../context/DunabContext';
import CreateTransaction from './CreateTransaction';
import TransactionTable from './TransactionTable';
import CategoryManagement from './CategoryManagement';
import StatCard from '../shared/StatCard';
import { formatCurrency } from '../../utils/formatters';
import {
  FiBarChart2, FiCreditCard, FiTag, FiTrendingUp, FiPlus,
  FiRefreshCw, FiAlertTriangle, FiUsers
} from 'react-icons/fi';
import { MdDashboard, MdCategory, MdAssessment } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';
import { BsCalendar2Day } from 'react-icons/bs';
import './DunabManagement.css';

/**
 * Componente de gestión completa del sistema DUNAB (Solo Admin)
 *
 * Funcionalidades:
 * - Dashboard con estadísticas generales
 * - Gestión de transacciones (CRUD)
 * - Gestión de categorías
 * - Reportes y exportación
 * - Actividad reciente del sistema
 *
 * Tabs:
 * 1. Dashboard - Visión general con estadísticas
 * 2. Transacciones - Tabla completa con CRUD
 * 3. Categorías - Gestión de categorías
 * 4. Reportes - Generación de reportes
 */
const DunabManagement = () => {
  const {
    transactions,
    loading,
    statistics,
    fetchTransactions,
    fetchStatistics,
    deleteTransaction
  } = useDunab();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Cargar datos al montar (solo una vez)
  useEffect(() => {
    if (fetchTransactions) {
      fetchTransactions();
    }
    if (fetchStatistics) {
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío: solo se ejecuta al montar el componente

  // Configuración de tabs
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { id: 'transactions', label: 'Transacciones', icon: <FiCreditCard /> },
    { id: 'categories', label: 'Categorías', icon: <MdCategory /> },
    { id: 'reports', label: 'Reportes', icon: <MdAssessment /> }
  ];

  // Calcular estadísticas del sistema
  const systemStats = {
    totalTransactions: transactions?.length || 0,
    totalStudents: statistics?.totalStudents || 0,
    dunabInCirculation: statistics?.totalDunabInCirculation || 0,
    todayTransactions: transactions?.filter(t => {
      const today = new Date().toDateString();
      const transDate = new Date(t.fecha).toDateString();
      return today === transDate;
    }).length || 0,
    totalIncome: transactions?.filter(t =>
      t.tipo?.toLowerCase() === 'ingreso' || t.tipo?.toLowerCase() === 'credito'
    ).reduce((sum, t) => sum + parseFloat(t.monto || 0), 0) || 0,
    totalExpense: transactions?.filter(t =>
      t.tipo?.toLowerCase() === 'egreso' || t.tipo?.toLowerCase() === 'debito'
    ).reduce((sum, t) => sum + parseFloat(t.monto || 0), 0) || 0
  };

  // Manejadores
  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setEditingTransaction(null);
    if (fetchTransactions) {
      fetchTransactions();
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowCreateModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (showDeleteConfirm && deleteTransaction) {
      try {
        await deleteTransaction(showDeleteConfirm.id);
        setShowDeleteConfirm(null);
        if (fetchTransactions) {
          fetchTransactions();
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Renderizar Dashboard
  const renderDashboard = () => (
    <div className="management-dashboard">
      <div className="dashboard-header">
        <h3><FiBarChart2 /> Visión General del Sistema</h3>
        <button
          className="btn-refresh"
          onClick={() => {
            fetchTransactions && fetchTransactions();
            fetchStatistics && fetchStatistics();
          }}
          disabled={loading}
        >
          <FiRefreshCw /> Actualizar
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="dashboard-stats-grid">
        <StatCard
          label="Transacciones Totales"
          value={systemStats.totalTransactions}
          icon={<FiCreditCard />}
          color="primary"
          loading={loading}
        />
        <StatCard
          label="Estudiantes Activos"
          value={systemStats.totalStudents}
          icon={<FiUsers />}
          color="info"
          loading={loading}
        />
        <StatCard
          label="DUNAB en Circulación"
          value={formatCurrency(systemStats.dunabInCirculation, false)}
          icon={<BiMoney />}
          color="warning"
          loading={loading}
        />
        <StatCard
          label="Transacciones Hoy"
          value={systemStats.todayTransactions}
          icon={<BsCalendar2Day />}
          color="success"
          loading={loading}
        />
      </div>

      {/* Resumen financiero */}
      <div className="financial-summary">
        <h4><BiMoney /> Resumen Financiero</h4>
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon"><FiTrendingUp /></div>
            <div className="card-content">
              <span className="card-label">Total Ingresos</span>
              <span className="card-value">
                +{formatCurrency(systemStats.totalIncome, false)} DUNAB
              </span>
            </div>
          </div>
          <div className="summary-card expense">
            <div className="card-icon"><FiBarChart2 /></div>
            <div className="card-content">
              <span className="card-label">Total Egresos</span>
              <span className="card-value">
                -{formatCurrency(systemStats.totalExpense, false)} DUNAB
              </span>
            </div>
          </div>
          <div className="summary-card net">
            <div className="card-icon"><BiMoney /></div>
            <div className="card-content">
              <span className="card-label">Balance Neto</span>
              <span className="card-value">
                {formatCurrency(systemStats.totalIncome - systemStats.totalExpense, false)} DUNAB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="recent-activity">
        <h4><FiTrendingUp style={{ verticalAlign: 'middle', marginRight: '8px' }} />Actividad Reciente</h4>
        {transactions && transactions.length > 0 ? (
          <div className="activity-list">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="activity-item">
                <div className="activity-icon">
                  {transaction.tipo?.toLowerCase() === 'ingreso' ||
                   transaction.tipo?.toLowerCase() === 'credito' ? '↑' : '↓'}
                </div>
                <div className="activity-details">
                  <p className="activity-description">
                    {transaction.descripcion || 'Sin descripción'}
                  </p>
                  <span className="activity-meta">
                    ID: {transaction.estudianteId} • {transaction.categoria}
                  </span>
                </div>
                <div className={`activity-amount ${
                  transaction.tipo?.toLowerCase() === 'ingreso' ||
                  transaction.tipo?.toLowerCase() === 'credito' ? 'income' : 'expense'
                }`}>
                  {transaction.tipo?.toLowerCase() === 'ingreso' ||
                   transaction.tipo?.toLowerCase() === 'credito' ? '+' : '-'}
                  {formatCurrency(transaction.monto, false)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="activity-empty">
            <p>No hay actividad reciente</p>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar Transacciones
  const renderTransactions = () => (
    <div className="management-transactions">
      <div className="transactions-header">
        <h3><FiCreditCard /> Gestión de Transacciones</h3>
        <button
          className="btn-create"
          onClick={() => {
            setEditingTransaction(null);
            setShowCreateModal(true);
          }}
        >
          <FiPlus /> Nueva Transacción
        </button>
      </div>

      <TransactionTable
        transactions={transactions}
        loading={loading}
        showActions={true}
        onEdit={handleEdit}
        onDelete={(transaction) => setShowDeleteConfirm(transaction)}
      />
    </div>
  );

  // Renderizar Categorías
  const renderCategories = () => (
    <div className="management-categories">
      <h3><MdCategory /> Gestión de Categorías</h3>
      <CategoryManagement />
    </div>
  );

  // Renderizar Reportes
  const renderReports = () => (
    <div className="management-reports">
      <h3><MdAssessment /> Reportes y Exportación</h3>
      <div className="reports-content">
        <div className="report-card">
          <h4><FiBarChart2 style={{ verticalAlign: 'middle', marginRight: '8px' }} />Reporte de Movimientos DUNAB</h4>
          <p>Genera un reporte detallado de todas las transacciones</p>
          <button className="btn-report">Generar Reporte PDF</button>
        </div>
        <div className="report-card">
          <h4><FiTrendingUp style={{ verticalAlign: 'middle', marginRight: '8px' }} />Reporte de Estadísticas</h4>
          <p>Estadísticas generales del sistema DUNAB</p>
          <button className="btn-report">Generar Reporte Excel</button>
        </div>
        <div className="report-card">
          <h4><FiUsers style={{ verticalAlign: 'middle', marginRight: '8px' }} />Reporte de Estudiantes</h4>
          <p>Lista de estudiantes más activos y sus saldos</p>
          <button className="btn-report">Generar Reporte PDF</button>
        </div>
      </div>
      <div className="reports-placeholder">
        <p><FiAlertTriangle style={{ verticalAlign: 'middle', marginRight: '8px' }} />Funcionalidad de reportes en desarrollo</p>
        <small>Próximamente: Exportación a PDF, Excel y gráficos avanzados</small>
      </div>
    </div>
  );

  return (
    <div className="dunab-management">
      {/* Header */}
      <div className="management-header">
        <div className="header-content">
          <h2><MdDashboard size={28} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Gestión DUNAB</h2>
          <p className="header-subtitle">
            Panel de administración del sistema de moneda virtual
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="management-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido del tab activo */}
      <div className="management-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Modal de crear/editar transacción */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreateTransaction
              mode={editingTransaction ? 'edit' : 'create'}
              initialData={editingTransaction}
              onSuccess={handleCreateSuccess}
              onCancel={() => {
                setShowCreateModal(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <h3><FiAlertTriangle /> Confirmar Anulación</h3>
            <p>¿Estás seguro de que deseas anular esta transacción?</p>
            <div className="transaction-details">
              <p><strong>Descripción:</strong> {showDeleteConfirm.descripcion}</p>
              <p><strong>Monto:</strong> {formatCurrency(showDeleteConfirm.monto)}</p>
              <p><strong>ID:</strong> {showDeleteConfirm.id}</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-delete"
                onClick={handleDeleteConfirm}
              >
                Anular Transacción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DunabManagement;
