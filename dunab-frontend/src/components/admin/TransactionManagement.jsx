import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getAllTransactions,
  createTransactionAdmin,
  updateTransaction,
  cancelTransaction,
} from '../../services/adminService';
import { getAllCategories } from '../../services/categoryService';
import DataTable from '../shared/DataTable';
import DunabAmount from '../shared/DunabAmount';
import LoadingSpinner from '../shared/LoadingSpinner';
import './TransactionManagement.css';

const TransactionManagement = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'INCOME',
    amount: '',
    category: '',
    description: '',
    reference: '',
  });

  // Cargar transacciones cuando cambian los filtros
  useEffect(() => {
    loadTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Cargar categorías solo una vez
  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions(filters);
      setTransactions(data.content || data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      alert(t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
      await createTransactionAdmin({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      alert(t('transactions.transactionCreated'));
      setShowCreateModal(false);
      resetForm();
      loadTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(t('errors.serverError'));
    }
  };

  const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction(selectedTransaction.id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      alert(t('transactions.transactionUpdated'));
      setShowEditModal(false);
      resetForm();
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert(t('errors.serverError'));
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    const reason = prompt(t('transactions.confirmDelete'));
    if (reason) {
      try {
        await cancelTransaction(transactionId, reason);
        alert(t('transactions.transactionDeleted'));
        loadTransactions();
      } catch (error) {
        console.error('Error cancelling transaction:', error);
        alert(t('errors.serverError'));
      }
    }
  };

  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      studentId: transaction.studentId || '',
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category?.id || '',
      description: transaction.description,
      reference: transaction.reference || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      type: 'INCOME',
      amount: '',
      category: '',
      description: '',
      reference: '',
    });
    setSelectedTransaction(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="transaction-management">
      <div className="management-header">
        <h2>{t('admin.manageTransactions')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + {t('transactions.create')}
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">{t('transactions.allTypes')}</option>
          <option value="INCOME">{t('dunab.income')}</option>
          <option value="EXPENSE">{t('dunab.expense')}</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">{t('transactions.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">{t('transactions.allStatuses')}</option>
          <option value="COMPLETED">{t('transactions.completed')}</option>
          <option value="PENDING">{t('transactions.pending')}</option>
          <option value="CANCELLED">{t('transactions.cancelled')}</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="filter-input"
          placeholder={t('transactions.from')}
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="filter-input"
          placeholder={t('transactions.to')}
        />

        <button
          className="btn btn-secondary"
          onClick={() => setFilters({ type: '', category: '', status: '', startDate: '', endDate: '' })}
        >
          {t('common.clear')}
        </button>
      </div>

      {/* Transactions Table */}
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('transactions.date')}</th>
              <th>{t('transactions.type')}</th>
              <th>{t('transactions.amount')}</th>
              <th>{t('transactions.category')}</th>
              <th>{t('transactions.description')}</th>
              <th>{t('transactions.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {t('transactions.noTransactions')}
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>#{transaction.id}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${transaction.type.toLowerCase()}`}>
                      {t(`dunab.${transaction.type.toLowerCase()}`)}
                    </span>
                  </td>
                  <td>
                    <DunabAmount
                      amount={transaction.amount}
                      type={transaction.type}
                    />
                  </td>
                  <td>{transaction.category?.name || '-'}</td>
                  <td className="description-cell">{transaction.description}</td>
                  <td>
                    <span className={`status-badge status-${transaction.status.toLowerCase()}`}>
                      {t(`transactions.${transaction.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => openEditModal(transaction)}
                      title={t('common.edit')}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleCancelTransaction(transaction.id)}
                      title={t('common.delete')}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('transactions.createTransaction')}</h3>
            <form onSubmit={handleCreateTransaction}>
              <div className="form-group">
                <label>{t('transactions.studentId')}</label>
                <input
                  type="number"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('transactions.type')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="INCOME">{t('dunab.income')}</option>
                  <option value="EXPENSE">{t('dunab.expense')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('transactions.amount')}</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('transactions.category')}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('transactions.selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('transactions.description')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>{t('transactions.reference')}</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {t('common.save')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('common.edit')} {t('transactions.title')}</h3>
            <form onSubmit={handleUpdateTransaction}>
              <div className="form-group">
                <label>{t('transactions.type')}</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="INCOME">{t('dunab.income')}</option>
                  <option value="EXPENSE">{t('dunab.expense')}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('transactions.amount')}</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('transactions.category')}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('transactions.selectCategory')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('transactions.description')}</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {t('common.save')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
