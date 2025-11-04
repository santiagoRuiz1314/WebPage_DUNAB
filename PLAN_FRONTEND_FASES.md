# 🎯 PLAN DE DESARROLLO FRONTEND - DUNAB
## Planeación Paso a Paso para Finalizar el Frontend

**Fecha de análisis:** Noviembre 2025
**Estado actual:** Fase 2 completada (95%)
**Objetivo:** Frontend estable y sólido, listo para producción

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ LO QUE YA TIENES COMPLETADO

#### **Fase 1-2: Fundamentos y Autenticación** ✅ 100%
- ✅ Autenticación completa (Login, Register)
- ✅ AuthContext con JWT management
- ✅ Layout completo (Header, Sidebar, Footer)
- ✅ Protected Routes con role-based access
- ✅ Theme (dark/light mode)
- ✅ i18n (ES/EN)
- ✅ Routing configurado
- ✅ Servicios API configurados (esperando backend)

#### **Páginas Principales** ⚠️ Parcialmente Implementadas
- ✅ Dashboard.jsx (estructura completa - 115 líneas)
- ✅ Transactions.jsx (funcional completo - 313 líneas)
- ✅ Events.jsx (estructura básica - 61 líneas)
- ⚠️ Profile.jsx (esqueleto - 26 líneas)
- ⚠️ AdminPanel.jsx (esqueleto - 25 líneas)

#### **Componentes Core** ⚠️ Muchos Incompletos
**DUNAB Components:** 11 componentes
- ✅ DunabWallet.jsx (66 líneas - implementado)
- ✅ DunabBalance.jsx (28 líneas - básico)
- ⚠️ BalanceCard.jsx (14 líneas - esqueleto)
- ⚠️ QuickStats.jsx (14 líneas - esqueleto)
- ⚠️ RecentTransactions.jsx (necesita Stack LIFO)
- ⚠️ TransactionHistory.jsx (14 líneas - esqueleto)
- ⚠️ TransactionTable.jsx (básico)
- ⚠️ CreateTransaction.jsx (formulario)
- ⚠️ DunabManagement.jsx (14 líneas - esqueleto)
- ⚠️ CategoryManagement.jsx (14 líneas - esqueleto)
- ⚠️ FilterBar.jsx (básico)

**Dashboard Components:** 3 componentes
- ⚠️ StatisticsWidget.jsx (necesita implementar)
- ⚠️ BalanceChart.jsx (necesita gráfico)
- ⚠️ UpcomingEvents.jsx (necesita implementar)

**Events Components:** 4 componentes
- ⚠️ EventsCatalog.jsx (necesita lógica de filtrado)
- ⚠️ EventCard.jsx (necesita completar)
- ⚠️ EventDetail.jsx (necesita implementar)
- ⚠️ EventRegistration.jsx (necesita pago DUNAB)

**Academic Components:** 3 componentes
- ⚠️ AcademicProgress.jsx (esqueleto)
- ⚠️ CourseList.jsx (16 líneas - esqueleto)
- ⚠️ GraduationPath.jsx (14 líneas - esqueleto)

**Notifications Components:** 3 componentes
- ⚠️ NotificationBell.jsx (necesita Queue FIFO)
- ⚠️ NotificationCenter.jsx (necesita Queue FIFO)
- ⚠️ NotificationItem.jsx (básico)

**Shared Components:** 7 componentes
- ⚠️ DataTable.jsx (23 líneas - necesita paginación)
- ✅ LoadingSpinner.jsx (18 líneas - completo)
- ⚠️ ThemeToggle.jsx (19 líneas - básico)
- ⚠️ LanguageSelector.jsx (26 líneas - básico)
- ⚠️ DunabAmount.jsx (13 líneas - básico)
- ⚠️ StatCard.jsx (15 líneas - esqueleto)
- ⚠️ TransactionCard.jsx (necesita completar)

---

## 🚀 FASES DE DESARROLLO PARA COMPLETAR

### **FASE 3: Completar Componentes DUNAB Core** 🎯 PRIORIDAD CRÍTICA
**Duración estimada:** 3-4 días
**Objetivo:** Sistema DUNAB funcional completo con datos mock

#### 3.1 Componentes de Visualización (Día 1)
**Archivos a completar:**

1. **BalanceCard.jsx** ⚠️ CRÍTICO
   - Mostrar saldo actual con diseño atractivo
   - Indicador visual de cambios (↑↓)
   - Animación de contador
   - Gradiente dorado/azul DUNAB
   ```javascript
   // Funcionalidades requeridas:
   - Formateo de monto con separadores
   - Icono de moneda DUNAB
   - Variación % desde último mes
   - Tooltip con información adicional
   ```

2. **QuickStats.jsx** ⚠️ CRÍTICO
   - 3-4 tarjetas de estadísticas rápidas
   - Total ganado, total gastado, promedio mensual
   - Icons y colores por tipo
   ```javascript
   // Stats a mostrar:
   - Total Ganado (verde)
   - Total Gastado (rojo)
   - Transacciones Este Mes (azul)
   - Promedio por Transacción (dorado)
   ```

3. **StatCard.jsx** ⚠️ CRÍTICO
   - Componente reutilizable para estadísticas
   - Props: label, value, icon, color, trend
   - Responsive y animado
   ```javascript
   // Props interface:
   {
     label: string,
     value: number | string,
     icon: ReactNode,
     color: 'primary' | 'success' | 'danger' | 'warning',
     trend?: { value: number, direction: 'up' | 'down' }
   }
   ```

#### 3.2 Componentes de Transacciones (Día 2)
**Archivos a completar:**

4. **RecentTransactions.jsx** ⚠️ CRÍTICO - **Stack (LIFO)**
   ```javascript
   // ESTRUCTURA DE DATOS: Stack (Pila)
   // JUSTIFICACIÓN: Mostrar últimas transacciones (Last In, First Out)

   class TransactionStack {
     constructor(maxSize = 10) {
       this.items = [];
       this.maxSize = maxSize;
     }

     push(transaction) {
       // Agregar al tope
       this.items.unshift(transaction);
       if (this.items.length > this.maxSize) {
         this.items.pop(); // Eliminar la más antigua
       }
     }

     getRecent(limit = 5) {
       // Obtener las N más recientes (del tope)
       return this.items.slice(0, limit);
     }

     peek() {
       // Ver la más reciente sin remover
       return this.items[0];
     }
   }

   // Implementación en componente:
   - Usar Stack para mantener últimas 10 transacciones
   - Mostrar las 5 más recientes por defecto
   - Animación al agregar nueva transacción
   - Link "Ver todas" → /transactions
   ```

5. **TransactionHistory.jsx** ⚠️ IMPORTANTE
   - Historial completo con scroll infinito
   - Agrupación por fecha (Hoy, Ayer, Esta semana, etc.)
   - Lazy loading de transacciones
   ```javascript
   // Funcionalidades:
   - Infinite scroll (react-infinite-scroll-component)
   - Agrupación por fecha
   - Skeleton loading
   - Empty state
   ```

6. **TransactionTable.jsx** ⚠️ IMPORTANTE
   - Tabla completa con todas las columnas
   - Paginación funcional
   - Ordenamiento por columnas
   - Acciones (Edit, Delete solo admin)
   ```javascript
   // Columnas:
   - ID
   - Fecha
   - Tipo (badge)
   - Monto (formatted)
   - Categoría
   - Descripción
   - Estado
   - Acciones (si isAdmin)
   ```

7. **TransactionCard.jsx** ⚠️ IMPORTANTE
   - Vista de tarjeta para mobile/grid
   - Información condensada pero completa
   - Icons por tipo y categoría
   ```javascript
   // Layout:
   - Header: Tipo + Fecha
   - Body: Monto grande + Categoría
   - Footer: Descripción + Estado
   - Actions: Edit/Delete (admin)
   ```

#### 3.3 Componentes de Gestión (Día 3)
**Archivos a completar:**

8. **CreateTransaction.jsx** ⚠️ CRÍTICO (Admin)
   ```javascript
   // Formulario completo con:
   - Select de estudiante (buscar por código)
   - Select de tipo (Ingreso/Egreso)
   - Input de monto (solo números positivos)
   - Select de categoría
   - Textarea descripción
   - Input referencia (opcional)
   - Validaciones en tiempo real
   - Preview del saldo después de la transacción

   // Validaciones:
   - Monto > 0
   - Si es débito: verificar saldo suficiente
   - Descripción mínimo 10 caracteres
   - Categoría requerida
   ```

9. **FilterBar.jsx** ⚠️ IMPORTANTE
   ```javascript
   // Filtros disponibles:
   - Búsqueda de texto (debounced)
   - Select tipo (Todos, Ingreso, Egreso)
   - Select categoría (multiselect)
   - Select estado (Todos, Completada, Anulada)
   - Date range picker (desde/hasta)
   - Botón "Limpiar filtros"
   - Contador de resultados

   // Features:
   - useDebounce para búsqueda
   - URL params para filtros (shareable)
   - Preset filters: "Hoy", "Esta semana", "Este mes"
   ```

10. **DunabManagement.jsx** ⚠️ IMPORTANTE (Admin)
    ```javascript
    // Panel de gestión completo:
    - Tabs: Transacciones | Categorías | Estadísticas | Reportes
    - Gráfico de transacciones por día/semana/mes
    - Top estudiantes por saldo
    - Actividad reciente del sistema
    - Export a PDF/Excel
    ```

11. **CategoryManagement.jsx** ⚠️ MEDIA (Admin)
    ```javascript
    // CRUD de categorías:
    - Lista de categorías con icon y color
    - Crear nueva categoría (modal)
    - Editar categoría existente
    - Eliminar categoría (con confirmación)
    - No permitir eliminar si hay transacciones asociadas
    ```

#### 3.4 Estilos CSS (Día 4)
**Archivos a crear/completar:**

- `components/dunab/DunabWallet.css`
- `components/dunab/BalanceCard.css`
- `components/dunab/TransactionHistory.css`
- `components/dunab/TransactionTable.css`
- `components/dunab/CreateTransaction.css`
- `components/dunab/FilterBar.css`
- `components/dunab/DunabManagement.css`

**Temas a considerar:**
- Colores DUNAB (dorado #FFD700, azul #1E3A8A)
- Animaciones suaves (transitions)
- Responsive breakpoints
- Modo oscuro completo

---

### **FASE 4: Dashboard Completo con Visualizaciones** 📊
**Duración estimada:** 2-3 días
**Objetivo:** Dashboard funcional con gráficos y widgets

#### 4.1 Componentes de Dashboard (Día 5-6)

12. **StatisticsWidget.jsx** ⚠️ CRÍTICO
    ```javascript
    // Grid de 4 estadísticas principales:
    - Saldo Actual (grande, destacado)
    - Total Ganado Este Mes
    - Total Gastado Este Mes
    - Transacciones Totales

    // Features:
    - Animación de números (countup)
    - Comparación con mes anterior (%)
    - Icons animados
    - Click para más detalles
    ```

13. **BalanceChart.jsx** ⚠️ CRÍTICO
    ```javascript
    // Gráfico de balance histórico
    // LIBRERÍA: recharts

    npm install recharts

    // Tipos de gráficos:
    - Line chart: Balance en los últimos 30 días
    - Bar chart: Ingresos vs Egresos por semana
    - Toggle entre gráficos
    - Tooltips con detalles
    - Responsive
    - Export como imagen

    // Datos mock:
    const mockBalanceHistory = [
      { date: '2025-01-01', balance: 100, income: 50, expense: 0 },
      { date: '2025-01-02', balance: 150, income: 50, expense: 0 },
      // ... últimos 30 días
    ];
    ```

14. **UpcomingEvents.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Lista de próximos eventos (3-5)
    - Card por evento con:
      * Nombre
      * Fecha (relativa: "En 2 días")
      * Recompensa DUNAB (destacada)
      * Costo DUNAB (si aplica)
      * Botón "Ver detalles" / "Inscribirse"

    // Features:
    - Filtrar solo eventos futuros
    - Ordenar por fecha más próxima
    - Badge: "Gratis" o "Premium"
    - Countdown timer si es muy próximo
    ```

#### 4.2 Estilos Dashboard (Día 6)
- `components/dashboard/StatisticsWidget.css`
- `components/dashboard/BalanceChart.css`
- `components/dashboard/UpcomingEvents.css`
- `pages/Dashboard.css` (mejorar grid y layout)

---

### **FASE 5: Sistema de Eventos Completo** 🎉
**Duración estimada:** 2-3 días
**Objetivo:** CRUD de eventos con inscripción y pago DUNAB

#### 5.1 Componentes de Eventos (Día 7-8)

15. **EventsCatalog.jsx** ⚠️ CRÍTICO
    ```javascript
    // Catálogo completo de eventos
    // NOTA: El filtrado debe delegarse al BACKEND

    // UI Features:
    - Búsqueda de texto
    - Filtros:
      * Categoría (Académico, Cultural, Deportivo, Social)
      * Tipo (Gratis/Pagado)
      * Fecha (Próximos, Este mes, Todos)
    - Ordenamiento:
      * Fecha (ASC/DESC)
      * Recompensa (mayor/menor)
      * Nombre (A-Z)
    - Grid/List view toggle
    - Paginación (12 por página)

    // Backend delegation:
    const fetchEvents = async (filters) => {
      const params = {
        categoria: filters.categoria,
        gratuito: filters.soloGratuitos,
        search: filters.searchTerm,
        sortBy: filters.sortBy,
        order: filters.order,
        page: filters.page,
        size: 12
      };

      // Backend hace el filtrado y retorna datos paginados
      const data = await eventService.getAllEvents(params);
      return data;
    };
    ```

16. **EventCard.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Tarjeta de evento para grid/list
    - Image placeholder o URL
    - Categoría (badge con color)
    - Nombre del evento
    - Fecha (formateada y relativa)
    - Descripción corta (truncada)
    - Costo DUNAB (si aplica) vs "Gratis"
    - Recompensa DUNAB (destacada en dorado)
    - Cupos disponibles (si quedan pocos: alerta)
    - Botón "Ver detalles"
    - Estado: "Inscrito" (si aplica)

    // Responsive:
    - Desktop: 3 columnas
    - Tablet: 2 columnas
    - Mobile: 1 columna
    ```

17. **EventDetail.jsx** ⚠️ CRÍTICO
    ```javascript
    // Modal/Página de detalle completo
    - Imagen grande
    - Nombre y categoría
    - Fecha completa (día, hora, duración)
    - Ubicación
    - Descripción completa (markdown?)
    - Organizador
    - Costo DUNAB / Gratis
    - Recompensa por asistencia
    - Cupos: "X de Y disponibles"
    - Requisitos (si aplica)

    // Acciones:
    - Botón "Inscribirse ahora"
    - Botón "Cancelar inscripción" (si ya inscrito)
    - Botón "Agregar a calendario"
    - Botón "Compartir"

    // Validaciones:
    - Verificar saldo suficiente si es pagado
    - Verificar cupos disponibles
    - Verificar si ya está inscrito
    - Mostrar preview de saldo después del pago
    ```

18. **EventRegistration.jsx** ⚠️ CRÍTICO
    ```javascript
    // Componente de inscripción con pago DUNAB
    // RESPONSABILIDAD: Solo UI y confirmación
    // LÓGICA DE PAGO: Backend

    // Flujo:
    1. Mostrar resumen del evento
    2. Mostrar costo (si aplica)
    3. Mostrar saldo actual del estudiante
    4. Preview: "Tu saldo después: X DUNAB"
    5. Checkbox: "Confirmo que asistiré"
    6. Botón "Confirmar inscripción"

    // Backend maneja:
    - Verificar saldo suficiente
    - Verificar cupos disponibles
    - Crear inscripción
    - Debitar DUNAB (transacción atómica)
    - Crear notificación
    - Retornar confirmación

    // Frontend:
    const handleRegister = async () => {
      try {
        setLoading(true);

        // Backend hace todo el trabajo
        const response = await eventService.registerToEvent(eventId, {
          studentId: user.id
        });

        // Backend retorna:
        // {
        //   success: true,
        //   message: "Inscripción exitosa",
        //   inscripcionId: 123,
        //   dunabDebitado: 50,
        //   saldoNuevo: 450
        // }

        showSuccessMessage(response.message);
        updateUserBalance(response.saldoNuevo);
        onSuccess();

      } catch (error) {
        showErrorMessage(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    // Estados posibles:
    - Loading: Procesando inscripción
    - Success: Inscrito correctamente
    - Error: Saldo insuficiente / Cupos agotados / Ya inscrito
    ```

#### 5.2 Estilos Eventos (Día 9)
- `components/events/EventsCatalog.css`
- `components/events/EventCard.css`
- `components/events/EventDetail.css`
- `components/events/EventRegistration.css`
- `pages/Events.css`

---

### **FASE 6: Sistema de Notificaciones con Queue (FIFO)** 🔔
**Duración estimada:** 1-2 días
**Objetivo:** Sistema de notificaciones en tiempo real con estructura Queue

#### 6.1 Implementación de Queue (Día 10)

19. **NotificationQueue.js** ⚠️ CRÍTICO - **Estructura de Datos**
    ```javascript
    // ESTRUCTURA DE DATOS: Queue (Cola)
    // JUSTIFICACIÓN: Notificaciones en orden de llegada (First In, First Out)

    // src/utils/NotificationQueue.js

    export class NotificationQueue {
      constructor() {
        this.items = [];
        this.maxSize = 50; // Máximo de notificaciones en memoria
      }

      /**
       * Agregar notificación al final de la cola (enqueue)
       * @param {Object} notification - Objeto de notificación
       */
      enqueue(notification) {
        if (this.items.length >= this.maxSize) {
          this.dequeue(); // Eliminar la más antigua si está lleno
        }
        this.items.push({
          ...notification,
          id: notification.id || Date.now(),
          timestamp: notification.timestamp || new Date().toISOString(),
          read: notification.read || false
        });
      }

      /**
       * Remover y retornar la notificación más antigua (dequeue)
       * @returns {Object|null} La notificación más antigua o null
       */
      dequeue() {
        if (this.isEmpty()) {
          return null;
        }
        return this.items.shift(); // Remover del inicio (FIFO)
      }

      /**
       * Ver la siguiente notificación sin removerla (peek)
       * @returns {Object|null}
       */
      peek() {
        if (this.isEmpty()) {
          return null;
        }
        return this.items[0];
      }

      /**
       * Verificar si la cola está vacía
       * @returns {boolean}
       */
      isEmpty() {
        return this.items.length === 0;
      }

      /**
       * Obtener tamaño de la cola
       * @returns {number}
       */
      size() {
        return this.items.length;
      }

      /**
       * Obtener todas las notificaciones
       * @returns {Array}
       */
      getAll() {
        return [...this.items]; // Retornar copia
      }

      /**
       * Obtener solo notificaciones no leídas
       * @returns {Array}
       */
      getUnread() {
        return this.items.filter(n => !n.read);
      }

      /**
       * Marcar notificación como leída
       * @param {number|string} id - ID de la notificación
       */
      markAsRead(id) {
        const notification = this.items.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
      }

      /**
       * Marcar todas como leídas
       */
      markAllAsRead() {
        this.items.forEach(n => n.read = true);
      }

      /**
       * Remover notificación específica
       * @param {number|string} id - ID de la notificación
       */
      remove(id) {
        const index = this.items.findIndex(n => n.id === id);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }

      /**
       * Limpiar todas las notificaciones
       */
      clear() {
        this.items = [];
      }
    }
    ```

20. **NotificationContext.jsx** ⚠️ CRÍTICO - Actualizar
    ```javascript
    // Integrar NotificationQueue en el Context

    import { NotificationQueue } from '../utils/NotificationQueue';

    export const NotificationProvider = ({ children }) => {
      const [queue] = useState(() => new NotificationQueue());
      const [notifications, setNotifications] = useState([]);
      const [unreadCount, setUnreadCount] = useState(0);

      // Agregar notificación
      const addNotification = useCallback((notification) => {
        queue.enqueue(notification);
        setNotifications(queue.getAll());
        setUnreadCount(queue.getUnread().length);

        // Auto-remove después de 10 segundos si es temporal
        if (notification.temporary) {
          setTimeout(() => {
            removeNotification(notification.id);
          }, 10000);
        }
      }, [queue]);

      // Marcar como leída
      const markAsRead = useCallback((id) => {
        queue.markAsRead(id);
        setNotifications(queue.getAll());
        setUnreadCount(queue.getUnread().length);
      }, [queue]);

      // Marcar todas como leídas
      const markAllAsRead = useCallback(() => {
        queue.markAllAsRead();
        setNotifications(queue.getAll());
        setUnreadCount(0);
      }, [queue]);

      // Remover notificación
      const removeNotification = useCallback((id) => {
        queue.remove(id);
        setNotifications(queue.getAll());
        setUnreadCount(queue.getUnread().length);
      }, [queue]);

      // Limpiar todas
      const clearAll = useCallback(() => {
        queue.clear();
        setNotifications([]);
        setUnreadCount(0);
      }, [queue]);

      // Polling de notificaciones del backend (cada 30 segundos)
      useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const newNotifications = await notificationService.getNotifications();
            newNotifications.forEach(n => addNotification(n));
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        };

        const interval = setInterval(fetchNotifications, 30000);
        fetchNotifications(); // Fetch inicial

        return () => clearInterval(interval);
      }, [addNotification]);

      return (
        <NotificationContext.Provider
          value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll
          }}
        >
          {children}
        </NotificationContext.Provider>
      );
    };
    ```

21. **NotificationBell.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Campana de notificaciones en Header
    - Badge con contador de no leídas
    - Animación cuando llega nueva notificación
    - Click para abrir NotificationCenter
    - Sonido opcional
    ```

22. **NotificationCenter.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Panel deslizable de notificaciones
    - Lista de notificaciones (más recientes arriba)
    - Agrupación por fecha (Hoy, Ayer, Anteriores)
    - Botón "Marcar todas como leídas"
    - Botón "Limpiar todas"
    - Empty state: "No tienes notificaciones"
    - Infinite scroll si hay muchas
    ```

23. **NotificationItem.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Item individual de notificación
    - Icon según tipo (💰 DUNAB, 🎉 Evento, ℹ️ Info, ⚠️ Warning)
    - Título y mensaje
    - Timestamp relativo ("Hace 2 minutos")
    - Estado: leída/no leída (bold si no leída)
    - Botón "X" para eliminar
    - Click para marcar como leída y navegar
    ```

#### 6.2 Tipos de Notificaciones
```javascript
// Tipos de notificaciones a implementar:

1. DUNAB_RECEIVED:
   "Has recibido 100 DUNAB por completar Estructuras de Datos"

2. DUNAB_SPENT:
   "Se han debitado 50 DUNAB por inscripción a Conferencia de IA"

3. EVENT_REMINDER:
   "Recordatorio: Conferencia de IA mañana a las 10:00 AM"

4. EVENT_REGISTERED:
   "Te has inscrito exitosamente al evento: Hackathon 2025"

5. EVENT_CANCELLED:
   "El evento 'Workshop React' ha sido cancelado. Se reembolsarán 30 DUNAB"

6. BALANCE_LOW:
   "Tu saldo DUNAB es bajo: 25 DUNAB restantes"

7. ACHIEVEMENT_UNLOCKED:
   "¡Logro desbloqueado! Has ganado 50 DUNAB de bonus"

8. TRANSACTION_FAILED:
   "Error en transacción: Saldo insuficiente"
```

#### 6.3 Estilos Notificaciones (Día 11)
- `components/notifications/NotificationBell.css`
- `components/notifications/NotificationCenter.css`
- `components/notifications/NotificationItem.css`

---

### **FASE 7: Módulo Académico** 🎓
**Duración estimada:** 2 días
**Objetivo:** Seguimiento de progreso académico

#### 7.1 Componentes Académicos (Día 12-13)

24. **AcademicProgress.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Widget de progreso académico
    - Progress bar: Créditos completados / Total requeridos
    - Porcentaje de avance hacia graduación
    - Materias completadas este semestre
    - Próxima materia a cursar
    - Recompensa DUNAB estimada por completar materias pendientes

    // Datos a mostrar:
    {
      creditosCompletados: 120,
      creditosRequeridos: 150,
      materiasCompletadas: 40,
      materiasRequeridas: 50,
      porcentajeAvance: 80,
      proximaMateria: "Proyecto de Grado"
    }
    ```

25. **CourseList.jsx** ⚠️ MEDIA
    ```javascript
    // Lista de materias con estado
    - Materias completadas (✓ verde)
    - Materias en curso (⏳ amarillo)
    - Materias pendientes (⭕ gris)
    - Créditos por materia
    - Recompensa DUNAB por materia
    - Prerequisitos
    ```

26. **GraduationPath.jsx** ⚠️ MEDIA
    ```javascript
    // Camino visual hacia graduación
    - Timeline de semestres
    - Hitos académicos (Prácticas, Proyecto, etc.)
    - Requisitos adicionales
    - Fecha estimada de graduación
    ```

---

### **FASE 8: Perfil de Usuario y Admin Panel** 👤⚙️
**Duración estimada:** 2 días
**Objetivo:** Páginas de perfil y administración

#### 8.1 Profile Page (Día 14)

27. **Profile.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Página de perfil completo

    // Secciones:
    1. Información Personal
       - Avatar (upload opcional)
       - Nombre completo
       - Email
       - Código estudiante
       - Programa académico
       - Semestre actual
       - Botón "Editar"

    2. Estadísticas DUNAB
       - Saldo actual (destacado)
       - Total ganado histórico
       - Total gastado histórico
       - Transacciones totales
       - Gráfico de balance mensual

    3. Actividad Reciente
       - Últimas 5 transacciones
       - Eventos inscritos próximos

    4. Preferencias
       - Idioma (ES/EN)
       - Tema (Claro/Oscuro)
       - Notificaciones (Email, Push)

    5. Seguridad
       - Cambiar contraseña
       - Cerrar sesión en todos los dispositivos
    ```

#### 8.2 Admin Panel (Día 15)

28. **AdminPanel.jsx** ⚠️ IMPORTANTE (Solo ADMIN)
    ```javascript
    // Panel de administración completo

    // Tabs principales:
    1. Dashboard Admin
       - Total estudiantes registrados
       - Total DUNAB en circulación
       - Transacciones hoy/semana/mes
       - Eventos activos
       - Gráficos de actividad

    2. Gestión de Estudiantes
       - Lista de estudiantes (búsqueda y filtros)
       - Ver perfil de estudiante
       - Ver saldo DUNAB
       - Ver historial de transacciones
       - Crear/editar/eliminar estudiante

    3. Gestión de Transacciones
       - Usar DunabManagement component
       - Crear transacción manual
       - Anular transacción
       - Ver estadísticas

    4. Gestión de Eventos
       - CRUD de eventos
       - Ver inscritos
       - Confirmar asistencia (otorga DUNAB)
       - Exportar lista de asistentes

    5. Categorías
       - CRUD de categorías de transacciones

    6. Reportes
       - Reporte de movimientos DUNAB
       - Reporte de eventos
       - Reporte de estudiantes más activos
       - Export a PDF/Excel

    7. Configuración
       - Reglas de recompensas
       - Límites de transacciones
       - Parámetros del sistema
    ```

---

### **FASE 9: Componentes Compartidos y Utilidades** 🔧
**Duración estimada:** 1 día
**Objetivo:** Mejorar componentes reutilizables

#### 9.1 Completar Shared Components (Día 16)

29. **DataTable.jsx** ⚠️ IMPORTANTE
    ```javascript
    // Tabla genérica reutilizable
    // Props:
    {
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Nombre', sortable: true },
        // ...
      ],
      data: [...],
      pagination: { page, size, total },
      onSort: (key, order) => {},
      onPageChange: (page) => {},
      loading: false,
      actions: [...], // Botones de acción por fila
      selectable: false, // Checkboxes
      onSelect: (selected) => {}
    }

    // Features:
    - Ordenamiento por columna
    - Paginación
    - Loading skeleton
    - Empty state
    - Selección múltiple (opcional)
    - Acciones por fila
    - Responsive (scroll horizontal en mobile)
    - Custom cell renderers
    ```

30. **DunabAmount.jsx** ⚠️ MEDIA
    ```javascript
    // Componente para formatear montos DUNAB
    // Mejorar con:
    - Símbolo de moneda "D"
    - Separadores de miles
    - Color según tipo (ingreso verde, egreso rojo)
    - Tooltip con monto en palabras
    - Animación de cambio de valor
    ```

---

### **FASE 10: Estilos, Responsive y Animaciones** 🎨
**Duración estimada:** 2-3 días
**Objetivo:** UI/UX pulido y profesional

#### 10.1 Sistema de Estilos Completo (Día 17-18)

31. **CSS Variables Mejorado**
    ```css
    /* src/styles/variables.css */

    :root {
      /* DUNAB Brand Colors */
      --color-dunab-gold: #FFD700;
      --color-dunab-gold-dark: #FFA500;
      --color-dunab-blue: #1E3A8A;
      --color-dunab-blue-light: #3B82F6;

      /* Gradientes DUNAB */
      --gradient-dunab-primary: linear-gradient(135deg, var(--color-dunab-gold) 0%, var(--color-dunab-gold-dark) 100%);
      --gradient-dunab-secondary: linear-gradient(135deg, var(--color-dunab-blue) 0%, var(--color-dunab-blue-light) 100%);

      /* Sombras */
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
      --shadow-glow: 0 0 20px rgba(255, 215, 0, 0.3);

      /* Animaciones */
      --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    ```

32. **Animaciones CSS**
    ```css
    /* src/styles/animations.css */

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes slideInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
      50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
    }
    ```

33. **Responsive Design**
    ```css
    /* Breakpoints */
    --breakpoint-xs: 320px;
    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;

    /* Grid responsivo para Dashboard */
    .dashboard-grid-2col {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .dashboard-grid-2col {
        grid-template-columns: 1fr;
      }
    }
    ```

34. **Modo Oscuro Mejorado**
    ```css
    /* Mejorar todas las variables para dark mode */
    [data-theme='dark'] {
      --color-bg-primary: #0F172A;
      --color-bg-secondary: #1E293B;
      --color-bg-tertiary: #334155;

      --color-text-primary: #F1F5F9;
      --color-text-secondary: #CBD5E1;

      /* Ajustar sombras para modo oscuro */
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4);
    }
    ```

#### 10.2 Loading States y Skeletons (Día 19)

35. **LoadingSkeleton.jsx** - Nuevo componente
    ```javascript
    // Componente de loading skeleton genérico
    export const Skeleton = ({ type = 'text', width, height, count = 1 }) => {
      // Tipos: text, circle, rect, card
      // Animación de shimmer
    };

    // Uso:
    <Skeleton type="card" count={3} />
    <Skeleton type="text" width="80%" />
    <Skeleton type="circle" width="40px" height="40px" />
    ```

36. **Empty States**
    ```javascript
    // Componente genérico para estados vacíos
    export const EmptyState = ({ icon, title, message, action }) => {
      return (
        <div className="empty-state">
          <div className="empty-icon">{icon}</div>
          <h3>{title}</h3>
          <p>{message}</p>
          {action && <button>{action.label}</button>}
        </div>
      );
    };

    // Uso:
    <EmptyState
      icon="📭"
      title="No hay transacciones"
      message="Aún no tienes transacciones en tu historial"
      action={{ label: "Ver eventos", onClick: () => navigate('/events') }}
    />
    ```

---

### **FASE 11: Testing y Calidad** 🧪
**Duración estimada:** 2-3 días
**Objetivo:** Asegurar calidad y estabilidad

#### 11.1 Testing Setup (Día 20)

37. **Instalar dependencias de testing**
    ```bash
    npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom
    ```

38. **Configurar Vitest**
    ```javascript
    // vite.config.js
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    export default defineConfig({
      plugins: [react()],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
      },
    });
    ```

39. **Tests prioritarios** (escribir al menos estos)
    ```javascript
    // AuthContext.test.js
    - Login exitoso
    - Login con credenciales inválidas
    - Logout
    - Token refresh
    - Role verification

    // DunabContext.test.js
    - Cargar balance
    - Cargar transacciones
    - Filtrar transacciones
    - Crear transacción

    // ProtectedRoute.test.js
    - Redirect si no autenticado
    - Permitir acceso si autenticado
    - Bloquear si rol incorrecto

    // NotificationQueue.test.js
    - Enqueue
    - Dequeue
    - FIFO order
    - Mark as read

    // Components:
    - DunabBalance.test.js
    - TransactionCard.test.js
    - EventCard.test.js
    - FilterBar.test.js
    ```

#### 11.2 ESLint y Prettier (Día 21)

40. **Configurar linting**
    ```bash
    npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks prettier
    ```

41. **Code quality checks**
    - Lint all files
    - Format all files
    - Fix warnings
    - Remove console.logs
    - Remove unused imports
    - Fix accessibility issues

---

### **FASE 12: Optimización y Performance** ⚡
**Duración estimada:** 1-2 días
**Objetivo:** Aplicación rápida y eficiente

#### 12.1 Optimizaciones React (Día 22)

42. **Code splitting**
    ```javascript
    // Lazy load de páginas
    const Dashboard = lazy(() => import('./pages/Dashboard'));
    const Transactions = lazy(() => import('./pages/Transactions'));
    const Events = lazy(() => import('./pages/Events'));
    const AdminPanel = lazy(() => import('./pages/AdminPanel'));

    // Suspense wrapper
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        ...
      </Routes>
    </Suspense>
    ```

43. **Memoization**
    ```javascript
    // Usar React.memo en componentes pesados
    export default React.memo(TransactionTable);

    // useMemo para cálculos costosos
    const filteredData = useMemo(() => {
      return data.filter(item => /* filtros */);
    }, [data, filters]);

    // useCallback para funciones
    const handleFilter = useCallback((filters) => {
      // ...
    }, []);
    ```

44. **Image optimization**
    - Lazy load images
    - Usar WebP format
    - Placeholder blur
    - Responsive images

45. **Bundle size**
    ```bash
    # Analizar bundle
    npm install --save-dev vite-plugin-visualizer

    # Ver tamaño de dependencias
    npm run build
    # Revisar dist/ size
    ```

---

### **FASE 13: Documentación y Deployment** 📚🚀
**Duración estimada:** 1-2 días
**Objetivo:** Documentar y preparar para producción

#### 13.1 Documentación (Día 23)

46. **README.md del proyecto**
    ```markdown
    # DUNAB Frontend

    ## Requisitos
    ## Instalación
    ## Configuración
    ## Scripts disponibles
    ## Estructura del proyecto
    ## Componentes principales
    ## Contextos
    ## Testing
    ## Deployment
    ```

47. **JSDoc en componentes**
    ```javascript
    /**
     * Componente de tabla de transacciones
     * @param {Object} props
     * @param {Array} props.transactions - Lista de transacciones
     * @param {boolean} props.loading - Estado de carga
     * @param {Function} props.onTransactionClick - Callback al hacer click
     * @returns {JSX.Element}
     */
    ```

#### 13.2 Preparación para Deployment (Día 24)

48. **Variables de entorno**
    ```bash
    # .env.production
    VITE_API_BASE_URL=https://api.dunab.com
    VITE_ENV=production
    ```

49. **Build optimizado**
    ```bash
    npm run build
    # Revisar bundle size
    # Test en preview mode
    npm run preview
    ```

50. **Deploy a Vercel/Netlify**
    ```bash
    # Opción Vercel
    npm install -g vercel
    vercel --prod

    # Opción Netlify
    npm install -g netlify-cli
    netlify deploy --prod
    ```

---

## 📋 RESUMEN DE ARCHIVOS FALTANTES/INCOMPLETOS

### **CRÍTICOS** (Sin estos no funciona el sistema)
1. ✅ BalanceCard.jsx - Visualización de saldo
2. ✅ QuickStats.jsx - Estadísticas rápidas
3. ✅ RecentTransactions.jsx - **Stack LIFO**
4. ✅ CreateTransaction.jsx - Formulario de transacción
5. ✅ FilterBar.jsx - Filtros avanzados
6. ✅ StatisticsWidget.jsx - Widget de estadísticas
7. ✅ BalanceChart.jsx - Gráfico de balance (necesita recharts)
8. ✅ EventsCatalog.jsx - Catálogo de eventos (delegar filtrado a backend)
9. ✅ EventDetail.jsx - Detalle de evento
10. ✅ EventRegistration.jsx - Inscripción con pago DUNAB
11. ✅ NotificationQueue.js - **Queue FIFO** (estructura de datos)
12. ✅ NotificationBell.jsx - Campana de notificaciones
13. ✅ NotificationCenter.jsx - Centro de notificaciones

### **IMPORTANTES** (Mejoran significativamente UX)
14. ✅ TransactionTable.jsx - Tabla completa
15. ✅ TransactionCard.jsx - Tarjeta de transacción
16. ✅ DunabManagement.jsx - Panel de gestión admin
17. ✅ UpcomingEvents.jsx - Eventos próximos
18. ✅ EventCard.jsx - Tarjeta de evento
19. ✅ AcademicProgress.jsx - Progreso académico
20. ✅ Profile.jsx - Página de perfil
21. ✅ AdminPanel.jsx - Panel de administración
22. ✅ DataTable.jsx - Tabla genérica reutilizable

### **MEDIOS** (Nice to have)
23. ✅ CategoryManagement.jsx - CRUD categorías
24. ✅ TransactionHistory.jsx - Historial completo
25. ✅ CourseList.jsx - Lista de materias
26. ✅ GraduationPath.jsx - Camino a graduación
27. ✅ NotificationItem.jsx - Item de notificación
28. ✅ DunabAmount.jsx - Formateo de montos
29. ✅ StatCard.jsx - Tarjeta de estadística

### **ESTILOS CSS** (Todos los componentes necesitan CSS)
- Aproximadamente 25-30 archivos CSS a crear/completar
- Variables CSS mejoradas
- Animaciones
- Responsive design
- Modo oscuro completo

---

## 🎯 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

### **SEMANA 1: Fundamentos DUNAB**
- Día 1-4: Fase 3 (Componentes DUNAB Core)
- Objetivo: Sistema DUNAB funcional con mock data

### **SEMANA 2: Dashboard y Visualizaciones**
- Día 5-7: Fase 4 (Dashboard) + Fase 5 inicio (Eventos)
- Objetivo: Dashboard completo + Catálogo de eventos

### **SEMANA 3: Eventos y Notificaciones**
- Día 8-11: Fase 5 (Eventos) + Fase 6 (Notificaciones con Queue)
- Objetivo: Sistema de eventos completo + Notificaciones FIFO

### **SEMANA 4: Académico, Perfil y Admin**
- Día 12-16: Fase 7 (Académico) + Fase 8 (Perfil/Admin) + Fase 9 (Shared)
- Objetivo: Módulos complementarios completos

### **SEMANA 5: Pulido y Calidad**
- Día 17-24: Fase 10 (Estilos) + Fase 11 (Testing) + Fase 12 (Performance) + Fase 13 (Docs/Deploy)
- Objetivo: Aplicación pulida, testeada y deployada

---

## ✅ CRITERIOS DE ÉXITO

Al finalizar todas las fases, tu frontend debe tener:

### **Funcionalidad**
- ✅ Sistema DUNAB completo (CRUD + visualizaciones)
- ✅ Dashboard con estadísticas y gráficos
- ✅ Sistema de eventos con inscripción y pago
- ✅ Notificaciones en tiempo real (Queue FIFO)
- ✅ Historial de transacciones (Stack LIFO)
- ✅ Progreso académico
- ✅ Perfil de usuario
- ✅ Panel de administración completo

### **Calidad**
- ✅ Responsive en mobile, tablet, desktop
- ✅ Modo oscuro/claro funcional
- ✅ i18n completo (ES/EN)
- ✅ Loading states en todas las operaciones
- ✅ Error handling robusto
- ✅ Validaciones de formularios
- ✅ Tests de componentes críticos

### **Performance**
- ✅ Code splitting implementado
- ✅ Lazy loading de imágenes
- ✅ Memoization en componentes pesados
- ✅ Bundle size optimizado (<500KB)

### **UX/UI**
- ✅ Animaciones suaves
- ✅ Feedback visual claro
- ✅ Empty states diseñados
- ✅ Skeleton loaders
- ✅ Tooltips y ayudas contextuales
- ✅ Accesibilidad básica (ARIA)

---

## 🚨 RECORDATORIOS IMPORTANTES

### **SEPARACIÓN DE RESPONSABILIDADES**

#### **Frontend (React) debe:**
- ✅ Renderizar UI
- ✅ Validar formularios (client-side)
- ✅ Construir requests HTTP
- ✅ Manejar estado local y global
- ✅ Formatear datos para display
- ✅ Navegación y routing

#### **Backend (Java) debe:**
- ✅ Validar datos (server-side)
- ✅ **Filtrar y buscar** (eventos, transacciones)
- ✅ **Ordenar y paginar** resultados
- ✅ Lógica de negocio (cálculos, validaciones de negocio)
- ✅ Persistencia y CRUD
- ✅ Autenticación y autorización
- ✅ Transacciones atómicas (ACID)

### **NUNCA hacer en Frontend:**
- ❌ Filtrado de listas grandes (debe hacer backend)
- ❌ Búsqueda en datos (debe hacer backend)
- ❌ Ordenamiento de resultados (debe hacer backend)
- ❌ Validaciones de negocio (solo validaciones de UI)
- ❌ Cálculos complejos (debe hacer backend)

### **Ejemplo CORRECTO:**
```javascript
// ❌ INCORRECTO
const filtered = events.filter(e => e.categoria === 'academico');

// ✅ CORRECTO
const events = await eventService.getAllEvents({ categoria: 'academico' });
```

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

### **AHORA MISMO:**

1. **Revisar este plan** y confirmar que entiendes el alcance

2. **Decidir enfoque:**
   - **Opción A:** Implementar todo con mock data (frontend standalone)
   - **Opción B:** Conectar backend y trabajar con datos reales

3. **Empezar con Fase 3:**
   - Día 1: BalanceCard + QuickStats + StatCard
   - Día 2: RecentTransactions (Stack) + TransactionTable
   - Día 3: CreateTransaction + FilterBar
   - Día 4: CSS de todos los componentes DUNAB

---

## 📝 NOTAS FINALES

- Este plan está diseñado para **5 semanas de trabajo constante**
- Puedes ajustar el orden según tus prioridades
- Los componentes marcados como **CRÍTICOS** son obligatorios
- Los **IMPORTANTES** mejoran mucho la UX
- Los **MEDIOS** son opcionales pero recomendados

**El frontend ya tiene una base sólida (Fase 1-2 completa).** Ahora solo necesitas:
1. Completar componentes faltantes
2. Implementar las 2 estructuras de datos (Stack y Queue)
3. Agregar estilos y pulir UX
4. Testing básico
5. Conectar con backend

---

**¿Listo para empezar?** 🚀

Dime con qué fase quieres comenzar o si necesitas que te ayude con algún componente específico.

