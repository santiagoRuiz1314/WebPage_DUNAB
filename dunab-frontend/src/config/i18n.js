/**
 * Configuración de i18next para internacionalización
 * Soporta español (es) e inglés (en)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from '../locales/es/translation.json';
import enTranslation from '../locales/en/translation.json';
import { getLanguage, setLanguage } from '../utils/storage';

// Recursos de traducción
const resources = {
  es: {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

// Obtener idioma guardado o usar español por defecto
const savedLanguage = getLanguage();

i18n
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    lng: savedLanguage || 'es', // Idioma inicial
    fallbackLng: 'es', // Idioma de respaldo
    debug: import.meta.env.DEV, // Debug solo en desarrollo

    interpolation: {
      escapeValue: false, // React ya hace el escape
    },

    // Configuración adicional
    react: {
      useSuspense: false, // Evita problemas con SSR
    },

    // Namespace por defecto
    defaultNS: 'translation',
  });

// Sincronizar cambios de idioma con localStorage
i18n.on('languageChanged', (lng) => {
  setLanguage(lng);
  // Actualizar el atributo lang del documento HTML para accesibilidad
  document.documentElement.lang = lng;
});

// Establecer el idioma inicial en el documento HTML
document.documentElement.lang = savedLanguage || 'es';

export default i18n;
