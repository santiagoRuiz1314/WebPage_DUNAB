import {
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdShoppingCart,
  MdFastfood,
  MdDirectionsBus,
  MdSchool,
  MdLocalHospital,
  MdPhone,
  MdHome,
  MdSportsEsports,
  MdTheaterComedy,
  MdCardGiftcard,
  MdShoppingBag,
  MdFitnessCenter,
  MdPets,
  MdBuild,
  MdMoreHoriz,
  MdBarChart,
  MdTrendingUp,
  MdTrendingDown,
  MdCheckCircle,
  MdCancel,
  MdError,
  MdWarning,
  MdInfo,
  MdMenuBook,
  MdCelebration,
  MdCalendarToday,
  MdLocationOn,
  MdPeople,
  MdEmojiEvents,
  MdAccessTime,
  MdDescription,
  MdAssignment,
  MdGrade,
  MdLocalLibrary,
  MdWork,
  MdTrendingFlat,
  MdArrowUpward,
  MdArrowDownward,
  MdSwapHoriz,
  MdAdd,
  MdRemove,
  MdSavings,
  MdAccountBalance,
  MdCreditCard,
  MdReceipt,
  MdPayment,
  MdRestaurant,
  MdLocalCafe,
  MdMovie,
  MdMusicNote,
  MdSportsSoccer,
  MdDirectionsCar,
  MdLocalGasStation,
  MdElectricBolt,
  MdWater,
  MdWifi,
  MdComputer,
  MdSmartphone,
  MdHeadphones,
  MdWatch,
  MdCamera,
  MdLocalLaundryService,
  MdLocalFlorist,
  MdCake,
  MdChildCare,
  MdMedicalServices,
  MdLocalPharmacy,
  MdFlight,
  MdHotel,
  MdBeachAccess,
  MdDiamond
} from 'react-icons/md';

/**
 * Categorías disponibles con sus iconos de React Icons
 * Reemplaza los emojis por componentes de Material Design Icons
 */
export const categoryIcons = {
  // Categorías principales
  compras: MdShoppingCart,
  alimentacion: MdFastfood,
  transporte: MdDirectionsBus,
  educacion: MdSchool,
  salud: MdLocalHospital,
  servicios: MdPhone,
  vivienda: MdHome,
  entretenimiento: MdSportsEsports,
  ocio: MdTheaterComedy,
  regalos: MdCardGiftcard,
  ropa: MdShoppingBag,
  deportes: MdFitnessCenter,
  mascotas: MdPets,
  mantenimiento: MdBuild,
  otros: MdMoreHoriz,

  // Subcategorías de alimentación
  restaurantes: MdRestaurant,
  cafe: MdLocalCafe,
  supermercado: MdShoppingCart,

  // Subcategorías de entretenimiento
  cine: MdMovie,
  musica: MdMusicNote,
  deportes_eventos: MdSportsSoccer,

  // Subcategorías de transporte
  gasolina: MdLocalGasStation,
  auto: MdDirectionsCar,

  // Subcategorías de servicios
  electricidad: MdElectricBolt,
  agua: MdWater,
  internet: MdWifi,

  // Subcategorías de compras
  electronica: MdComputer,
  telefonia: MdSmartphone,
  accesorios: MdHeadphones,

  // Académico
  libros: MdMenuBook,
  material_estudio: MdLocalLibrary,

  // Especiales
  lavanderia: MdLocalLaundryService,
  flores: MdLocalFlorist,
  dulces: MdCake,
  ninos: MdChildCare,
  farmacia: MdLocalPharmacy,
  viajes: MdFlight,
  hotel: MdHotel,
  playa: MdBeachAccess,
  lujo: MdDiamond
};

/**
 * Iconos para tipos de transacciones
 */
export const transactionTypeIcons = {
  ingreso: MdArrowDownward,
  egreso: MdArrowUpward,
  transferencia: MdSwapHoriz,
  gasto: MdRemove,
  deposito: MdAdd,
  retiro: MdRemove,
  pago: MdPayment,
  recibo: MdReceipt
};

/**
 * Iconos para estados
 */
export const statusIcons = {
  completado: MdCheckCircle,
  aprobado: MdCheckCircle,
  pendiente: MdAccessTime,
  rechazado: MdCancel,
  cancelado: MdCancel,
  error: MdError,
  advertencia: MdWarning,
  informacion: MdInfo,
  activo: MdCheckCircle,
  inactivo: MdCancel,
  en_progreso: MdTrendingFlat
};

/**
 * Iconos para estadísticas y métricas
 */
export const statsIcons = {
  dinero: MdAttachMoney,
  billetera: MdAccountBalanceWallet,
  grafico: MdBarChart,
  aumento: MdTrendingUp,
  disminucion: MdTrendingDown,
  ahorro: MdSavings,
  banco: MdAccountBalance,
  tarjeta: MdCreditCard
};

/**
 * Iconos para eventos académicos
 */
export const academicIcons = {
  clase: MdSchool,
  examen: MdAssignment,
  tarea: MdDescription,
  proyecto: MdWork,
  calificacion: MdGrade,
  biblioteca: MdLocalLibrary,
  graduacion: MdEmojiEvents,
  celebracion: MdCelebration
};

/**
 * Iconos para información de eventos
 */
export const eventIcons = {
  calendario: MdCalendarToday,
  ubicacion: MdLocationOn,
  personas: MdPeople,
  premio: MdEmojiEvents,
  regalo: MdCardGiftcard,
  tiempo: MdAccessTime
};

/**
 * Función helper para obtener el icono de categoría
 * @param {string} categoria - Nombre de la categoría
 * @returns {React.Component} Componente de icono de React Icons
 */
export const getCategoryIcon = (categoria) => {
  const key = categoria?.toLowerCase().replace(/\s+/g, '_');
  return categoryIcons[key] || categoryIcons.otros;
};

/**
 * Función helper para obtener el icono de tipo de transacción
 * @param {string} tipo - Tipo de transacción
 * @returns {React.Component} Componente de icono de React Icons
 */
export const getTransactionTypeIcon = (tipo) => {
  const key = tipo?.toLowerCase().replace(/\s+/g, '_');
  return transactionTypeIcons[key] || transactionTypeIcons.transferencia;
};

/**
 * Función helper para obtener el icono de estado
 * @param {string} estado - Estado
 * @returns {React.Component} Componente de icono de React Icons
 */
export const getStatusIcon = (estado) => {
  const key = estado?.toLowerCase().replace(/\s+/g, '_');
  return statusIcons[key] || statusIcons.informacion;
};

/**
 * Array de opciones de categorías para selección en formularios
 */
export const categoryOptions = [
  { value: 'compras', label: 'Compras', icon: MdShoppingCart },
  { value: 'alimentacion', label: 'Alimentación', icon: MdFastfood },
  { value: 'transporte', label: 'Transporte', icon: MdDirectionsBus },
  { value: 'educacion', label: 'Educación', icon: MdSchool },
  { value: 'salud', label: 'Salud', icon: MdLocalHospital },
  { value: 'servicios', label: 'Servicios', icon: MdPhone },
  { value: 'vivienda', label: 'Vivienda', icon: MdHome },
  { value: 'entretenimiento', label: 'Entretenimiento', icon: MdSportsEsports },
  { value: 'ocio', label: 'Ocio', icon: MdTheaterComedy },
  { value: 'regalos', label: 'Regalos', icon: MdCardGiftcard },
  { value: 'ropa', label: 'Ropa', icon: MdShoppingBag },
  { value: 'deportes', label: 'Deportes', icon: MdFitnessCenter },
  { value: 'mascotas', label: 'Mascotas', icon: MdPets },
  { value: 'mantenimiento', label: 'Mantenimiento', icon: MdBuild },
  { value: 'otros', label: 'Otros', icon: MdMoreHoriz }
];

export default {
  categoryIcons,
  transactionTypeIcons,
  statusIcons,
  statsIcons,
  academicIcons,
  eventIcons,
  getCategoryIcon,
  getTransactionTypeIcon,
  getStatusIcon,
  categoryOptions
};
