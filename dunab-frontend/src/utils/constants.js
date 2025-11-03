/**
 * Constantes de la aplicación DUNAB
 * Sistema de Gestión de Dinero UNAB
 */

// Tipos de transacciones
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

// Estados de transacciones
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Roles de usuario
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  COORDINATOR: 'COORDINATOR',
};

// Recompensas de DUNAB
export const DUNAB_REWARDS = {
  COURSE_COMPLETION: 100, // DUNAB por crédito
  EVENT_ATTENDANCE: 50, // DUNAB base por evento
  THESIS_PROJECT: 500, // DUNAB por proyecto de grado
  REFERRAL: 100, // DUNAB por referir estudiante
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  DUNAB_RECEIVED: 'DUNAB_RECEIVED',
  DUNAB_SPENT: 'DUNAB_SPENT',
  EVENT_REMINDER: 'EVENT_REMINDER',
  ACHIEVEMENT: 'ACHIEVEMENT',
  SYSTEM: 'SYSTEM',
};

// Temas de la aplicación
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Idiomas disponibles
export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
};

// Categorías de transacciones (predefinidas)
export const TRANSACTION_CATEGORIES = {
  ACADEMIC: 'ACADEMIC',
  EVENT: 'EVENT',
  SERVICE: 'SERVICE',
  REWARD: 'REWARD',
  PURCHASE: 'PURCHASE',
  OTHER: 'OTHER',
};

// Estados de cuenta DUNAB
export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
};

// Estados de eventos
export const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Estados de inscripción a eventos
export const REGISTRATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ATTENDED: 'ATTENDED',
  CANCELLED: 'CANCELLED',
};

// Límites de transacciones
export const TRANSACTION_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 10000,
  MIN_BALANCE: 0,
};

// Keys para localStorage
export const STORAGE_KEYS = {
  TOKEN: 'dunab_token',
  REFRESH_TOKEN: 'dunab_refresh_token',
  USER: 'dunab_user',
  THEME: 'dunab_theme',
  LANGUAGE: 'dunab_language',
};

// Tiempo de expiración
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 3600000, // 1 hora en ms
  REFRESH_TOKEN: 604800000, // 7 días en ms
};

// Configuración de debounce
export const DEBOUNCE_DELAY = 300; // ms

// Número máximo de transacciones recientes (Stack - LIFO)
export const MAX_RECENT_TRANSACTIONS = 5;

// Número máximo de notificaciones en cola (Queue - FIFO)
export const MAX_NOTIFICATIONS = 50;

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, intente de nuevo.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicie sesión.',
  FORBIDDEN: 'No tiene permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intente más tarde.',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente para realizar esta transacción.',
  INVALID_AMOUNT: 'Monto inválido.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: 'Transacción creada exitosamente.',
  TRANSACTION_UPDATED: 'Transacción actualizada exitosamente.',
  TRANSACTION_DELETED: 'Transacción eliminada exitosamente.',
  EVENT_REGISTERED: 'Inscripción exitosa al evento.',
  PROFILE_UPDATED: 'Perfil actualizado exitosamente.',
};

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  PROFILE: '/profile',
  TRANSACTIONS: '/transactions',
  EVENTS: '/events',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
};
