import { createContext, useContext, useState, useEffect } from 'react';
import dunabService from '../services/dunabService';
import { useAuth } from './AuthContext';
import { MAX_RECENT_TRANSACTIONS } from '../utils/constants';

const DunabContext = createContext(null);

export const DunabProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]); // Stack - LIFO
  const [statistics, setStatistics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtener saldo del usuario actual
   */
  const fetchBalance = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await dunabService.getBalance(user.id);
      setBalance(response.balance || 0);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError(err.message || 'Error al obtener el saldo');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener transacciones del usuario (con filtros opcionales)
   */
  const fetchTransactions = async (filters = {}) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      let response;
      if (Object.keys(filters).length > 0) {
        response = await dunabService.filterTransactions(filters);
      } else {
        response = await dunabService.getStudentTransactions(user.id);
      }

      const txData = response.content || response || [];
      setTransactions(txData);

      // Actualizar transacciones recientes usando Stack (LIFO - Last In First Out)
      // Las más recientes al principio
      const recent = txData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, MAX_RECENT_TRANSACTIONS);
      setRecentTransactions(recent);

      return txData;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Error al obtener las transacciones');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener estadísticas del usuario
   */
  const fetchStatistics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const stats = await dunabService.getStudentStatistics(user.id);
      setStatistics(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al obtener las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener categorías de transacciones
   */
  const fetchCategories = async () => {
    try {
      const cats = await dunabService.getCategories();
      setCategories(cats || []);
      return cats;
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  /**
   * Crear una nueva transacción
   */
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);

      const newTransaction = await dunabService.createTransaction(transactionData);

      // Actualizar el balance y las transacciones localmente
      await fetchBalance();
      await fetchTransactions();

      return newTransaction;
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.message || 'Error al crear la transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualizar una transacción existente
   */
  const updateTransaction = async (transactionId, transactionData) => {
    try {
      setLoading(true);
      setError(null);

      const updated = await dunabService.updateTransaction(transactionId, transactionData);

      // Refrescar datos
      await fetchBalance();
      await fetchTransactions();

      return updated;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message || 'Error al actualizar la transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar/anular una transacción
   */
  const deleteTransaction = async (transactionId, reason = '') => {
    try {
      setLoading(true);
      setError(null);

      await dunabService.deleteTransaction(transactionId, reason);

      // Refrescar datos
      await fetchBalance();
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError(err.message || 'Error al eliminar la transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar una transacción al Stack de recientes (LIFO)
   * Se usa cuando se recibe una nueva transacción en tiempo real
   */
  const pushRecentTransaction = (transaction) => {
    setRecentTransactions((prev) => {
      const updated = [transaction, ...prev];
      return updated.slice(0, MAX_RECENT_TRANSACTIONS);
    });
  };

  /**
   * Obtener la transacción más reciente del Stack (LIFO)
   */
  const popRecentTransaction = () => {
    if (recentTransactions.length === 0) return null;

    const [latest, ...rest] = recentTransactions;
    setRecentTransactions(rest);
    return latest;
  };

  /**
   * Limpiar error
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Refrescar todos los datos
   */
  const refreshAll = async () => {
    await Promise.all([
      fetchBalance(),
      fetchTransactions(),
      fetchStatistics(),
      fetchCategories(),
    ]);
  };

  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refreshAll();
    }
  }, [isAuthenticated, user?.id]);

  const value = {
    balance,
    transactions,
    recentTransactions,
    statistics,
    categories,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchStatistics,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    pushRecentTransaction,
    popRecentTransaction,
    clearError,
    refreshAll,
  };

  return <DunabContext.Provider value={value}>{children}</DunabContext.Provider>;
};

export const useDunab = () => {
  const context = useContext(DunabContext);
  if (!context) {
    throw new Error('useDunab must be used within a DunabProvider');
  }
  return context;
};
