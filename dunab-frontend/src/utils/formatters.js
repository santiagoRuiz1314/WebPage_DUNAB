/**
 * Funciones de formateo para la aplicación DUNAB
 */

/**
 * Formatea un monto de DUNAB con separadores de miles
 * @param {number} amount - Monto a formatear
 * @param {boolean} showSymbol - Si se debe mostrar el símbolo DUNAB
 * @returns {string} Monto formateado
 */
export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined) return showSymbol ? '0 DUNAB' : '0';

  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return showSymbol ? `${formatted} DUNAB` : formatted;
};

/**
 * Formatea una fecha en formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Idioma para el formateo
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, locale = 'es-CO') => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha y hora en formato local
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Idioma para el formateo
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date, locale = 'es-CO') => {
  if (!date) return '-';

  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDateShort = (date) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formatea una hora en formato 12 horas
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Hora formateada
 */
export const formatTime = (date) => {
  if (!date) return '-';

  return new Date(date).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza la primera letra de un texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Formatea un tipo de transacción para mostrar
 * @param {string} type - Tipo de transacción (INCOME, EXPENSE)
 * @returns {string} Tipo formateado
 */
export const formatTransactionType = (type) => {
  const types = {
    INCOME: 'Ingreso',
    EXPENSE: 'Egreso',
  };
  return types[type] || type;
};

/**
 * Formatea un estado de transacción para mostrar
 * @param {string} status - Estado de transacción
 * @returns {string} Estado formateado
 */
export const formatTransactionStatus = (status) => {
  const statuses = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
    CANCELLED: 'Cancelado',
  };
  return statuses[status] || status;
};

/**
 * Formatea un rol de usuario para mostrar
 * @param {string} role - Rol del usuario
 * @returns {string} Rol formateado
 */
export const formatUserRole = (role) => {
  const roles = {
    STUDENT: 'Estudiante',
    ADMIN: 'Administrador',
    COORDINATOR: 'Coordinador',
  };
  return roles[role] || role;
};

/**
 * Formatea una categoría de transacción
 * @param {string} category - Categoría de transacción
 * @returns {string} Categoría formateada
 */
export const formatCategory = (category) => {
  const categories = {
    ACADEMIC: 'Académico',
    EVENT: 'Evento',
    SERVICE: 'Servicio',
    REWARD: 'Recompensa',
    PURCHASE: 'Compra',
    OTHER: 'Otro',
  };
  return categories[category] || category;
};

/**
 * Calcula el tiempo relativo desde una fecha (ej: "hace 2 horas")
 * @param {string|Date} date - Fecha a comparar
 * @returns {string} Tiempo relativo
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return 'Hace un momento';
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;

  return formatDate(date);
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor decimal (0-1)
 * @param {number} decimals - Número de decimales
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Alias para getRelativeTime - Para compatibilidad con NotificationItem
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Tiempo relativo formateado
 */
export const formatRelativeTime = (date) => {
  return getRelativeTime(date);
};
