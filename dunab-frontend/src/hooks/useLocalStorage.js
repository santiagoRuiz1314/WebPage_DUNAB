import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar el almacenamiento en localStorage
 * Sincroniza el estado de React con localStorage
 *
 * @param {string} key - Clave en localStorage
 * @param {any} initialValue - Valor inicial si no existe en localStorage
 * @returns {[any, Function, Function]} [valor, setValue, removeValue]
 *
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
 *
 * // Cambiar tema
 * setTheme('dark');
 *
 * // O usando una función
 * setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
 *
 * // Eliminar del localStorage
 * removeTheme();
 */
const useLocalStorage = (key, initialValue) => {
  // Estado para almacenar el valor
  // Pasa una función al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Obtener el item de localStorage por su key
      const item = window.localStorage.getItem(key);
      // Parsear el JSON almacenado o retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Guarda el valor en localStorage y actualiza el estado
   * @param {any} value - Valor a guardar (puede ser un valor o una función)
   */
  const setValue = useCallback(
    (value) => {
      try {
        // Permite que value sea una función como setState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Guardar estado
        setStoredValue(valueToStore);

        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Elimina el valor de localStorage y resetea al valor inicial
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincronizar con cambios en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    // Escuchar cambios en el storage
    window.addEventListener('storage', handleStorageChange);

    // Limpiar el event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
