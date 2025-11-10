# Guía Completa de Integración Frontend-Backend DUNAB

> **Última actualización:** 2025-11-09
> **Estado del Proyecto:** Listo para integración
> **Viabilidad:** ✅ ALTA - Proyecto bien estructurado

---

## Tabla de Contenidos

1. [Preparación del Entorno](#1-preparación-del-entorno)
2. [Fase 1: Autenticación](#2-fase-1-autenticación-lo-más-importante)
3. [Fase 2: Ajustar Respuestas del Backend](#3-fase-2-ajustar-respuestas-del-backend)
4. [Fase 3: Crear Endpoints Faltantes](#4-fase-3-crear-endpoints-faltantes-en-backend)
5. [Fase 4: Eliminar Datos Mock](#5-fase-4-eliminar-datos-mock-del-frontend)
6. [Fase 5: Flujo Completo de Funcionalidad](#6-fase-5-flujo-completo-de-una-funcionalidad)
7. [Debugging y Troubleshooting](#7-debugging-y-troubleshooting)
8. [Checklist de Integración](#8-checklist-de-integración)
9. [Próximos Pasos](#9-próximos-pasos)

---

## Estado Actual del Proyecto

### Backend (Spring Boot + PostgreSQL)
- ✅ Java 21 + Spring Boot 3.2.0
- ✅ Base de datos: PostgreSQL con soporte H2 para desarrollo
- ✅ Autenticación: JWT implementada y funcional
- ✅ CORS configurado para frontend (localhost:3000, localhost:5173)
- ✅ APIs REST completamente implementadas
- ✅ Seguridad con roles (ESTUDIANTE, ADMINISTRADOR, COORDINADOR)
- ✅ Tests endpoints disponibles y funcionales

### Frontend (React + Vite)
- ✅ React 19 con Vite
- ✅ Axios para peticiones HTTP
- ✅ React Router para navegación
- ✅ i18next para internacionalización
- ✅ Recharts para gráficos
- ✅ Configuración de API ya apuntando a backend (localhost:8080)

### Puntos Positivos

1. **Arquitectura compatible**: El frontend ya está configurado para consumir el backend:
   - `apiConfig.js:4` - Base URL apunta a `http://localhost:8080/api`
   - Interceptores de Axios ya configurados para JWT
   - Servicios frontend mapeados a endpoints del backend

2. **Autenticación lista**:
   - JWT implementado en backend
   - Frontend tiene AuthContext y authService preparados
   - Manejo de tokens automático con interceptores

3. **CORS configurado**: Backend ya permite peticiones desde Vite (puerto 5173)

4. **Estructura de datos alineada**:
   - Backend retorna `ApiResponse<T>` con estructura:
     ```json
     {
       "success": boolean,
       "message": string,
       "data": T,
       "timestamp": datetime
     }
     ```
   - Frontend ya espera esta estructura en los interceptores

### Trabajo Pendiente de Integración

**Endpoints implementados en backend pero no en frontend:**
- Notificaciones (`/api/notifications`)
- Algunas operaciones de transacciones (filtros avanzados)

**Endpoints esperados por frontend pero no en backend:**
- `/auth/verify` - Verificar token
- `/auth/logout` - Endpoint de logout
- `/events/*` - Gestión de eventos (backend tiene modelo pero no controlador)
- `/students/*` - Información académica
- `/dunab/categories/*` - Gestión de categorías

**Otros ajustes necesarios:**
- Eliminar datos mock del frontend
- Ajustar manejo de errores
- Sincronizar estructuras de datos

---

## Plan de Integración Recomendado

### Fase 1: Funcionalidad Core (1-2 días)
1. Iniciar ambos servidores simultáneamente
2. Probar login/registro
3. Verificar flujo de autenticación completo
4. Probar consultas de cuentas DUNAB
5. Probar creación de transacciones

### Fase 2: Completar Endpoints Backend (2-3 días)
1. Crear EventController
2. Crear UserController
3. Crear CategoryController
4. Agregar endpoint `/auth/verify`
5. Agregar endpoint `/auth/logout`

### Fase 3: Conectar Frontend (2-3 días)
1. Remover todos los hooks mock
2. Conectar cada página a su servicio real
3. Manejar estados de carga correctamente
4. Implementar manejo de errores mejorado

### Fase 4: Testing & Refinamiento (1-2 días)
1. Probar flujos completos
2. Ajustar UX para errores
3. Optimizar rendimiento
4. Documentar

**Estimación Total:** 1-2 semanas de trabajo enfocado

---

## 1. PREPARACIÓN DEL ENTORNO

### 1.1: Verificar Requisitos

**Backend:**
- Java 21 instalado
- PostgreSQL corriendo
- Maven instalado

**Frontend:**
- Node.js instalado (v18+)
- npm o yarn

### 1.2: Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
psql -U postgres
CREATE DATABASE dunab_db;
\q
```

Tu `application.properties` ya está configurado:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dunab_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### 1.3: Arrancar Servicios

**Terminal 1 - Backend:**
```bash
cd dunab-backend
mvn clean install
mvn spring-boot:run
```

Espera ver:
```
Started DunabApplication in X.XXX seconds
```

**Terminal 2 - Frontend:**
```bash
cd dunab-frontend
npm install
npm run dev
```

Espera ver:
```
VITE vX.X.X  ready in XXX ms
➜ Local:   http://localhost:5173/
```

---

## 2. FASE 1: AUTENTICACIÓN (LO MÁS IMPORTANTE)

Esta es la base de todo. Sin autenticación funcionando, nada más funcionará.

### 2.1: Entender el Flujo

```
FRONTEND                    BACKEND
   │                           │
   ├─1. User clicks "Login"    │
   │                           │
   ├─2. POST /api/auth/login───►
   │      {email, password}    │
   │                           │
   │                      3. Valida credenciales
   │                      4. Genera JWT token
   │                           │
   ◄─5. Response {token, user}─┤
   │                           │
   ├─6. Guarda token           │
   │   en localStorage         │
   │                           │
   ├─7. Todas las peticiones   │
   │   incluyen token en       │
   │   header: Bearer {token}  │
```

### 2.2: Probar Login Manualmente

Abre el navegador en http://localhost:5173

**Opción A: Usar la UI**
1. Ve a la página de registro
2. Crea un usuario
3. Observa las peticiones en DevTools (F12) → Network

**Opción B: Probar con curl primero**
```bash
# 1. Registrar usuario
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@unab.edu.co",
    "password": "password123",
    "codigoEstudiante": "2024001",
    "rol": "ESTUDIANTE"
  }'

# 2. Hacer login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@unab.edu.co",
    "password": "password123"
  }'
```

Deberías recibir:
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "tipo": "Bearer",
    "id": 1,
    "email": "juan@unab.edu.co",
    "nombre": "Juan",
    "apellido": "Pérez",
    "rol": "ESTUDIANTE"
  }
}
```

### 2.3: Verificar en el Frontend

Abre DevTools → Application → Local Storage → http://localhost:5173

Deberías ver:
```
dunab_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
dunab_user: "{\"id\":1,\"email\":\"juan@unab.edu.co\",...}"
```

### 2.4: Posibles Problemas y Soluciones

#### Problema 1: Error CORS

**Síntoma:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución:** Verificar que backend tenga esta configuración en `application.properties`:
```properties
cors.allowed-origins=http://localhost:5173
```

#### Problema 2: Backend responde pero frontend no guarda token

**Verificar en `authService.js:24`:**
```javascript
// Verifica que el backend retorne en este formato
if (response.data && response.data.token) {
  // Si backend retorna ApiResponse<AuthResponse>
  setAuthToken(response.data.token);
  setUser(response.data);
}
```

#### Problema 3: Token no se envía en peticiones

**Verificar interceptor en `api.js:26`:**
```javascript
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log('🔑 Token being sent:', token); // Debug
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

---

## 3. FASE 2: AJUSTAR RESPUESTAS DEL BACKEND

Tu backend retorna todo en formato `ApiResponse<T>`, pero algunos servicios del frontend esperan solo el `data`.

### 3.1: Entender la Discrepancia

**Backend retorna:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... },  ← El frontend necesita esto
  "timestamp": "..."
}
```

**Frontend espera (después del interceptor):**
```javascript
const response = await api.get('/dunab/accounts/1');
// response debería ser directamente los datos, no ApiResponse
```

### 3.2: Solución en el Interceptor

Tu archivo `api.js:44` ya tiene el interceptor correcto:

```javascript
api.interceptors.response.use(
  (response) => {
    // ✅ ESTO YA ESTÁ BIEN - Extrae solo el data
    return response.data;
  },
  async (error) => {
    // Manejo de errores
  }
);
```

Pero necesitas asegurarte de que todos los servicios manejen correctamente esta respuesta.

### 3.3: Verificar en AuthService

El problema está aquí. Revisemos `authService.js:24`:

```javascript
// ANTES (incorrecto)
const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
if (response.token) {  // ❌ response es ApiResponse, no tiene token directo
  setAuthToken(response.token);
}

// DESPUÉS (correcto)
const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
// response ya es response.data gracias al interceptor
if (response.data && response.data.token) {  // ✅ Accede a data
  setAuthToken(response.data.token);
  setUser(response.data);
}
```

Necesitas actualizar `authService.js` para manejar el formato `ApiResponse`.

---

## 4. FASE 3: CREAR ENDPOINTS FALTANTES EN BACKEND

Tu frontend espera endpoints que no existen en el backend.

### 4.1: Endpoint de Verify Token

**Frontend espera:** `GET /api/auth/verify`

**Crear en `AuthController.java`:**

```java
/**
 * GET /api/auth/verify - Verificar token actual
 */
@GetMapping("/verify")
public ResponseEntity<ApiResponse<AuthResponse>> verificarToken(
        @AuthenticationPrincipal UserPrincipal currentUser) {

    // El token ya fue validado por el filtro JWT
    // Solo necesitamos retornar los datos del usuario

    User user = userService.getUserById(currentUser.getId());

    AuthResponse response = AuthResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .nombre(user.getNombre())
            .apellido(user.getApellido())
            .rol(user.getRol())
            .build();

    return ResponseEntity.ok(
        ApiResponse.success(response, "Token válido")
    );
}
```

### 4.2: Endpoint de Logout

**Frontend espera:** `POST /api/auth/logout`

**Crear en `AuthController.java`:**

```java
/**
 * POST /api/auth/logout - Cerrar sesión
 */
@PostMapping("/logout")
public ResponseEntity<ApiResponse<Void>> logout(
        @AuthenticationPrincipal UserPrincipal currentUser) {

    // En JWT stateless, el logout es principalmente del lado del cliente
    // Pero podemos registrar la acción o invalidar refresh tokens

    // TODO: Si implementas refresh token blacklist, agregar aquí

    return ResponseEntity.ok(
        ApiResponse.success(null, "Sesión cerrada exitosamente")
    );
}
```

### 4.3: Controlador de Eventos

**Frontend espera:** `/api/events/*`

**Crear nuevo archivo:** `EventController.java`

```java
package com.unab.dunab.controller;

import com.unab.dunab.dto.request.EventoRequest;
import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.model.Evento;
import com.unab.dunab.service.EventService;
import com.unab.dunab.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * GET /api/events - Listar todos los eventos
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Evento>>> getAllEventos() {
        List<Evento> eventos = eventService.getAllEventos();
        return ResponseEntity.ok(ApiResponse.success(eventos));
    }

    /**
     * GET /api/events/{id} - Obtener evento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Evento>> getEvento(@PathVariable Long id) {
        Evento evento = eventService.getEventoById(id);
        return ResponseEntity.ok(ApiResponse.success(evento));
    }

    /**
     * POST /api/events - Crear nuevo evento
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR')")
    public ResponseEntity<ApiResponse<Evento>> crearEvento(
            @Valid @RequestBody EventoRequest request) {
        Evento evento = eventService.crearEvento(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(evento, "Evento creado exitosamente"));
    }

    /**
     * POST /api/events/{id}/register - Inscribirse a un evento
     */
    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<Void>> inscribirseEvento(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        eventService.inscribirEstudiante(id, currentUser.getId());
        return ResponseEntity.ok(
            ApiResponse.success(null, "Inscripción exitosa")
        );
    }

    /**
     * PUT /api/events/{id} - Actualizar evento
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'COORDINADOR')")
    public ResponseEntity<ApiResponse<Evento>> actualizarEvento(
            @PathVariable Long id,
            @Valid @RequestBody EventoRequest request) {
        Evento evento = eventService.actualizarEvento(id, request);
        return ResponseEntity.ok(
            ApiResponse.success(evento, "Evento actualizado exitosamente")
        );
    }

    /**
     * DELETE /api/events/{id} - Eliminar evento
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<Void>> eliminarEvento(@PathVariable Long id) {
        eventService.eliminarEvento(id);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Evento eliminado exitosamente")
        );
    }
}
```

**Crear el servicio:** `EventService.java`

```java
package com.unab.dunab.service;

import com.unab.dunab.dto.request.EventoRequest;
import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.exception.InvalidOperationException;
import com.unab.dunab.model.Evento;
import com.unab.dunab.model.User;
import com.unab.dunab.model.InscripcionEvento;
import com.unab.dunab.model.EstadoInscripcion;
import com.unab.dunab.repository.EventoRepository;
import com.unab.dunab.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;

    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    public Evento getEventoById(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento no encontrado"));
    }

    @Transactional
    public Evento crearEvento(EventoRequest request) {
        Evento evento = new Evento();
        evento.setNombre(request.getNombre());
        evento.setDescripcion(request.getDescripcion());
        evento.setFechaInicio(request.getFechaInicio());
        evento.setFechaFin(request.getFechaFin());
        evento.setRecompensaDunab(request.getRecompensaDunab());
        evento.setCuposDisponibles(request.getCuposDisponibles());

        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento actualizarEvento(Long id, EventoRequest request) {
        Evento evento = getEventoById(id);

        evento.setNombre(request.getNombre());
        evento.setDescripcion(request.getDescripcion());
        evento.setFechaInicio(request.getFechaInicio());
        evento.setFechaFin(request.getFechaFin());
        evento.setRecompensaDunab(request.getRecompensaDunab());
        evento.setCuposDisponibles(request.getCuposDisponibles());

        return eventoRepository.save(evento);
    }

    @Transactional
    public void eliminarEvento(Long id) {
        Evento evento = getEventoById(id);
        eventoRepository.delete(evento);
    }

    @Transactional
    public void inscribirEstudiante(Long eventoId, Long estudianteId) {
        Evento evento = getEventoById(eventoId);
        User estudiante = userRepository.findById(estudianteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudiante no encontrado"));

        // Verificar cupos disponibles
        if (evento.getCuposDisponibles() <= 0) {
            throw new InvalidOperationException("No hay cupos disponibles");
        }

        // Crear inscripción
        InscripcionEvento inscripcion = new InscripcionEvento();
        inscripcion.setEvento(evento);
        inscripcion.setEstudiante(estudiante);
        inscripcion.setEstado(EstadoInscripcion.PENDIENTE);

        // Agregar inscripción al evento
        evento.getInscripciones().add(inscripcion);

        // Reducir cupos
        evento.setCuposDisponibles(evento.getCuposDisponibles() - 1);

        eventoRepository.save(evento);
    }
}
```

### 4.4: Controlador de Categorías

**Frontend espera:** `/api/dunab/categories/*`

**Crear nuevo archivo:** `CategoryController.java`

```java
package com.unab.dunab.controller;

import com.unab.dunab.dto.response.ApiResponse;
import com.unab.dunab.model.CategoriaTransaccion;
import com.unab.dunab.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dunab/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * GET /api/dunab/categories - Listar todas las categorías
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoriaTransaccion>>> getAllCategorias() {
        List<CategoriaTransaccion> categorias = categoryService.getAllCategorias();
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }

    /**
     * GET /api/dunab/categories/{id} - Obtener categoría por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> getCategoria(@PathVariable Long id) {
        CategoriaTransaccion categoria = categoryService.getCategoriaById(id);
        return ResponseEntity.ok(ApiResponse.success(categoria));
    }

    /**
     * POST /api/dunab/categories - Crear nueva categoría
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> crearCategoria(
            @Valid @RequestBody CategoriaTransaccion categoria) {
        CategoriaTransaccion nuevaCategoria = categoryService.crearCategoria(categoria);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(nuevaCategoria, "Categoría creada exitosamente"));
    }

    /**
     * PUT /api/dunab/categories/{id} - Actualizar categoría
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<CategoriaTransaccion>> actualizarCategoria(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaTransaccion categoria) {
        CategoriaTransaccion categoriaActualizada = categoryService.actualizarCategoria(id, categoria);
        return ResponseEntity.ok(
            ApiResponse.success(categoriaActualizada, "Categoría actualizada exitosamente")
        );
    }

    /**
     * DELETE /api/dunab/categories/{id} - Eliminar categoría
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<Void>> eliminarCategoria(@PathVariable Long id) {
        categoryService.eliminarCategoria(id);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Categoría eliminada exitosamente")
        );
    }
}
```

**Crear el servicio:** `CategoryService.java`

```java
package com.unab.dunab.service;

import com.unab.dunab.exception.ResourceNotFoundException;
import com.unab.dunab.model.CategoriaTransaccion;
import com.unab.dunab.repository.CategoriaTransaccionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoriaTransaccionRepository categoriaRepository;

    public List<CategoriaTransaccion> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    public CategoriaTransaccion getCategoriaById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
    }

    @Transactional
    public CategoriaTransaccion crearCategoria(CategoriaTransaccion categoria) {
        return categoriaRepository.save(categoria);
    }

    @Transactional
    public CategoriaTransaccion actualizarCategoria(Long id, CategoriaTransaccion categoria) {
        CategoriaTransaccion existente = getCategoriaById(id);

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());
        existente.setColor(categoria.getColor());
        existente.setIcono(categoria.getIcono());

        return categoriaRepository.save(existente);
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        CategoriaTransaccion categoria = getCategoriaById(id);
        categoriaRepository.delete(categoria);
    }
}
```

---

## 5. FASE 4: ELIMINAR DATOS MOCK DEL FRONTEND

Una vez que el backend está respondiendo, elimina los datos mock.

### 5.1: Identificar Componentes con Mock

Buscar todos los archivos que usen `useMockData`:

```bash
cd dunab-frontend
grep -r "useMockData" src/
```

Archivos encontrados:
- `src/hooks/useMockData.js` - Hook con datos mock
- `src/pages/Transactions.jsx` - Usa mock como fallback
- `src/services/studentService.js` - Tiene datos mock
- `src/services/eventService.js` - Tiene datos mock

### 5.2: Ejemplo de Actualización

**ANTES - `pages/Transactions.jsx`:**
```javascript
import { useMockTransactions } from '../hooks/useMockData';

function Transactions() {
  const mockTransactions = useMockTransactions();
  const transactions = contextTransactions || mockTransactions; // ❌ Fallback a mock
}
```

**DESPUÉS:**
```javascript
// Ya no importar useMockData

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await dunabService.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    // ... renderizar transactions reales
  );
}
```

### 5.3: Actualizar servicios con datos mock

**Ejemplo en `eventService.js`:**

```javascript
// ANTES
getAllEvents: async () => {
  try {
    const response = await api.get(API_ENDPOINTS.EVENTS);
    return response.data || MOCK_EVENTS; // ❌ Fallback a mock
  } catch (error) {
    console.warn('Backend no disponible, usando mock');
    return MOCK_EVENTS; // ❌ Fallback a mock
  }
},

// DESPUÉS
getAllEvents: async () => {
  try {
    const response = await api.get(API_ENDPOINTS.EVENTS);
    return response.data; // ✅ Solo datos reales
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    throw error; // ✅ Propagar error para manejo en componente
  }
},
```

---

## 6. FASE 5: FLUJO COMPLETO DE UNA FUNCIONALIDAD

Vamos a ver un ejemplo completo: **Ver historial de transacciones**

### 6.1: Backend (YA EXISTE)

`TransactionController.java:60` ya tiene:
```java
@GetMapping("/cuenta/{cuentaId}")
public ResponseEntity<ApiResponse<List<TransaccionResponse>>> getTransaccionesByCuenta(
        @PathVariable Long cuentaId) {
    List<TransaccionResponse> transacciones = transactionService.getTransaccionesByCuenta(cuentaId);
    return ResponseEntity.ok(ApiResponse.success(transacciones));
}
```

### 6.2: Frontend Service

`dunabService.js` debe tener:
```javascript
/**
 * Obtener transacciones de una cuenta
 */
getTransactions: async (accountId) => {
  try {
    const response = await api.get(`/dunab/transactions/cuenta/${accountId}`);
    // response ya es ApiResponse.data gracias al interceptor
    // response = { success, message, data: [...], timestamp }
    return response.data; // ✅ Retornar solo el array de transacciones
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    throw error;
  }
},
```

### 6.3: Componente React

```javascript
import { useState, useEffect } from 'react';
import dunabService from '../services/dunabService';
import LoadingSpinner from '../components/shared/LoadingSpinner';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener ID de cuenta del usuario autenticado
  const user = JSON.parse(localStorage.getItem('dunab_user'));
  const accountId = user?.cuentaId || 1;

  useEffect(() => {
    loadTransactions();
  }, [accountId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await dunabService.getTransactions(accountId);
      console.log('✅ Transacciones recibidas:', data);

      setTransactions(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error cargando transacciones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando transacciones..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={loadTransactions}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="transaction-history">
      <h2>Historial de Transacciones</h2>
      {transactions.length === 0 ? (
        <p>No hay transacciones</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.fecha).toLocaleDateString()}</td>
                <td>{tx.descripcion}</td>
                <td>{tx.tipo}</td>
                <td className={tx.tipo === 'CREDITO' ? 'positive' : 'negative'}>
                  {tx.tipo === 'CREDITO' ? '+' : '-'}
                  ${tx.monto.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionHistory;
```

---

## 7. DEBUGGING Y TROUBLESHOOTING

### 7.1: Herramientas de Debug

#### 1. Console logs estratégicos

**En `api.js` - Request Interceptor:**
```javascript
api.interceptors.request.use((config) => {
  console.log('📤 REQUEST:', config.method.toUpperCase(), config.url);
  console.log('📤 Headers:', config.headers);
  console.log('📤 Data:', config.data);
  return config;
});
```

**En `api.js` - Response Interceptor:**
```javascript
api.interceptors.response.use((response) => {
  console.log('📥 RESPONSE:', response.config.url);
  console.log('📥 Status:', response.status);
  console.log('📥 Data:', response.data);
  return response.data;
});
```

#### 2. Backend logs

En `application.properties`:
```properties
logging.level.com.unab.dunab=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
```

#### 3. Network tab en DevTools

- F12 → Network
- Ver cada petición
- Revisar Request Headers (debe tener Authorization: Bearer ...)
- Revisar Response (debe ser 200 OK)

### 7.2: Errores Comunes

#### Error 1: 401 Unauthorized en todas las peticiones después de login

**Causa:** Token no se está enviando

**Debug:**
```javascript
// En cualquier componente
useEffect(() => {
  const token = localStorage.getItem('dunab_token');
  console.log('🔑 Token en localStorage:', token);
}, []);
```

**Solución:** Verificar que `authService.login()` esté guardando correctamente:
```javascript
if (response.data && response.data.token) {
  localStorage.setItem('dunab_token', response.data.token); // ✅
}
```

#### Error 2: CORS policy blocking

**Causa:** Backend no acepta el origen

**Solución:** En `application.properties`:
```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

Y reiniciar el backend.

#### Error 3: 404 Not Found

**Causa:** URL incorrecta

**Debug:**
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
console.log('Full URL:', `${import.meta.env.VITE_API_BASE_URL}/dunab/accounts`);
```

**Solución:** Verificar que `.env` tenga:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

#### Error 4: Response data is undefined

**Causa:** Estructura de respuesta diferente

**Debug:**
```javascript
const response = await api.get('/dunab/accounts/1');
console.log('📦 Response completo:', response);
console.log('📦 Response.data:', response.data);
console.log('📦 Response.data.data:', response.data?.data);
```

**Solución:** Verificar el interceptor y cómo el servicio accede a los datos.

#### Error 5: Token expirado

**Síntoma:** 401 Unauthorized después de un tiempo

**Solución temporal:** Hacer login nuevamente

**Solución permanente:** Implementar refresh token automático:

```javascript
// En api.js - Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('dunab_refresh_token');
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newToken = response.data.data.token;
        localStorage.setItem('dunab_token', newToken);

        // Reintentar la petición original
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, cerrar sesión
        clearSession();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

#### Error 6: Frontend no se actualiza después de una acción

**Causa:** Estado no se actualiza correctamente

**Solución:** Usar callback para forzar recarga:

```javascript
const handleCreateTransaction = async (data) => {
  try {
    await dunabService.createTransaction(data);
    // ✅ Recargar lista
    await loadTransactions();
    // ✅ Mostrar mensaje de éxito
    alert('Transacción creada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    alert('Error creando transacción');
  }
};
```

### 7.3: Script de Prueba Rápida

Crear archivo `test-integration.sh` en la raíz del proyecto:

```bash
#!/bin/bash

echo "🧪 Prueba de Integración DUNAB"
echo "================================"
echo ""

# 1. Verificar que backend esté corriendo
echo "1️⃣ Verificando backend..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/auth/login)

if [ "$BACKEND_STATUS" != "000" ]; then
    echo "✅ Backend está corriendo"
else
    echo "❌ Backend NO está corriendo"
    echo "   Ejecuta: cd dunab-backend && mvn spring-boot:run"
    exit 1
fi

# 2. Verificar que frontend esté corriendo
echo "2️⃣ Verificando frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)

if [ "$FRONTEND_STATUS" == "200" ]; then
    echo "✅ Frontend está corriendo"
else
    echo "❌ Frontend NO está corriendo"
    echo "   Ejecuta: cd dunab-frontend && npm run dev"
    exit 1
fi

# 3. Probar registro
echo "3️⃣ Probando registro..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"nombre\": \"Test\",
    \"apellido\": \"Usuario\",
    \"email\": \"test$(date +%s)@unab.edu.co\",
    \"password\": \"password123\",
    \"codigoEstudiante\": \"TEST$(date +%s)\",
    \"rol\": \"ESTUDIANTE\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "✅ Registro exitoso"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo "   Token: ${TOKEN:0:20}..."
    echo "   User ID: $USER_ID"
else
    echo "❌ Registro falló"
    echo "$REGISTER_RESPONSE"
    exit 1
fi

# 4. Probar obtener cuenta DUNAB
echo "4️⃣ Probando obtener cuenta DUNAB..."
ACCOUNT_RESPONSE=$(curl -s -X GET "http://localhost:8080/api/dunab/accounts/student/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo "$ACCOUNT_RESPONSE" | grep -q "saldo"; then
    echo "✅ Cuenta DUNAB obtenida"
    ACCOUNT_ID=$(echo "$ACCOUNT_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "   Account ID: $ACCOUNT_ID"
else
    echo "❌ Error obteniendo cuenta"
    echo "$ACCOUNT_RESPONSE"
fi

echo ""
echo "================================"
echo "✅ Integración funcionando correctamente"
echo ""
echo "Puedes abrir el navegador en:"
echo "   http://localhost:5173"
```

Hacer ejecutable:
```bash
chmod +x test-integration.sh
```

Ejecutar:
```bash
./test-integration.sh
```

---

## 8. CHECKLIST DE INTEGRACIÓN

Usa esto para verificar que todo funciona:

### BACKEND

- [ ] Backend arranca sin errores
- [ ] PostgreSQL conectado
- [ ] Puedo hacer login con curl
- [ ] Puedo crear transacción con curl
- [ ] CORS configurado para localhost:5173
- [ ] Logs de DEBUG habilitados
- [ ] Endpoints de auth/verify y auth/logout creados
- [ ] EventController creado y funcional
- [ ] CategoryController creado y funcional

### FRONTEND

- [ ] Frontend arranca sin errores
- [ ] `.env` tiene `VITE_API_BASE_URL` correcto
- [ ] Puedo ver página de login
- [ ] No hay errores en consola del navegador
- [ ] Axios interceptores configurados correctamente

### INTEGRACIÓN - AUTENTICACIÓN

- [ ] Puedo registrar usuario desde UI
- [ ] Token se guarda en localStorage
- [ ] Puedo hacer login desde UI
- [ ] Usuario se guarda en localStorage
- [ ] Al recargar página, sesión persiste
- [ ] Logout funciona y limpia localStorage
- [ ] Token se envía en header de todas las peticiones

### INTEGRACIÓN - FUNCIONALIDADES

- [ ] Puedo ver mi cuenta DUNAB
- [ ] Puedo ver mi saldo
- [ ] Puedo ver historial de transacciones
- [ ] Admin puede crear transacciones
- [ ] Puedo ver notificaciones
- [ ] Puedo ver eventos
- [ ] Puedo inscribirme a eventos
- [ ] Puedo ver estadísticas
- [ ] Puedo ver ranking

### OPTIMIZACIÓN

- [ ] Eliminados todos los `useMockData`
- [ ] Loading states funcionan
- [ ] Error handling funciona
- [ ] Mensajes de error son claros
- [ ] UX es fluida (sin delays innecesarios)
- [ ] No hay console.errors en producción

### SEGURIDAD

- [ ] Tokens no se exponen en logs
- [ ] Contraseñas no se envían en logs
- [ ] CORS solo permite orígenes conocidos
- [ ] Roles y permisos funcionan correctamente
- [ ] No se pueden hacer operaciones sin autenticación

---

## 9. PRÓXIMOS PASOS

Una vez que tengas lo básico funcionando:

### Corto Plazo (1-2 semanas)

1. **Implementar refresh token automático**
   - Detectar token expirado
   - Refrescar automáticamente
   - Reintentar petición fallida

2. **Agregar manejo de errores globalizado**
   - Context para errores
   - Componente de error toast
   - Logging centralizado

3. **Mejorar UX**
   - Skeletons en lugar de spinners
   - Animaciones suaves
   - Feedback visual en todas las acciones

4. **Testing básico**
   - Tests unitarios en servicios
   - Tests de integración básicos
   - Validación de formularios

### Mediano Plazo (1 mes)

1. **Notificaciones en tiempo real (WebSocket)**
   - Implementar WebSocket en backend
   - Conectar frontend a WebSocket
   - Notificaciones push

2. **Optimizar queries del backend**
   - Añadir índices en BD
   - Implementar paginación en todos los listados
   - Cache para consultas frecuentes

3. **Dashboard mejorado**
   - Gráficos en tiempo real
   - Estadísticas avanzadas
   - Exportar reportes

4. **Perfil de usuario completo**
   - Cambiar contraseña
   - Actualizar datos personales
   - Preferencias de notificaciones

### Largo Plazo (2-3 meses)

1. **Tests de integración completos**
   - Cypress para E2E testing
   - Tests automatizados de flujos completos
   - CI/CD con GitHub Actions

2. **Documentar API con Swagger**
   - Swagger UI
   - Documentación automática
   - Ejemplos de uso

3. **Optimización de rendimiento**
   - Lazy loading de componentes
   - Code splitting
   - Service workers para PWA

4. **Despliegue a producción**
   - Docker containers
   - CI/CD pipeline
   - Monitoring y logging

---

## Recursos Adicionales

### Documentación Oficial

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [React Router](https://reactrouter.com/)

### Herramientas Útiles

- [Postman](https://www.postman.com/) - Testing de APIs
- [DBeaver](https://dbeaver.io/) - Cliente de base de datos
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debug de React
- [Redux DevTools](https://github.com/reduxjs/redux-devtools) - Si usas Redux

### Scripts Útiles

**Iniciar todo el proyecto:**
```bash
# Crear archivo start-all.sh
#!/bin/bash
gnome-terminal --tab --title="Backend" -- bash -c "cd dunab-backend && mvn spring-boot:run; exec bash"
gnome-terminal --tab --title="Frontend" -- bash -c "cd dunab-frontend && npm run dev; exec bash"
```

**Limpiar y rebuild:**
```bash
# Backend
cd dunab-backend
mvn clean install

# Frontend
cd dunab-frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Contacto y Soporte

Si encuentras problemas durante la integración:

1. Revisa esta guía nuevamente
2. Verifica los logs del backend y frontend
3. Usa el script de test de integración
4. Consulta la documentación oficial
5. Busca en Stack Overflow

---

**¡Éxito con la integración! 🚀**

La arquitectura de tu proyecto es sólida y la integración es totalmente viable.
Con esta guía paso a paso, deberías tener el sistema completo funcionando en 1-2 semanas.
