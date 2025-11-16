import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
    </button>
  );
};

export default ThemeToggle;
