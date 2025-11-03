/**
 * Funciones de validación para la aplicación DUNAB
 */

import { TRANSACTION_LIMITS } from './constants';

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {object} { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'El email no es válido' };
  }

  // Validar email institucional UNAB (opcional)
  const unabRegex = /@unab\.edu\.co$/;
  if (!unabRegex.test(email)) {
    return { valid: false, error: 'Debe usar un email institucional (@unab.edu.co)' };
  }

  return { valid: true, error: null };
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'La contraseña es requerida' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'La contraseña debe contener al menos una mayúscula' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'La contraseña debe contener al menos una minúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'La contraseña debe contener al menos un número' };
  }

  return { valid: true, error: null };
};

/**
 * Valida un monto de DUNAB
 * @param {number} amount - Monto a validar
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, error: 'El monto es requerido' };
  }

  const numAmount = Number(amount);

  if (isNaN(numAmount)) {
    return { valid: false, error: 'El monto debe ser un número válido' };
  }

  if (numAmount < TRANSACTION_LIMITS.MIN_AMOUNT) {
    return {
      valid: false,
      error: `El monto mínimo es ${TRANSACTION_LIMITS.MIN_AMOUNT} DUNAB`,
    };
  }

  if (numAmount > TRANSACTION_LIMITS.MAX_AMOUNT) {
    return {
      valid: false,
      error: `El monto máximo es ${TRANSACTION_LIMITS.MAX_AMOUNT} DUNAB`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Valida un campo requerido
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nombre del campo para el mensaje de error
 * @returns {object} { valid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'Este campo') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} es requerido` };
  }
  return { valid: true, error: null };
};

/**
 * Valida un nombre
 * @param {string} name - Nombre a validar
 * @returns {object} { valid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'El nombre es requerido' };
  }

  if (name.length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (name.length > 100) {
    return { valid: false, error: 'El nombre no puede exceder 100 caracteres' };
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'El nombre solo puede contener letras' };
  }

  return { valid: true, error: null };
};

/**
 * Valida un número de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'El teléfono es requerido' };
  }

  const phoneRegex = /^[0-9]{10}$/;
  const cleanedPhone = phone.replace(/\D/g, '');

  if (!phoneRegex.test(cleanedPhone)) {
    return { valid: false, error: 'El teléfono debe tener 10 dígitos' };
  }

  return { valid: true, error: null };
};

/**
 * Valida una fecha
 * @param {string|Date} date - Fecha a validar
 * @param {boolean} futureOnly - Si solo se permiten fechas futuras
 * @returns {object} { valid: boolean, error: string }
 */
export const validateDate = (date, futureOnly = false) => {
  if (!date) {
    return { valid: false, error: 'La fecha es requerida' };
  }

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'La fecha no es válida' };
  }

  if (futureOnly && dateObj < new Date()) {
    return { valid: false, error: 'La fecha debe ser futura' };
  }

  return { valid: true, error: null };
};

/**
 * Valida un código de estudiante
 * @param {string} code - Código de estudiante
 * @returns {object} { valid: boolean, error: string }
 */
export const validateStudentCode = (code) => {
  if (!code) {
    return { valid: false, error: 'El código de estudiante es requerido' };
  }

  // Formato típico: U00000000
  const codeRegex = /^U\d{8}$/;
  if (!codeRegex.test(code)) {
    return { valid: false, error: 'El código debe tener el formato U00000000' };
  }

  return { valid: true, error: null };
};

/**
 * Valida saldo suficiente para una transacción
 * @param {number} balance - Saldo actual
 * @param {number} amount - Monto a gastar
 * @returns {object} { valid: boolean, error: string }
 */
export const validateBalance = (balance, amount) => {
  if (balance < amount) {
    return {
      valid: false,
      error: `Saldo insuficiente. Disponible: ${balance} DUNAB, requerido: ${amount} DUNAB`,
    };
  }

  if (balance - amount < TRANSACTION_LIMITS.MIN_BALANCE) {
    return {
      valid: false,
      error: 'La transacción dejaría su saldo por debajo del mínimo permitido',
    };
  }

  return { valid: true, error: null };
};

/**
 * Valida una descripción
 * @param {string} description - Descripción a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {object} { valid: boolean, error: string }
 */
export const validateDescription = (description, maxLength = 500) => {
  if (!description || description.trim() === '') {
    return { valid: false, error: 'La descripción es requerida' };
  }

  if (description.length > maxLength) {
    return {
      valid: false,
      error: `La descripción no puede exceder ${maxLength} caracteres`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Valida un formulario completo
 * @param {object} formData - Datos del formulario
 * @param {object} validations - Objeto con funciones de validación por campo
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateForm = (formData, validations) => {
  const errors = {};
  let isValid = true;

  Object.keys(validations).forEach((field) => {
    const validation = validations[field](formData[field]);
    if (!validation.valid) {
      errors[field] = validation.error;
      isValid = false;
    }
  });

  return { valid: isValid, errors };
};

/**
 * Alias para validateAmount - Valida un monto de transacción
 * @param {number} amount - Monto a validar
 * @returns {boolean} true si es válido
 */
export const validateTransactionAmount = (amount) => {
  const result = validateAmount(amount);
  return result.valid;
};
