// TODO: Definir constantes de la aplicación

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
};

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  COORDINATOR: 'COORDINATOR',
};

export const DUNAB_REWARDS = {
  COURSE_COMPLETION: 100, // DUNAB por crédito
  EVENT_ATTENDANCE: 50, // DUNAB base por evento
  THESIS_PROJECT: 500, // DUNAB por proyecto de grado
  REFERRAL: 100, // DUNAB por referir estudiante
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

export const NOTIFICATION_TYPES = {
  DUNAB_RECEIVED: 'DUNAB_RECEIVED',
  DUNAB_SPENT: 'DUNAB_SPENT',
  EVENT_REMINDER: 'EVENT_REMINDER',
  ACHIEVEMENT: 'ACHIEVEMENT',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
};
