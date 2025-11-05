/**
 * ESTRUCTURA DE DATOS: Stack (Pila)
 * JUSTIFICACIÓN: Historial de transacciones recientes (Last In, First Out)
 *
 * Esta implementación cumple con los requisitos académicos del proyecto DUNAB
 * para demostrar conocimientos en estructuras de datos avanzadas.
 *
 * OPERACIONES PRINCIPALES:
 * - push(transaction): O(1) - Agregar al tope de la pila
 * - pop(): O(1) - Remover del tope de la pila
 * - peek(): O(1) - Ver el elemento del tope sin removerlo
 *
 * USO EN EL SISTEMA:
 * - Mostrar historial reciente de transacciones
 * - Implementar funcionalidad "undo" si se requiere
 * - Acceso rápido a las transacciones más recientes
 */

export class TransactionStack {
  /**
   * Constructor de la pila de transacciones
   * @param {number} maxSize - Tamaño máximo de la pila (default: 10)
   */
  constructor(maxSize = 10) {
    this.items = [];
    this.maxSize = maxSize;
  }

  /**
   * Agregar transacción al tope de la pila (push)
   * Complejidad: O(1)
   * @param {Object} transaction - Objeto de transacción
   * @returns {boolean} - True si se agregó exitosamente
   */
  push(transaction) {
    // Si la pila está llena, remover la más antigua (del fondo)
    if (this.items.length >= this.maxSize) {
      // Eliminar del fondo (la más antigua)
      this.items.pop();
    }

    // Agregar al tope de la pila (inicio del array)
    this.items.unshift({
      ...transaction,
      id: transaction.id || Date.now() + Math.random(),
      timestamp: transaction.timestamp || new Date().toISOString(),
      pushedAt: new Date().toISOString()
    });

    return true;
  }

  /**
   * Remover y retornar la transacción del tope (pop)
   * Complejidad: O(1)
   * @returns {Object|null} La transacción más reciente o null si está vacía
   */
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    // Remover del tope (LIFO - Last In, First Out)
    return this.items.shift();
  }

  /**
   * Ver la transacción del tope sin removerla (peek)
   * Complejidad: O(1)
   * @returns {Object|null} La transacción más reciente o null
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /**
   * Verificar si la pila está vacía
   * Complejidad: O(1)
   * @returns {boolean}
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Obtener tamaño actual de la pila
   * Complejidad: O(1)
   * @returns {number}
   */
  size() {
    return this.items.length;
  }

  /**
   * Obtener todas las transacciones sin modificar la pila
   * Complejidad: O(n)
   * @returns {Array} Copia de todas las transacciones
   */
  getAll() {
    return [...this.items]; // Retornar copia para inmutabilidad
  }

  /**
   * Obtener las N transacciones más recientes del tope
   * Complejidad: O(n) donde n es el límite
   * @param {number} limit - Cantidad de transacciones (default: 5)
   * @returns {Array} Últimas N transacciones
   */
  getRecent(limit = 5) {
    // Las más recientes están al inicio del array (tope de la pila)
    return this.items.slice(0, Math.min(limit, this.items.length));
  }

  /**
   * Limpiar todas las transacciones
   * Complejidad: O(1)
   */
  clear() {
    this.items = [];
  }

  /**
   * Verificar si la pila está llena
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
   * Buscar transacción por ID
   * Complejidad: O(n)
   * @param {number|string} id - ID de la transacción
   * @returns {Object|null} Transacción encontrada o null
   */
  findById(id) {
    return this.items.find(t => t.id === id) || null;
  }

  /**
   * Filtrar transacciones por tipo (INGRESO/EGRESO)
   * Complejidad: O(n)
   * @param {string} type - Tipo de transacción
   * @returns {Array} Transacciones del tipo especificado
   */
  filterByType(type) {
    return this.items.filter(t => t.tipo === type);
  }

  /**
   * Filtrar transacciones por categoría
   * Complejidad: O(n)
   * @param {string} categoria - Categoría de transacción
   * @returns {Array} Transacciones de la categoría especificada
   */
  filterByCategory(categoria) {
    return this.items.filter(t => t.categoria === categoria);
  }

  /**
   * Calcular monto total de transacciones en la pila
   * Complejidad: O(n)
   * @returns {number} Suma total de montos
   */
  getTotalAmount() {
    return this.items.reduce((total, transaction) => {
      const amount = parseFloat(transaction.monto || 0);
      // Sumar ingresos, restar egresos
      return transaction.tipo === 'INGRESO'
        ? total + amount
        : total - amount;
    }, 0);
  }

  /**
   * Obtener estadísticas de transacciones
   * Complejidad: O(n)
   * @returns {Object} Objeto con estadísticas
   */
  getStatistics() {
    if (this.isEmpty()) {
      return {
        totalIngresos: 0,
        totalEgresos: 0,
        countIngresos: 0,
        countEgresos: 0,
        promedioIngreso: 0,
        promedioEgreso: 0
      };
    }

    let totalIngresos = 0;
    let totalEgresos = 0;
    let countIngresos = 0;
    let countEgresos = 0;

    this.items.forEach(transaction => {
      const amount = parseFloat(transaction.monto || 0);
      if (transaction.tipo === 'INGRESO') {
        totalIngresos += amount;
        countIngresos++;
      } else if (transaction.tipo === 'EGRESO') {
        totalEgresos += amount;
        countEgresos++;
      }
    });

    return {
      totalIngresos,
      totalEgresos,
      countIngresos,
      countEgresos,
      promedioIngreso: countIngresos > 0 ? totalIngresos / countIngresos : 0,
      promedioEgreso: countEgresos > 0 ? totalEgresos / countEgresos : 0
    };
  }

  /**
   * Convertir la pila a JSON (útil para persistencia)
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
   * Cargar pila desde JSON
   * Complejidad: O(n)
   * @param {string} jsonString - JSON string de la pila
   */
  fromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.items = data.items || [];
      this.maxSize = data.maxSize || 10;
    } catch (error) {
      console.error('Error parsing TransactionStack JSON:', error);
    }
  }

  /**
   * Obtener representación visual de la pila (para debugging)
   * Complejidad: O(n)
   * @returns {string}
   */
  toString() {
    if (this.isEmpty()) {
      return 'Stack vacío';
    }

    let output = '\n╔══════════════════════════════╗\n';
    output += '║   TRANSACTION STACK (LIFO)   ║\n';
    output += '╠══════════════════════════════╣\n';

    this.items.forEach((transaction, index) => {
      const marker = index === 0 ? '← TOP' : '';
      output += `║ ${index}. ${transaction.tipo} - ${transaction.monto} DUNAB ${marker}\n`;
    });

    output += '╚══════════════════════════════╝\n';
    output += `Size: ${this.size()}/${this.maxSize}\n`;

    return output;
  }

  /**
   * Remover transacción específica por ID (sin seguir LIFO)
   * NOTA: Esto rompe la naturaleza LIFO, usar con precaución
   * Complejidad: O(n)
   * @param {number|string} id - ID de la transacción
   * @returns {boolean} True si se encontró y eliminó
   */
  removeById(id) {
    const index = this.items.findIndex(t => t.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Tipos de transacciones
export const TransactionTypes = {
  INGRESO: 'INGRESO',
  EGRESO: 'EGRESO'
};

// Categorías de transacciones
export const TransactionCategories = {
  // Ingresos
  MATERIA_COMPLETADA: 'MATERIA_COMPLETADA',
  ASISTENCIA_EVENTO: 'ASISTENCIA_EVENTO',
  PROYECTO_GRADO: 'PROYECTO_GRADO',
  REFERIDO: 'REFERIDO',
  BONO: 'BONO',
  AJUSTE_MANUAL: 'AJUSTE_MANUAL',

  // Egresos
  EVENTO_PREMIUM: 'EVENTO_PREMIUM',
  SERVICIO: 'SERVICIO',
  CANJE: 'CANJE',
  OTROS: 'OTROS'
};

// Factory para crear transacciones con formato consistente
export const createTransaction = (tipo, monto, categoria, descripcion = '', data = {}) => {
  return {
    tipo,
    monto: parseFloat(monto),
    categoria,
    descripcion,
    ...data,
    timestamp: new Date().toISOString(),
    estado: 'COMPLETADA'
  };
};

export default TransactionStack;
