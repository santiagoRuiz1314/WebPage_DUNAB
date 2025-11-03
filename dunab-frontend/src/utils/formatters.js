// TODO: Implementar funciones de formateo

export const formatCurrency = (amount) => {
  // Formatear monto de DUNAB
  return `${amount} DUNAB`;
};

export const formatDate = (date) => {
  // Formatear fecha
  return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
  // Formatear fecha y hora
  return new Date(date).toLocaleString();
};

export const truncateText = (text, maxLength = 50) => {
  // Truncar texto
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};
