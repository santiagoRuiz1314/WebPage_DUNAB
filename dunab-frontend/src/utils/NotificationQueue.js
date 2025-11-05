/**
 * ESTRUCTURA DE DATOS: Queue (Cola)
 * JUSTIFICACIÓN: Notificaciones en orden de llegada (First In, First Out)
 *
 * Esta implementación cumple con los requisitos académicos del proyecto DUNAB
 * para demostrar conocimientos en estructuras de datos avanzadas.
 *
 * OPERACIONES PRINCIPALES:
 * - enqueue(notification): O(1) - Agregar al final de la cola
 * - dequeue(): O(1) - Remover del inicio de la cola
 * - peek(): O(1) - Ver el siguiente elemento sin removerlo
 *
 * USO EN EL SISTEMA:
 * - Gestión de notificaciones en tiempo real
 * - Procesamiento secuencial de mensajes del sistema
 * - Mantener orden cronológico de eventos
 */

export class NotificationQueue {
  /**
   * Constructor de la cola de notificaciones
   * @param {number} maxSize - Tamaño máximo de la cola (default: 50)
   */
  constructor(maxSize = 50) {
    this.items = [];
    this.maxSize = maxSize;
  }

  /**
   * Agregar notificación al final de la cola (enqueue)
   * Complejidad: O(1)
   * @param {Object} notification - Objeto de notificación
   * @returns {boolean} - True si se agregó exitosamente
   */
  enqueue(notification) {
    // Si la cola está llena, remover la más antigua (FIFO)
    if (this.items.length >= this.maxSize) {
      this.dequeue();
    }

    // Agregar al final de la cola con metadatos
    this.items.push({
      ...notification,
      id: notification.id || Date.now() + Math.random(),
      timestamp: notification.timestamp || new Date().toISOString(),
      read: notification.read || false,
      type: notification.type || 'INFO'
    });

    return true;
  }

  /**
   * Remover y retornar la notificación más antigua (dequeue)
   * Complejidad: O(1) amortizado (usando shift optimizado)
   * @returns {Object|null} La notificación más antigua o null si está vacía
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    // Remover del inicio (FIFO - First In, First Out)
    return this.items.shift();
  }

  /**
   * Ver la siguiente notificación sin removerla (peek)
   * Complejidad: O(1)
   * @returns {Object|null} La próxima notificación o null
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /**
   * Verificar si la cola está vacía
   * Complejidad: O(1)
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Obtener tamaño actual de la cola
   * Complejidad: O(1)
   * @returns {number}
   */
  size() {
    return this.items.length;
  }

  /**
   * Obtener todas las notificaciones sin modificar la cola
   * Complejidad: O(n)
   * @returns {Array} Copia de todas las notificaciones
   */
  getAll() {
    return [...this.items]; // Retornar copia para inmutabilidad
  }

  /**
   * Obtener solo notificaciones no leídas
   * Complejidad: O(n)
   * @returns {Array} Array de notificaciones no leídas
   */
  getUnread() {
    return this.items.filter(n => !n.read);
  }

  /**
   * Contar notificaciones no leídas
   * Complejidad: O(n)
   * @returns {number} Cantidad de notificaciones no leídas
   */
  countUnread() {
    return this.getUnread().length;
  }

  /**
   * Marcar notificación como leída por ID
   * Complejidad: O(n)
   * @param {number|string} id - ID de la notificación
   * @returns {boolean} True si se encontró y marcó
   */
  markAsRead(id) {
    const notification = this.items.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  /**
   * Marcar todas las notificaciones como leídas
   * Complejidad: O(n)
   */
  markAllAsRead() {
    this.items.forEach(n => n.read = true);
  }

  /**
   * Remover notificación específica por ID
   * Complejidad: O(n)
   * @param {number|string} id - ID de la notificación
   * @returns {boolean} True si se encontró y eliminó
   */
  remove(id) {
    const index = this.items.findIndex(n => n.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Limpiar todas las notificaciones
   * Complejidad: O(1)
   */
  clear() {
    this.items = [];
  }

  /**
   * Filtrar notificaciones por tipo
   * Complejidad: O(n)
   * @param {string} type - Tipo de notificación
   * @returns {Array} Notificaciones del tipo especificado
   */
  filterByType(type) {
    return this.items.filter(n => n.type === type);
  }

  /**
   * Obtener notificaciones más recientes (últimas N)
   * Complejidad: O(1) para slice
   * @param {number} count - Cantidad de notificaciones
   * @returns {Array} Últimas N notificaciones
   */
  getRecent(count = 5) {
    // Las más recientes están al final de la cola
    return this.items.slice(-count).reverse();
  }

  /**
   * Verificar si la cola está llena
   * Complejidad: O(1)
   * @returns {boolean}
   */
  isFull() {
    return this.items.length >= this.maxSize;
  }

  /**
   * Obtener capacidad restante
   * Complejidad: O(1)
   * @returns {number}
   */
  getRemainingCapacity() {
    return this.maxSize - this.items.length;
  }

  /**
   * Convertir la cola a JSON (útil para persistencia)
   * Complejidad: O(n)
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify({
      items: this.items,
      maxSize: this.maxSize,
      size: this.size()
    });
  }

  /**
   * Cargar cola desde JSON
   * Complejidad: O(n)
   * @param {string} jsonString - JSON string de la cola
   */
  fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.items = data.items || [];
      this.maxSize = data.maxSize || 50;
    } catch (error) {
      console.error('Error parsing NotificationQueue JSON:', error);
    }
  }
}

// Tipos de notificaciones del sistema DUNAB
export const NotificationTypes = {
  DUNAB_RECEIVED: 'DUNAB_RECEIVED',
  DUNAB_SPENT: 'DUNAB_SPENT',
  EVENT_REMINDER: 'EVENT_REMINDER',
  EVENT_REGISTERED: 'EVENT_REGISTERED',
  EVENT_CANCELLED: 'EVENT_CANCELLED',
  BALANCE_LOW: 'BALANCE_LOW',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

// Factory para crear notificaciones con formato consistente
export const createNotification = (type, message, data = {}) => {
  return {
    type,
    message,
    ...data,
    timestamp: new Date().toISOString()
  };
};

export default NotificationQueue;
