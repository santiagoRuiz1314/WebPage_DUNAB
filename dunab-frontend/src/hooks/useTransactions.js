/**
 * Custom hook para gestión de transacciones DUNAB
 */

import { useState, useEffect, useCallback } from 'react';
import dunabService from '../services/dunabService';

export const useTransactions = (studentId = null, initialFilters = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });

  // Cargar transacciones
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        ...filters,
        page: pagination.currentPage,
        size: pagination.pageSize,
      };

      let data;
      if (studentId) {
        // Cargar transacciones de un estudiante específico
        data = await dunabService.getUserTransactions(studentId, params.page, params.size);
      } else {
        // Cargar todas las transacciones
        data = await dunabService.getAllTransactions(params.page, params.size);
      }

      setTransactions(data.content || data);

      if (data.totalPages !== undefined) {
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.message || 'Error loading transactions');
    } finally {
      setLoading(false);
    }
  }, [studentId, filters, pagination.currentPage, pagination.pageSize]);

  // Recargar transacciones cuando cambian los filtros
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Actualizar filtros
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 0 })); // Reset página
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
  };

  // Cambiar página
  const changePage = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Cambiar tamaño de página
  const changePageSize = (size) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 0 }));
  };

  // Refrescar transacciones
  const refresh = () => {
    loadTransactions();
  };

  return {
    transactions,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    refresh,
  };
};

export default useTransactions;
