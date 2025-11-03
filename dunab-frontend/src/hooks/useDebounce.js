import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '../utils/constants';

/**
 * Hook personalizado para aplicar debounce a un valor
 * Útil para optimizar búsquedas y reducir llamadas a la API
 *
 * @param {any} value - Valor a aplicar debounce
 * @param {number} delay - Tiempo de espera en ms (default: 300ms)
 * @returns {any} Valor con debounce aplicado
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchTransactions(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
const useDebounce = (value, delay = DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Crear un timeout que actualiza el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes del delay
    // o si el componente se desmonta
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
