import { useState, useMemo } from 'react';
import { PAGINATION } from '../utils/constants';

/**
 * Hook personalizado para manejar la paginación de datos
 *
 * @param {number} initialPage - Página inicial (default: 0)
 * @param {number} initialPageSize - Tamaño de página inicial (default: 10)
 * @returns {object} Objeto con estado y funciones de paginación
 *
 * @example
 * const { page, pageSize, handlePageChange, handlePageSizeChange, getPaginatedData, totalPages } = usePagination();
 *
 * const paginatedTransactions = getPaginatedData(transactions);
 */
const usePagination = (
  initialPage = 0,
  initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE
) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  /**
   * Cambia a una nueva página
   * @param {number} newPage - Número de página
   */
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  /**
   * Cambia el tamaño de página y resetea a la primera página
   * @param {number} newPageSize - Nuevo tamaño de página
   */
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to first page
  };

  /**
   * Avanza a la siguiente página
   */
  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  /**
   * Retrocede a la página anterior
   */
  const prevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  /**
   * Ir a la primera página
   */
  const firstPage = () => {
    setPage(0);
  };

  /**
   * Ir a la última página
   * @param {number} total - Total de items
   */
  const lastPage = (total) => {
    const totalPages = Math.ceil(total / pageSize);
    setPage(Math.max(0, totalPages - 1));
  };

  /**
   * Resetea la paginación a los valores iniciales
   */
  const reset = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  /**
   * Obtiene los datos paginados de un array
   * @param {Array} data - Array de datos
   * @returns {Array} Datos paginados
   */
  const getPaginatedData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    const start = page * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  /**
   * Calcula el número total de páginas
   * @param {number} total - Total de items
   * @returns {number} Número total de páginas
   */
  const getTotalPages = (total) => {
    return Math.ceil(total / pageSize);
  };

  /**
   * Verifica si hay página siguiente
   * @param {number} total - Total de items
   * @returns {boolean}
   */
  const hasNextPage = (total) => {
    return page < getTotalPages(total) - 1;
  };

  /**
   * Verifica si hay página anterior
   * @returns {boolean}
   */
  const hasPrevPage = () => {
    return page > 0;
  };

  return {
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    reset,
    getPaginatedData,
    getTotalPages,
    hasNextPage,
    hasPrevPage,
  };
};

export default usePagination;
