import { createContext, useContext, useState, useEffect } from 'react';
import dunabService from '../services/dunabService';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import studentService from '../services/studentService';
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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guards para evitar llamadas simultáneas
  const loadingRef = useState({
    transactions: false,
    categories: false,
    statistics: false,
    balance: false
  })[0];

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
  const fetchTransactions = async (page = 0, size = 100) => {
    if (!user?.id) return;

    // Guard: evitar llamadas simultáneas
    if (loadingRef.transactions) {
      console.log('⚠️ fetchTransactions ya está en progreso, ignorando llamada duplicada');
      return;
    }

    try {
      loadingRef.transactions = true;
      setLoading(true);
      setError(null);

      // Usar el nuevo servicio de transacciones
      const response = await transactionService.getMyTransactions(page, size);
      const txData = response.data || response.content || response || [];
      setTransactions(txData);

      // Actualizar transacciones recientes usando Stack (LIFO - Last In First Out)
      // Las más recientes al principio
      const recent = txData
        .sort((a, b) => new Date(b.fechaCreacion || b.date) - new Date(a.fechaCreacion || a.date))
        .slice(0, MAX_RECENT_TRANSACTIONS);
      setRecentTransactions(recent);

      return txData;
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Error al obtener las transacciones');
      return [];
    } finally {
      setLoading(false);
      loadingRef.transactions = false;
    }
  };

  /**
   * Obtener estadísticas del usuario
   */
  const fetchStatistics = async () => {
    if (!user?.id) return;

    // Guard: evitar llamadas simultáneas
    if (loadingRef.statistics) {
      console.log('⚠️ fetchStatistics ya está en progreso, ignorando llamada duplicada');
      return;
    }

    try {
      loadingRef.statistics = true;
      setLoading(true);
      setError(null);
      // Usar el nuevo endpoint de estadísticas de transacciones
      const stats = await transactionService.getStatistics();
      setStatistics(stats);
      return stats;
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Error al obtener las estadísticas');
    } finally {
      setLoading(false);
      loadingRef.statistics = false;
    }
  };

  /**
   * Obtener categorías de transacciones
   */
  const fetchCategories = async () => {
    // Guard: evitar llamadas simultáneas
    if (loadingRef.categories) {
      console.log('⚠️ fetchCategories ya está en progreso, ignorando llamada duplicada');
      return;
    }

    try {
      loadingRef.categories = true;
      const response = await dunabService.getCategories();
      console.log('🔍 Raw categories response:', response);
      // El backend devuelve ApiResponse {success, data}
      const cats = response.data || response || [];
      console.log('🔍 Extracted categories:', cats);
      console.log('🔍 Is array?', Array.isArray(cats));
      setCategories(cats);
      return cats;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]); // Asegurar que siempre sea un array
    } finally {
      loadingRef.categories = false;
    }
  };

  /**
   * Crear una nueva transacción
   */
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);

      // Usar el nuevo servicio de transacciones
      const newTransaction = await transactionService.createTransaction(transactionData);

      // Actualizar el balance y las transacciones localmente
      await fetchBalance();
      await fetchTransactions();
      await fetchStatistics();

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
  const deleteTransaction = async (transactionId, justificacion = 'Anulación solicitada por el usuario') => {
    try {
      setLoading(true);
      setError(null);

      // Usar el nuevo servicio de transacciones con el método correcto
      await transactionService.cancelTransaction(transactionId, justificacion);

      // Refrescar datos
      await fetchBalance();
      await fetchTransactions();
      await fetchStatistics();
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
   * Cargar lista de estudiantes (para admin)
   */
  const loadStudents = async (page = 0, size = 50) => {
    try {
      const response = await studentService.getAllStudents(page, size);
      const studentList = response.content || response || [];
      setStudents(studentList);
      return studentList;
    } catch (err) {
      console.error('Error loading students:', err);
      return [];
    }
  };

  /**
   * Alias para compatibilidad - loadCategories
   */
  const loadCategories = fetchCategories;

  /**
   * Crear nueva categoría
   */
  const createCategory = async (categoryData) => {
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      await fetchCategories(); // Refrescar lista
      return newCategory;
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  /**
   * Actualizar categoría existente
   */
  const updateCategory = async (categoryId, categoryData) => {
    try {
      const updated = await categoryService.updateCategory(categoryId, categoryData);
      await fetchCategories(); // Refrescar lista
      return updated;
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  /**
   * Eliminar categoría
   */
  const deleteCategory = async (categoryId) => {
    try {
      await categoryService.deleteCategory(categoryId);
      await fetchCategories(); // Refrescar lista
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  /**
   * Obtener transacciones con paginación
   */
  const fetchTransactionsPaginated = async (page = 0, size = 10, sort = 'fechaCreacion,desc') => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getMyTransactionsPaginated(page, size, sort);
      return response;
    } catch (err) {
      console.error('Error fetching paginated transactions:', err);
      setError(err.message || 'Error al obtener las transacciones');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtener resumen mensual
   */
  const getMonthlySummary = async (mes = null, anio = null) => {
    try {
      const response = await transactionService.getMonthlySummary(mes, anio);
      return response;
    } catch (err) {
      console.error('Error fetching monthly summary:', err);
      throw err;
    }
  };

  /**
   * Filtrar transacciones por categoría
   */
  const getTransactionsByCategory = async (categoriaId) => {
    try {
      const response = await transactionService.getByCategory(categoriaId);
      return response;
    } catch (err) {
      console.error('Error fetching transactions by category:', err);
      throw err;
    }
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

  // Los datos se cargan bajo demanda cuando los componentes los necesitan
  // No cargamos automáticamente para evitar bucles infinitos
  // useEffect(() => {
  //   if (isAuthenticated && user?.id) {
  //     refreshAll();
  //   }
  // }, [isAuthenticated, user?.id]);

  const value = {
    balance,
    transactions,
    recentTransactions,
    statistics,
    categories,
    students,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    fetchTransactionsPaginated,
    fetchStatistics,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    pushRecentTransaction,
    popRecentTransaction,
    getMonthlySummary,
    getTransactionsByCategory,
    clearError,
    refreshAll,
    // Funciones de estudiantes
    loadStudents,
    // Funciones de categorías
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
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
