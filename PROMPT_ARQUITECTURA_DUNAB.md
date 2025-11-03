# 🎯 PROMPT PARA ARQUITECTURA DEL PROYECTO
## Sistema de Gestión de Dinero UNAB (DUNAB)

---

## Instrucciones para el Arquitecto de Software

Actúa como un arquitecto de software senior especializado en aplicaciones full-stack con React y Java.

Necesito que diseñes la arquitectura completa de un **Sistema de Gestión de Dinero UNAB (DUNAB)** integrado con funcionalidades académicas y de eventos para una universidad.

---

## 📋 CONTEXTO DEL PROYECTO

Sistema de gestión de moneda virtual institucional "DUNAB" que sirve como eje central para:

- **Gestión completa del sistema de dinero DUNAB**: Moneda virtual institucional con operaciones CRUD completas
- Integración con el progreso académico (créditos, materias, requisitos de graduación)
- Integración con eventos institucionales para fomentar la participación estudiantil
- Visualización del camino hacia la graduación

**ENFOQUE PRINCIPAL**: Sistema de Gestión de Dinero DUNAB como core del proyecto, conectando todos los módulos del ecosistema universitario.

---

## 💻 STACK TECNOLÓGICO OBLIGATORIO

- **Frontend**: React (con librerías modernas)
- **Backend**: Java (Spring Boot recomendado)
- **Base de datos**: Proponer según necesidades (SQL/NoSQL)

---

## 🎯 REQUERIMIENTOS FUNCIONALES CRÍTICOS

### 1. SISTEMA DE GESTIÓN DE DINERO DUNAB (COMPONENTE CENTRAL)

#### OPERACIONES CRUD COMPLETAS

##### CREATE (Crear)
- Crear cuenta DUNAB para nuevos estudiantes
- Registrar nuevas transacciones (crédito/débito)
- Crear reglas de recompensas
- Crear categorías de transacciones

##### READ (Consultar)
- Consultar saldo actual de un estudiante
- Consultar historial completo de transacciones
- Consultar transacciones por rango de fechas
- Consultar transacciones por tipo (ingreso/egreso)
- Consultar transacciones por categoría
- Consultar estadísticas de DUNAB (total ganado, total gastado, promedio)
- Generar reportes de movimientos
- Consultar ranking de estudiantes por saldo DUNAB
- Consultar balance general del sistema

##### UPDATE (Actualizar)
- Actualizar saldo de cuenta DUNAB
- Modificar información de transacciones (con validaciones)
- Actualizar límites de cuenta
- Modificar reglas de recompensas
- Ajustar categorías de transacciones

##### DELETE (Eliminar)
- Anular transacciones (con justificación y auditoría)
- Eliminar reglas de recompensas obsoletas
- Eliminar categorías no utilizadas
- Soft delete de cuentas (mantener historial)

#### FUNCIONALIDADES ADICIONALES DEL SISTEMA DUNAB

- Dashboard de balance y estadísticas personales
- Sistema de recompensas automáticas:
  * Completar materias → Ganancia de DUNAB
  * Asistir a eventos institucionales → Ganancia de DUNAB
  * Cumplir hitos académicos → Bonos de DUNAB
- Sistema de uso de DUNAB:
  * Inscripción a eventos premium
  * Beneficios institucionales
  * Servicios universitarios
  * Canje por productos/servicios
- Historial detallado con filtros avanzados
- Notificaciones de movimientos de DUNAB
- Límites de transacciones (mínimos/máximos)
- Sistema de auditoría de transacciones
- Prevención de saldo negativo
- Validación de transacciones duplicadas

---

### 2. Autenticación y Autorización

- Sistema de login seguro
- Roles diferenciados:
  * **Estudiante**: Consultar su DUNAB, ver historial, usar DUNAB
  * **Administrador**: CRUD completo de DUNAB, gestión de usuarios, reportes generales
  * **Coordinador**: Asignar DUNAB por eventos/actividades, consultas avanzadas
- Gestión de sesiones y tokens JWT
- Permisos específicos por rol para operaciones CRUD

---

### 3. Seguimiento Académico (Integrado con DUNAB)

- Visualización de créditos completados vs faltantes
- Lista de materias pendientes organizadas por semestre
- Seguimiento de requisitos adicionales (prácticas, proyectos de grado, eventos obligatorios)
- Dashboard con progreso visual hacia la graduación
- **Recompensas automáticas en DUNAB por logros académicos**

---

### 4. Gestión de Eventos (Integrado con DUNAB)

- Registro y consulta de eventos institucionales
- Inscripción de estudiantes a eventos
- Eventos gratuitos vs eventos que requieren DUNAB
- **Asignación automática de DUNAB por asistencia confirmada**
- Historial de participación

---

### 5. Características de UI/UX

- Modo oscuro/claro (theme switcher)
- Cambio de idioma (i18n: Español/Inglés mínimo)
- Interfaz amigable e intuitiva
- Responsive design
- Dashboard principal con resumen de DUNAB prominente

---

## 🔧 REQUERIMIENTOS TÉCNICOS ESPECIALES

**CRÍTICO**: El proyecto debe implementar estructuras de datos avanzadas para demostrar conocimientos académicos.

### ESTRUCTURA DE DATOS OBLIGATORIA A IMPLEMENTAR

**Pilas y/o Colas**: Para gestión de notificaciones del sistema y/o historial de transacciones DUNAB

- **Ejemplo recomendado 1**: Cola de notificaciones de movimientos DUNAB y eventos próximos
- **Ejemplo recomendado 2**: Pila para historial reciente de transacciones DUNAB (mostrar últimas N transacciones - LIFO)
- **Ejemplo recomendado 3**: Cola de procesamiento de transacciones pendientes de aprobación
- Debe incluir operaciones: `enqueue/dequeue` (cola), `push/pop` (pila)

### ESTRUCTURAS OPCIONALES

**Listas enlazadas**: Para gestión eficiente de historial de transacciones o secuencias de datos (implementar si se considera necesario para mejorar el sistema)

### Requisitos de Documentación de Estructuras

La arquitectura debe mostrar CLARAMENTE:
- Dónde se implementan las pilas/colas (obligatorio)
- Cómo se integran con el sistema de notificaciones y/o historial DUNAB
- Diagramas de las estructuras de datos
- Ejemplos de código en Java

---

## 💾 PERSISTENCIA

- Base de datos en el backend (proponer la más adecuada)
- Consideraciones especiales para:
  * Integridad transaccional (ACID)
  * Auditoría de todas las operaciones DUNAB
  * Respaldos automáticos
- Almacenamiento local opcional para caché (LocalStorage/IndexedDB)

---

## 📦 ENTREGABLES ESPERADOS

### 1. Diagrama de Arquitectura

- Arquitectura de capas (Frontend, Backend, Base de datos)
- Flujo de datos entre componentes
- **Módulo de Gestión DUNAB como componente central destacado**
- Servicios y controladores específicos de DUNAB
- Diagrama en texto (ASCII) o descripción detallada

---

### 2. Estructura de Carpetas

#### Organización del proyecto React (frontend):

```
/src
  /components
    /dunab (componentes específicos DUNAB)
    /academic
    /events
  /services (APIs)
  /context (estado global DUNAB)
```

#### Organización del proyecto Java/Spring Boot (backend):

```
/src/main/java
  /controller (DunabController, TransactionController)
  /service (DunabService, TransactionService)
  /repository (DunabRepository, TransactionRepository)
  /model (Dunab, Transaction, Student)
  /dto (request/response objects)
  /utils (estructuras de datos: Queue, Stack)
```

- Convenciones de nomenclatura

---

### 3. Modelo de Datos Completo

#### Entidades principales con atributos detallados:

- **Usuario/Estudiante** (id, nombre, email, password, rol, fechaCreacion)
- **CuentaDunab** (id, estudianteId, saldoActual, saldoTotal, fechaCreacion, estado)
- **Transaccion** (id, cuentaId, tipo, monto, categoria, descripcion, fecha, referencia, estado)
- **CategoriaTransaccion** (id, nombre, tipo)
- **Materia** (id, nombre, creditos, estado)
- **Evento** (id, nombre, descripcion, costoDunab, recompensaDunab, fecha)
- **InscripcionEvento** (id, eventoId, estudianteId, estado, fechaInscripcion)
- **Notificacion** (id, estudianteId, tipo, mensaje, fecha, leida)

#### Adicionales:

- Relaciones entre entidades (1:1, 1:N, N:M)
- Esquema de base de datos con tipos de datos
- Índices para optimización de consultas

---

### 4. Diseño de API REST Completo

#### Módulo DUNAB

```
POST   /api/dunab/accounts              - Crear cuenta DUNAB
GET    /api/dunab/accounts/{id}         - Consultar cuenta específica
GET    /api/dunab/accounts/{id}/balance - Consultar saldo
PUT    /api/dunab/accounts/{id}         - Actualizar cuenta
DELETE /api/dunab/accounts/{id}         - Eliminar cuenta (soft delete)

POST   /api/dunab/transactions          - Crear transacción
GET    /api/dunab/transactions          - Listar todas las transacciones (con paginación)
GET    /api/dunab/transactions/{id}     - Consultar transacción específica
GET    /api/dunab/transactions/student/{id} - Historial de estudiante
GET    /api/dunab/transactions/filter   - Filtrar por fecha/tipo/categoría
PUT    /api/dunab/transactions/{id}     - Actualizar transacción
DELETE /api/dunab/transactions/{id}     - Anular transacción

GET    /api/dunab/statistics            - Estadísticas generales
GET    /api/dunab/statistics/{studentId} - Estadísticas por estudiante
GET    /api/dunab/reports               - Generar reportes
GET    /api/dunab/ranking               - Ranking de estudiantes

POST   /api/dunab/categories            - Crear categoría
GET    /api/dunab/categories            - Listar categorías
PUT    /api/dunab/categories/{id}       - Actualizar categoría
DELETE /api/dunab/categories/{id}       - Eliminar categoría
```

#### Módulo Estudiantes

```
POST   /api/students                    - Crear estudiante
GET    /api/students                    - Listar estudiantes
GET    /api/students/{id}               - Consultar estudiante
PUT    /api/students/{id}               - Actualizar estudiante
DELETE /api/students/{id}               - Eliminar estudiante
GET    /api/students/{id}/progress      - Progreso académico
```

#### Módulo Eventos

```
POST   /api/events                      - Crear evento
GET    /api/events                      - Listar eventos
GET    /api/events/{id}                 - Consultar evento
PUT    /api/events/{id}                 - Actualizar evento
DELETE /api/events/{id}                 - Eliminar evento
POST   /api/events/{id}/register        - Inscribirse (con pago DUNAB si aplica)
POST   /api/events/{id}/confirm         - Confirmar asistencia (otorga DUNAB)
```

#### Módulo Notificaciones

```
GET    /api/notifications               - Obtener notificaciones (desde Cola)
PUT    /api/notifications/{id}/read     - Marcar como leída
DELETE /api/notifications/{id}          - Eliminar notificación
```

#### Especificaciones adicionales:

- Estructura detallada de peticiones/respuestas JSON
- Códigos de estado HTTP apropiados
- Manejo de errores estandarizado
- Autenticación JWT en headers

---

### 5. Implementación de Estructuras de Datos

#### Pilas/Colas (OBLIGATORIO)

Implementación en Java:

```java
// Ejemplo conceptual
public class NotificationQueue {
    private Queue<Notification> queue;

    public void enqueue(Notification notification) { }
    public Notification dequeue() { }
    public boolean isEmpty() { }
}

public class TransactionHistory {
    private Stack<Transaction> recentTransactions;

    public void push(Transaction transaction) { }
    public Transaction pop() { }
    public List<Transaction> getRecent(int n) { }
}
```

- **Dónde se usa**: NotificationService, TransactionService
- **Operaciones principales** con ejemplos
- **Justificación técnica** (FIFO para notificaciones, LIFO para historial reciente)

#### Estructura Adicional (si se implementa)

- **Listas enlazadas**: Descripción y código conceptual si se considera útil

---

### 6. Sistema de DUNAB - Lógica de Negocio Detallada

#### Reglas de Obtención de DUNAB

- Completar materia: 100 DUNAB por crédito
- Asistir a evento: 50-200 DUNAB según importancia
- Proyecto de grado: 500 DUNAB
- Referir estudiante: 100 DUNAB

#### Reglas de Gasto de DUNAB

- Evento premium: 50-300 DUNAB
- Servicios: variable según servicio
- Saldo mínimo requerido: 0 (no puede ser negativo)

#### Validaciones de Transacciones

- Verificar saldo suficiente antes de débito
- Validar montos positivos
- Prevenir transacciones duplicadas (idempotencia)
- Auditoría de todas las operaciones
- Rollback en caso de error

#### Seguridad

- Solo administradores pueden crear/eliminar transacciones manualmente
- Estudiantes solo consultan
- Coordinadores pueden asignar DUNAB por eventos
- Log de auditoría: quién, qué, cuándo

---

### 7. Componentes React Principales

#### Jerarquía de Componentes

```
App
├── AuthProvider (Context)
├── DunabProvider (Context - estado global DUNAB)
├── ThemeProvider (modo oscuro)
├── Header
│   ├── DunabBalance (muestra saldo actual)
│   ├── NotificationBell
│   └── LanguageSelector
├── Dashboard
│   ├── DunabWallet
│   │   ├── BalanceCard
│   │   ├── QuickStats
│   │   └── RecentTransactions (usa Stack)
│   ├── AcademicProgress
│   └── UpcomingEvents
├── DunabManagement (Admin)
│   ├── CreateTransaction
│   ├── TransactionList (CRUD)
│   ├── CategoryManagement
│   └── Reports
├── TransactionHistory
│   ├── FilterBar
│   ├── TransactionTable
│   └── ExportButton
├── Events
│   ├── EventsCatalog
│   ├── EventDetail
│   └── EventRegistration (con pago DUNAB)
├── NotificationCenter (usa Queue)
└── Profile
```

#### Estado Global (Context API o Redux)

- **DunabContext**: saldo, transacciones recientes, estadísticas
- **AuthContext**: usuario, rol, permisos
- **NotificationContext**: notificaciones (Queue)
- **ThemeContext**: modo oscuro/claro

#### Componentes Reutilizables

- DunabAmount (formatea montos)
- TransactionCard
- StatCard
- FilterBar
- DataTable (con paginación)

---

### 8. Sistema de Notificaciones con Pilas/Colas

#### Implementación Backend (Queue)

```java
@Service
public class NotificationService {
    private Queue<Notification> notificationQueue = new LinkedList<>();

    public void addNotification(Long studentId, String message) {
        Notification notif = new Notification(studentId, message);
        notificationQueue.offer(notif);
        // Enviar a frontend via WebSocket o polling
    }

    public List<Notification> getNotifications(Long studentId) {
        // Filtrar por estudiante y retornar
    }
}
```

#### Tipos de Notificaciones

- "Has recibido 100 DUNAB por completar Estructuras de Datos"
- "Se han debitado 50 DUNAB por inscripción a evento"
- "Evento próximo: Conferencia de IA - 2 días"
- "Nuevo logro desbloqueado: ¡50 DUNAB de bonus!"

#### Frontend

- Componente NotificationBell con badge de contador
- Panel deslizable con lista de notificaciones
- Marcar como leída
- Eliminar notificación

---

### 9. Configuración de Internacionalización (i18n)

- **Librería**: react-i18next
- **Archivos de traducción**:

```
/src/locales
  /es
    translation.json (dunab, transacciones, eventos, etc.)
  /en
    translation.json
```

- Selector de idioma en header
- Persistir preferencia en LocalStorage

---

### 10. Sistema de Temas (Modo Oscuro)

- Context API con ThemeProvider
- CSS Variables o Styled Components
- Toggle en header
- Persistir preferencia en LocalStorage
- Paleta de colores específica para DUNAB (ejemplo: dorado/azul)

---

### 11. Consideraciones de Seguridad

#### Autenticación y Autorización

- **JWT**: Access token + refresh token
- Protección de rutas frontend (React Router)
- Protección de endpoints backend (@PreAuthorize)

#### Seguridad DUNAB (CRÍTICO)

- Transacciones atómicas (ACID)
- Validación de permisos por rol
- Prevención de race conditions
- Logging de auditoría completo
- Encriptación de datos sensibles
- Rate limiting para prevenir abuso

#### Validaciones y Protecciones

- Validaciones frontend + backend (nunca confiar solo en frontend)
- Sanitización de inputs (prevenir SQL injection, XSS)
- HTTPS obligatorio en producción

---

### 12. Plan de Desarrollo Sugerido

#### Fase 1 - Fundamentos (Semana 1-2)

- [ ] Configuración de proyectos (React + Spring Boot)
- [ ] Base de datos y modelo de datos
- [ ] Autenticación JWT básica
- [ ] CRUD de estudiantes

#### Fase 2 - Sistema DUNAB Core (Semana 3-4)

- [ ] Implementación de entidades DUNAB
- [ ] CRUD completo de cuentas DUNAB
- [ ] CRUD completo de transacciones
- [ ] Servicios de negocio (validaciones, reglas)
- [ ] API REST de DUNAB completa

#### Fase 3 - Estructuras de Datos (Semana 5)

- [ ] Implementación de Queue para notificaciones
- [ ] Implementación de Stack para historial reciente
- [ ] Integración con servicios DUNAB
- [ ] Testing de estructuras

#### Fase 4 - Frontend DUNAB (Semana 6-7)

- [ ] Componentes de wallet y balance
- [ ] Dashboard de DUNAB
- [ ] Historial de transacciones con filtros
- [ ] Formularios CRUD (admin)
- [ ] Integración con API

#### Fase 5 - Módulos Complementarios (Semana 8)

- [ ] Módulo académico + integración DUNAB
- [ ] Módulo de eventos + integración DUNAB
- [ ] Sistema de recompensas automáticas

#### Fase 6 - Características Adicionales (Semana 9)

- [ ] Sistema de notificaciones
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Reportes y estadísticas

#### Fase 7 - Testing y Refinamiento (Semana 10)

- [ ] Testing unitario (JUnit, Jest)
- [ ] Testing de integración
- [ ] Corrección de bugs
- [ ] Optimización de rendimiento
- [ ] Documentación

---

## 🎯 PRIORIDADES DEL SISTEMA

1. **CRÍTICA**: Sistema de Gestión de Dinero DUNAB con CRUD completo
2. **CRÍTICA**: Seguridad y validaciones de transacciones
3. **ALTA**: Implementación de Pilas/Colas para notificaciones/historial
4. **ALTA**: Autenticación y autorización por roles
5. **MEDIA**: Integración académica y de eventos
6. **MEDIA**: Dashboard y visualizaciones
7. **BAJA**: Modo oscuro, i18n, features secundarios

---

## ✅ CRITERIOS DE ÉXITO

- ✅ CRUD completo y funcional para DUNAB
- ✅ Consultas eficientes con filtros avanzados
- ✅ Implementación correcta de Pilas/Colas
- ✅ Seguridad robusta en transacciones
- ✅ Interfaz intuitiva y responsive
- ✅ Integración fluida entre módulos
- ✅ Sistema de auditoría completo

---

## 📝 FORMATO DE RESPUESTA

Estructura tu respuesta de manera clara y profesional con:

- Secciones numeradas y bien organizadas
- Diagramas en texto (ASCII art) cuando sea posible
- Ejemplos de código relevantes en Java y React
- Esquemas de base de datos
- Ejemplos de JSON para requests/responses
- Justificaciones técnicas de decisiones arquitectónicas

**Prioriza la claridad, aplicabilidad práctica y enfoque en el sistema DUNAB como componente central del proyecto.**

---

## 📌 Notas Finales

Este documento contiene el prompt completo para generar la arquitectura del Sistema de Gestión de Dinero UNAB (DUNAB). Utiliza este prompt con un modelo de IA especializado en arquitectura de software para obtener una propuesta detallada y completa del sistema.

**Fecha de creación**: Noviembre 2025
**Versión**: 1.0
**Proyecto**: Sistema DUNAB - UNAB
