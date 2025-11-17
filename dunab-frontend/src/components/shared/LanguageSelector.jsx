import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { setLanguage } from '../../utils/storage';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const newLanguage = e.target.value;
    // Guardar idioma en localStorage
    setLanguage(newLanguage);
    // Cambiar idioma en i18n
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="language-selector">
      <MdLanguage size={18} style={{ marginRight: '4px' }} />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="language-select"
        aria-label="Select Language"
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
