/**
 * Funciones de almacenamiento local (localStorage) para la aplicación DUNAB
 */

import { STORAGE_KEYS } from './constants';

/**
 * Guarda un valor en localStorage
 * @param {string} key - Clave del item
 * @param {any} value - Valor a guardar
 * @returns {boolean} true si se guardó exitosamente
 */
export const setItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Obtiene un valor de localStorage
 * @param {string} key - Clave del item
 * @param {any} defaultValue - Valor por defecto si no existe
 * @returns {any} Valor del item o defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Elimina un item de localStorage
 * @param {string} key - Clave del item
 * @returns {boolean} true si se eliminó exitosamente
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

/**
 * Limpia todo el localStorage
 * @returns {boolean} true si se limpió exitosamente
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Verifica si un item existe en localStorage
 * @param {string} key - Clave del item
 * @returns {boolean} true si existe
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

/**
 * Obtiene el tamaño utilizado de localStorage en bytes
 * @returns {number} Tamaño en bytes
 */
export const getSize = () => {
  let size = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage[key].length + key.length;
    }
  }
  return size;
};

// Funciones específicas para la aplicación DUNAB

/**
 * Guarda el token de autenticación
 * @param {string} token - Token JWT
 * @returns {boolean} true si se guardó exitosamente
 */
export const setAuthToken = (token) => {
  return setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token o null
 */
export const getAuthToken = () => {
  return getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Elimina el token de autenticación
 * @returns {boolean} true si se eliminó exitosamente
 */
export const removeAuthToken = () => {
  return removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Guarda el refresh token
 * @param {string} token - Refresh token
 * @returns {boolean} true si se guardó exitosamente
 */
export const setRefreshToken = (token) => {
  return setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

/**
 * Obtiene el refresh token
 * @returns {string|null} Refresh token o null
 */
export const getRefreshToken = () => {
  return getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Elimina el refresh token
 * @returns {boolean} true si se eliminó exitosamente
 */
export const removeRefreshToken = () => {
  return removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Guarda los datos del usuario
 * @param {object} user - Datos del usuario
 * @returns {boolean} true si se guardó exitosamente
 */
export const setUser = (user) => {
  return setItem(STORAGE_KEYS.USER, user);
};

/**
 * Obtiene los datos del usuario
 * @returns {object|null} Usuario o null
 */
export const getUser = () => {
  return getItem(STORAGE_KEYS.USER);
};

/**
 * Elimina los datos del usuario
 * @returns {boolean} true si se eliminó exitosamente
 */
export const removeUser = () => {
  return removeItem(STORAGE_KEYS.USER);
};

/**
 * Guarda el tema seleccionado
 * @param {string} theme - Tema ('light' o 'dark')
 * @returns {boolean} true si se guardó exitosamente
 */
export const setTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Obtiene el tema seleccionado
 * @returns {string} Tema ('light' o 'dark')
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'light');
};

/**
 * Guarda el idioma seleccionado
 * @param {string} language - Idioma ('es' o 'en')
 * @returns {boolean} true si se guardó exitosamente
 */
export const setLanguage = (language) => {
  return setItem(STORAGE_KEYS.LANGUAGE, language);
};

/**
 * Obtiene el idioma seleccionado
 * @returns {string} Idioma ('es' o 'en')
 */
export const getLanguage = () => {
  return getItem(STORAGE_KEYS.LANGUAGE, 'es');
};

/**
 * Limpia todos los datos de sesión (logout)
 * @returns {boolean} true si se limpió exitosamente
 */
export const clearSession = () => {
  try {
    removeAuthToken();
    removeRefreshToken();
    removeUser();
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean} true si hay sesión activa
 */
export const hasActiveSession = () => {
  return hasItem(STORAGE_KEYS.TOKEN) && hasItem(STORAGE_KEYS.USER);
};

// Alias para compatibilidad con AuthContext
export const getToken = getAuthToken;
export const saveToken = setAuthToken;
export const removeToken = removeAuthToken;
export const saveUser = setUser;
export { getUser, removeUser };
