# DUNAB Frontend - Sistema de Gestión de Dinero UNAB

Frontend del sistema de gestión de moneda virtual institucional "DUNAB" para la Universidad Autónoma de Bucaramanga (UNAB).

## 🚀 Tecnologías

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **i18next** - Internacionalización
- **Context API** - Gestión de estado global

## 📁 Estructura del Proyecto

```
dunab-frontend/
├── src/
│   ├── assets/          # Recursos estáticos (imágenes, iconos)
│   ├── components/      # Componentes React
│   │   ├── academic/    # Componentes académicos
│   │   ├── dunab/       # Componentes del sistema DUNAB
│   │   ├── events/      # Componentes de eventos
│   │   ├── layout/      # Componentes de layout (Header, Footer, Sidebar)
│   │   ├── notifications/ # Componentes de notificaciones
│   │   └── shared/      # Componentes compartidos
│   ├── config/          # Configuraciones (API, i18n)
│   ├── context/         # Context API providers
│   │   ├── AuthContext.jsx
│   │   ├── DunabContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/           # Custom hooks
│   ├── locales/         # Archivos de traducción (i18n)
│   │   ├── es/
│   │   └── en/
│   ├── pages/           # Páginas principales
│   ├── routes/          # Configuración de rutas
│   ├── services/        # Servicios API
│   ├── styles/          # Estilos globales y variables CSS
│   ├── utils/           # Utilidades y helpers
│   ├── App.jsx          # Componente principal
│   └── main.jsx         # Punto de entrada
├── .env.example         # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── vite.config.js
```

## 🎯 Componentes Principales

### Contextos (Context API)

#### AuthContext
- Gestión de autenticación y autorización
- Login, logout, registro
- Control de sesión y tokens JWT

#### DunabContext
- Gestión del sistema DUNAB
- Balance, transacciones, estadísticas
- CRUD de transacciones

#### ThemeContext
- Modo oscuro/claro
- Persistencia de preferencias

#### NotificationContext
- Sistema de notificaciones (Queue - FIFO)
- Gestión de notificaciones en tiempo real

### Componentes DUNAB

- **DunabWallet**: Wallet principal con balance y estadísticas
- **BalanceCard**: Tarjeta de saldo actual
- **QuickStats**: Estadísticas rápidas
- **RecentTransactions**: Transacciones recientes (Stack - LIFO)
- **TransactionHistory**: Historial completo con filtros
- **TransactionTable**: Tabla de transacciones con paginación
- **FilterBar**: Barra de filtros avanzados
- **CreateTransaction**: Formulario para crear transacciones (Admin)
- **DunabManagement**: Panel de administración DUNAB
- **CategoryManagement**: Gestión de categorías

### Componentes de Layout

- **Header**: Header con balance DUNAB, notificaciones, selector de idioma
- **Sidebar**: Navegación lateral
- **Footer**: Footer de la aplicación
- **Layout**: Componente wrapper principal

### Componentes Compartidos

- **DunabAmount**: Formateo de montos DUNAB
- **TransactionCard**: Tarjeta de transacción
- **StatCard**: Tarjeta de estadística
- **DataTable**: Tabla de datos con paginación
- **LanguageSelector**: Selector de idioma
- **ThemeToggle**: Toggle de tema oscuro/claro
- **LoadingSpinner**: Spinner de carga

### Páginas

- **Dashboard**: Dashboard principal
- **Login**: Página de inicio de sesión
- **Register**: Página de registro
- **Profile**: Perfil de usuario
- **Events**: Catálogo de eventos
- **Transactions**: Historial de transacciones
- **AdminPanel**: Panel de administración
- **NotFound**: Página 404

## 🔧 Servicios API

### authService
- login, register, logout
- Gestión de tokens JWT

### dunabService
- CRUD completo de cuentas DUNAB
- CRUD de transacciones
- Estadísticas y reportes
- Gestión de categorías

### studentService
- CRUD de estudiantes
- Progreso académico

### eventService
- CRUD de eventos
- Inscripción y confirmación de asistencia

### notificationService
- Obtener notificaciones (Queue)
- Marcar como leída
- Eliminar notificación

## 🌐 Internacionalización (i18n)

El proyecto soporta múltiples idiomas:
- **Español (es)** - Idioma por defecto
- **Inglés (en)**

Los archivos de traducción se encuentran en `/src/locales`.

## 🎨 Temas

El proyecto soporta temas claro y oscuro:
- Variables CSS en `/src/styles/variables.css`
- Toggle de tema en el header
- Persistencia de preferencia en localStorage

## 📦 Instalación y Uso

### Instalación de dependencias

```bash
npm install
```

### Variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=DUNAB
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

### Desarrollo

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

### Preview de producción

```bash
npm run preview
```

## 🔑 Roles de Usuario

El sistema maneja tres roles:

1. **STUDENT (Estudiante)**
   - Ver su balance DUNAB
   - Ver historial de transacciones
   - Inscribirse a eventos
   - Ver progreso académico

2. **ADMIN (Administrador)**
   - CRUD completo de DUNAB
   - Gestión de usuarios
   - Reportes generales
   - Todas las operaciones

3. **COORDINATOR (Coordinador)**
   - Asignar DUNAB por eventos/actividades
   - Consultas avanzadas
   - Gestión de eventos

## 📊 Estructuras de Datos

### Queue (Cola) - Notificaciones
Sistema FIFO para gestión de notificaciones:
- Nuevas notificaciones se agregan al final
- Se procesan en orden de llegada
- Implementado en NotificationContext

### Stack (Pila) - Transacciones Recientes
Sistema LIFO para historial reciente:
- Últimas transacciones al tope
- Rápido acceso a transacciones recientes
- Implementado en RecentTransactions component

## 🔒 Seguridad

- Autenticación JWT
- Rutas protegidas con ProtectedRoute
- Validación de permisos por rol
- Sanitización de inputs
- Interceptores de Axios para manejo de tokens

## 📝 Convenciones de Código

- Componentes en PascalCase (ej: `DunabWallet.jsx`)
- Archivos de utilidades en camelCase (ej: `formatters.js`)
- Constantes en UPPER_SNAKE_CASE
- Hooks personalizados con prefijo `use` (ej: `useDebounce`)

## 🚧 Estado Actual

Este proyecto contiene la **estructura base** del frontend. Todos los componentes, servicios y contextos están creados como archivos vacíos con:
- Esqueleto de funciones
- Comentarios TODO
- Estructura básica
- Imports y exports

## 📋 Próximos Pasos

1. Implementar lógica de autenticación
2. Implementar servicios API
3. Implementar componentes de DUNAB
4. Integrar con backend
5. Agregar estilos específicos
6. Implementar testing

## 🤝 Contribución

Este proyecto es parte del Sistema de Gestión DUNAB de la UNAB.

## 📄 Licencia

Proyecto académico - UNAB 2025
