import { useState, useMemo, useEffect } from 'react';

/**
 * Hook personalizado para manejar la paginación de datos
 *
 * @param {Array} items - Array de datos a paginar
 * @param {number} itemsPerPage - Cantidad de items por página
 * @returns {object} Objeto con estado y funciones de paginación
 *
 * @example
 * const { currentPage, totalPages, currentItems, goToPage, nextPage, previousPage } = usePagination(data, 10);
 */
const usePagination = (items = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return Math.ceil(items.length / itemsPerPage);
  }, [items, itemsPerPage]);

  // Obtener items de la página actual
  const currentItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  // Ir a una página específica
  const goToPage = (pageNumber) => {
    const pageNum = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(pageNum);
  };

  // Ir a la siguiente página
  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Ir a la página anterior
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Verificar si se puede ir a la siguiente página
  const canGoNext = currentPage < totalPages;

  // Verificar si se puede ir a la página anterior
  const canGoPrevious = currentPage > 1;

  // Resetear a la primera página cuando cambian los items
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  };
};

export default usePagination;
