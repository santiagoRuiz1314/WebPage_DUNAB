/**
 * ThemeContext - Gestión del tema de la aplicación (claro/oscuro)
 * Persiste la preferencia del usuario en localStorage
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getTheme, setTheme as saveTheme } from '../utils/storage';
import { THEMES } from '../utils/constants';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Cargar tema guardado o usar 'light' por defecto
  const [theme, setTheme] = useState(() => getTheme() || THEMES.LIGHT);

  // Aplicar el tema al cargar
  useEffect(() => {
    const savedTheme = getTheme() || THEMES.LIGHT;
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  /**
   * Aplica el tema al documento
   * @param {string} themeName - Nombre del tema ('light' o 'dark')
   */
  const applyTheme = (themeName) => {
    // Establecer atributo en el elemento raíz para CSS
    document.documentElement.setAttribute('data-theme', themeName);

    // También agregar clase para compatibilidad
    document.documentElement.classList.remove(THEMES.LIGHT, THEMES.DARK);
    document.documentElement.classList.add(themeName);

    // Actualizar meta theme-color para navegadores móviles
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        themeName === THEMES.DARK ? '#1a1a1a' : '#ffffff'
      );
    }
  };

  /**
   * Alterna entre tema claro y oscuro
   */
  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  /**
   * Establece un tema específico
   * @param {string} newTheme - 'light' o 'dark'
   */
  const setSpecificTheme = (newTheme) => {
    if (newTheme !== THEMES.LIGHT && newTheme !== THEMES.DARK) {
      console.error('Invalid theme:', newTheme);
      return;
    }
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: setSpecificTheme,
    toggleTheme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook para usar el contexto de tema
 * @returns {object} Contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
