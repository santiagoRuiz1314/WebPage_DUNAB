# 📐 Arquitectura Frontend-Backend - Sistema DUNAB

## ✅ Responsabilidades Correctas

### 🎨 **FRONTEND (React)** - Lo que SÍ debe hacer:

#### 1. **Presentación y UI/UX**
- ✅ Renderizar componentes visuales
- ✅ Manejar estados de UI (loading, error, success)
- ✅ Animaciones y transiciones CSS
- ✅ Validaciones de formularios (cliente)
- ✅ Responsive design

#### 2. **Gestión de Estado Local**
- ✅ Estado de componentes (useState)
- ✅ Estado global (Context API)
- ✅ Cache temporal de datos ya consultados

#### 3. **Navegación**
- ✅ Routing entre páginas
- ✅ Manejo de modales y popups
- ✅ Breadcrumbs y navegación visual

#### 4. **Llamadas al Backend**
- ✅ Construir peticiones HTTP
- ✅ Enviar parámetros de filtrado, paginación, ordenamiento
- ✅ Manejar respuestas y errores HTTP
- ✅ Mostrar mensajes al usuario

---

### ⚙️ **BACKEND (Java/Spring Boot)** - Lo que SÍ debe hacer:

#### 1. **Lógica de Negocio**
- ✅ Validaciones de negocio (saldo suficiente, cupos disponibles)
- ✅ Cálculos (estadísticas, totales, porcentajes)
- ✅ Reglas de recompensas DUNAB
- ✅ Transacciones atómicas (ACID)

#### 2. **Filtrado y Búsqueda**
- ✅ Filtrar eventos por categoría
- ✅ Búsqueda por texto (nombre, descripción)
- ✅ Filtrar por costo (gratuito/pagado)
- ✅ Paginación de resultados
- ✅ Ordenamiento (fecha, nombre, recompensa)

#### 3. **Persistencia de Datos**
- ✅ CRUD completo de todas las entidades
- ✅ Consultas optimizadas con índices
- ✅ Gestión de transacciones DUNAB
- ✅ Auditoría de operaciones

#### 4. **Seguridad**
- ✅ Autenticación JWT
- ✅ Autorización por roles
- ✅ Validación de permisos
- ✅ Sanitización de inputs

---

## 🔄 Flujo de Comunicación Correcto

### Ejemplo: Filtrar Eventos

#### ❌ **INCORRECTO** (Lógica en Frontend)
```javascript
// Frontend hace el filtrado
const filtered = events.filter(e => e.categoria === categoria);
const sorted = filtered.sort((a, b) => a.fecha - b.fecha);
```

#### ✅ **CORRECTO** (Frontend delega al Backend)
```javascript
// Frontend solo construye la petición
const response = await api.get('/events', {
  params: {
    categoria: 'académico',
    sortBy: 'date',
    order: 'asc',
    page: 0,
    size: 10
  }
});
// Backend retorna los eventos ya filtrados y ordenados
setEvents(response.data.content);
```

---

## 📊 Endpoints del Backend - Eventos

Según la arquitectura definida:

### Eventos - GET /api/events
**Parámetros de consulta:**
```
?page=0
&size=10
&categoria=académico          // Filtrar por categoría
&gratuito=true               // Solo eventos gratuitos
&search=IA                   // Búsqueda por texto
&sortBy=date                 // Ordenar por: date, name, reward
&order=asc                   // asc o desc
&fechaInicio=2025-01-01     // Filtrar por rango de fechas
&fechaFin=2025-12-31
```

**Respuesta del Backend:**
```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Conferencia IA",
      "descripcion": "...",
      "fecha": "2025-11-15T10:00:00",
      "categoria": "académico",
      "costoDunab": 0,
      "recompensaDunab": 100,
      "cuposDisponibles": 150,
      "cuposTotal": 200
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```

### Inscripción - POST /api/events/{id}/register
**Request Body:**
```json
{
  "studentId": 123  // Opcional si se usa JWT
}
```

**Lógica del Backend:**
1. Verificar que el estudiante existe
2. Verificar que hay cupos disponibles
3. Verificar saldo DUNAB si el evento tiene costo
4. Crear inscripción
5. Debitar DUNAB si aplica (transacción atómica)
6. Retornar confirmación

**Response:**
```json
{
  "success": true,
  "message": "Inscripción exitosa",
  "inscripcionId": 456,
  "dunabDebitado": 50,
  "saldoNuevo": 450
}
```

---

## 🎯 Arquitectura de la Fase 3 (Corregida)

### Flujo de Datos Correcto:

```
┌─────────────┐
│   USUARIO   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          FRONTEND (React)               │
│                                         │
│  EventsCatalog.jsx                     │
│  ├─ Inputs de filtros                  │
│  ├─ Construye parámetros               │
│  └─ Llama: getAllEvents(params)        │
│                                         │
│  eventService.js                       │
│  └─ api.get('/events', { params })     │
└──────────────┬──────────────────────────┘
               │ HTTP Request
               │ GET /api/events?categoria=X&sortBy=date
               ▼
┌─────────────────────────────────────────┐
│      BACKEND (Java/Spring Boot)         │
│                                         │
│  EventController                        │
│  ├─ Recibe parámetros                   │
│  └─ Llama EventService                  │
│                                         │
│  EventService                           │
│  ├─ Aplica filtros (JPA/SQL)           │
│  ├─ Ordena resultados                   │
│  ├─ Pagina datos                        │
│  └─ Calcula metadatos                   │
│                                         │
│  EventRepository (JPA)                  │
│  └─ Consultas SQL optimizadas           │
│                                         │
│  Base de Datos                          │
│  └─ PostgreSQL/MySQL                    │
└──────────────┬──────────────────────────┘
               │ HTTP Response (JSON)
               ▼
┌─────────────────────────────────────────┐
│          FRONTEND (React)               │
│                                         │
│  └─ Recibe eventos filtrados            │
│  └─ Renderiza EventCard                 │
└─────────────────────────────────────────┘
```

---

## 📝 Cambios Realizados en la Corrección

### 1. **eventService.js**
**Antes:**
```javascript
// ❌ Filtrado en el frontend
let filtered = events.filter(e => e.categoria === categoria);
filtered.sort((a, b) => a.fecha - b.fecha);
```

**Después:**
```javascript
// ✅ Delegar al backend
const response = await api.get('/events', {
  params: { categoria, sortBy: 'date' }
});
```

### 2. **EventsCatalog.jsx**
**Antes:**
```javascript
// ❌ Lógica de filtrado en el componente
const applyFilters = () => {
  let filtered = [...events];
  if (selectedCategory) {
    filtered = filtered.filter(e => e.categoria === selectedCategory);
  }
  // ... más filtros locales
};
```

**Después:**
```javascript
// ✅ Construir parámetros y llamar al backend
const applyFilters = async () => {
  const filters = {
    categoria: selectedCategory,
    search: searchTerm,
    sortBy: sortBy
  };
  const data = await eventService.getAllEvents(0, 50, filters);
  setFilteredEvents(data.content);
};
```

---

## 🚀 Ventajas de esta Arquitectura

### 1. **Performance**
- ✅ Filtrado optimizado con índices SQL
- ✅ Paginación en backend (no cargar todos los datos)
- ✅ Menos datos transferidos por la red

### 2. **Seguridad**
- ✅ Validaciones en backend no pueden ser evitadas
- ✅ No se expone lógica de negocio al cliente
- ✅ Protección contra manipulación de datos

### 3. **Mantenibilidad**
- ✅ Cambios en lógica solo requieren actualizar backend
- ✅ Frontend más simple y enfocado en UI
- ✅ Fácil testing de lógica de negocio

### 4. **Escalabilidad**
- ✅ Backend puede usar cache (Redis)
- ✅ Consultas optimizadas
- ✅ Balanceo de carga más efectivo

---

## 🔍 Datos Mock vs Backend Real

### Modo Desarrollo (Sin Backend)
```javascript
try {
  const response = await api.get('/events');
  return response.data;
} catch (error) {
  // Fallback a datos mock SOLO para desarrollo
  console.warn('⚠️ Usando datos mock - Backend no disponible');
  return mockEvents;
}
```

### Modo Producción (Con Backend)
```javascript
try {
  const response = await api.get('/events');
  return response.data;
} catch (error) {
  // En producción, mostrar error al usuario
  throw new Error('No se pudieron cargar los eventos');
}
```

---

## ✅ Checklist de Implementación Backend

Cuando implementes el backend, asegúrate de:

- [ ] Endpoint GET /api/events con todos los parámetros
- [ ] Filtrado por categoría en SQL
- [ ] Búsqueda por texto (LIKE o Full-Text Search)
- [ ] Filtrado por costo (costoDunab = 0 o > 0)
- [ ] Ordenamiento dinámico (ORDER BY)
- [ ] Paginación (LIMIT y OFFSET)
- [ ] Cálculo de cupos disponibles
- [ ] Respuesta con estructura paginada
- [ ] POST /api/events/{id}/register con lógica transaccional
- [ ] Validación de saldo DUNAB
- [ ] Débito automático de DUNAB
- [ ] Auditoría de transacciones

---

**Última actualización:** Noviembre 2025
**Versión:** 2.0 (Corregida)
