// TODO: Implementar funciones de validación

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Mínimo 8 caracteres
  return password.length >= 8;
};

export const validateAmount = (amount) => {
  // Verificar que el monto sea positivo
  return amount > 0;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};
