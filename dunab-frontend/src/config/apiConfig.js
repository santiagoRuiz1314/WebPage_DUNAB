// TODO: Configuración de API

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY: '/auth/verify',

  // DUNAB Accounts
  DUNAB_ACCOUNTS: '/dunab/accounts',
  DUNAB_BALANCE: (id) => `/dunab/accounts/${id}/balance`,

  // DUNAB Transactions
  DUNAB_TRANSACTIONS: '/dunab/transactions',
  DUNAB_TRANSACTION: (id) => `/dunab/transactions/${id}`,
  DUNAB_USER_TRANSACTIONS: (userId) => `/dunab/transactions/user/${userId}`,
  DUNAB_MY_TRANSACTIONS: '/dunab/transactions/mis-transacciones',
  DUNAB_MY_TRANSACTIONS_PAGINATED: '/dunab/transactions/mis-transacciones/paginado',
  DUNAB_ACCOUNT_TRANSACTIONS: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}`,
  DUNAB_ACCOUNT_TRANSACTIONS_PAGINATED: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/paginado`,
  DUNAB_ACCOUNT_TRANSACTIONS_RECENT: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/recientes`,
  DUNAB_TRANSACTIONS_FILTER: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/filtrar`,
  DUNAB_TRANSACTIONS_BY_TYPE: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/tipo`,
  DUNAB_TRANSACTIONS_BY_CATEGORY: (categoriaId) => `/dunab/transactions/mis-transacciones/categoria/${categoriaId}`,
  DUNAB_TRANSACTION_CANCEL: (id) => `/dunab/transactions/${id}/anular`,
  DUNAB_TRANSACTION_TOTAL_BY_TYPE: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/total`,
  DUNAB_TRANSACTION_COUNT: (cuentaId) => `/dunab/transactions/cuenta/${cuentaId}/count`,
  DUNAB_MONTHLY_SUMMARY: '/dunab/transactions/resumen-mensual',

  // DUNAB Statistics
  DUNAB_STATISTICS: '/dunab/transactions/estadisticas',
  DUNAB_STACK_STATS: '/dunab/transactions/stack/stats',
  DUNAB_STUDENT_STATISTICS: (id) => `/dunab/statistics/${id}`,
  DUNAB_REPORTS: '/dunab/reports',
  DUNAB_RANKING: '/dunab/ranking',

  // DUNAB Categories
  DUNAB_CATEGORIES: '/dunab/categories',
  DUNAB_CATEGORY: (id) => `/dunab/categories/${id}`,

  // Students
  STUDENTS: '/students',
  STUDENT: (id) => `/students/${id}`,
  STUDENT_PROGRESS: (id) => `/students/${id}/progress`,
  UPDATE_PROFILE: (id) => `/students/${id}`,

  // Events
  EVENTS: '/events',
  EVENT: (id) => `/events/${id}`,
  EVENT_REGISTER: (id) => `/events/${id}/register`,
  EVENT_CONFIRM: (id) => `/events/${id}/confirm`,

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION: (id) => `/notifications/${id}`,
  NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
};
