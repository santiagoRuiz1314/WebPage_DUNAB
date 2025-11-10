# Sistema de Gestión DUNAB (Dinero UNAB)

Sistema integral de gestión financiera para estudiantes universitarios, que permite administrar el dinero virtual de la universidad (DUNAB), realizar transacciones, inscribirse a eventos y hacer seguimiento académico.

## Tecnologías

### Backend
- **Framework**: Spring Boot 3.2.0
- **Lenguaje**: Java 21
- **Base de datos**: PostgreSQL 16 (Production) / H2 (Development)
- **Seguridad**: Spring Security + JWT
- **ORM**: Hibernate/JPA

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Internacionalización**: i18next
- **Gráficos**: Recharts

### Infraestructura
- **Contenedores**: Docker + Docker Compose
- **Base de datos**: PostgreSQL en Docker
- **Administración DB**: pgAdmin (opcional)

## Estructura del Proyecto

```
WebPage_DUNAB/
├── dunab-frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas principales
│   │   ├── services/            # Servicios API
│   │   ├── context/             # Context API
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utilidades
│   │   └── config/              # Configuración
│   ├── public/                  # Recursos estáticos
│   └── package.json
│
├── dunab-backend/               # API Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/unab/dunab/
│   │   │   │   ├── controller/  # REST Controllers
│   │   │   │   ├── service/     # Lógica de negocio
│   │   │   │   ├── repository/  # Acceso a datos
│   │   │   │   ├── model/       # Entidades
│   │   │   │   ├── dto/         # DTOs
│   │   │   │   ├── security/    # Configuración seguridad
│   │   │   │   ├── config/      # Configuración
│   │   │   │   └── exception/   # Manejo de excepciones
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/          # Scripts SQL
│   │   └── test/                # Tests
│   └── pom.xml
│
├── docker-compose.yml           # Configuración Docker
├── .gitignore                   # Archivos ignorados por Git
├── SETUP_GUIDE.md              # Guía de configuración
└── README.md                    # Este archivo
```

## Características Principales

### Autenticación y Autorización
- Sistema de registro de usuarios
- Login con JWT
- Roles: ESTUDIANTE, ADMIN, SUPER_ADMIN
- Gestión de sesiones seguras

### Gestión DUNAB
- Consulta de saldo
- Historial de transacciones
- Crear ingresos y egresos
- Categorización de transacciones
- Estadísticas y gráficos

### Sistema de Eventos
- Catálogo de eventos universitarios
- Inscripción a eventos
- Confirmación de asistencia
- Costo en DUNAB

### Notificaciones
- Centro de notificaciones
- Notificaciones en tiempo real
- Alertas de bajo saldo
- Confirmaciones de transacciones

### Seguimiento Académico
- Progreso de materias
- Materias disponibles
- Ruta de graduación

### Panel de Administración
- Gestión de usuarios
- Gestión de transacciones
- Gestión de eventos
- Generación de reportes

## Inicio Rápido

### Requisitos
- Docker Desktop
- Java 21+
- Node.js 18+
- Maven 3.8+

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd WebPage_DUNAB
```

2. **Iniciar Docker Desktop**

3. **Levantar base de datos**
```bash
docker-compose up -d postgres
```

4. **Iniciar Backend**
```bash
cd dunab-backend
./mvnw spring-boot:run
```

5. **Iniciar Frontend**
```bash
cd dunab-frontend
npm install
npm run dev
```

6. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api
- pgAdmin: http://localhost:5050

Para más detalles, consulta [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Refrescar token

### DUNAB
- `GET /api/dunab/accounts` - Obtener cuentas
- `GET /api/dunab/accounts/{id}/balance` - Consultar saldo
- `GET /api/dunab/transactions` - Listar transacciones
- `POST /api/dunab/transactions` - Crear transacción
- `GET /api/dunab/statistics` - Obtener estadísticas

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/{id}` - Detalle de evento
- `POST /api/events/{id}/register` - Inscribirse a evento
- `POST /api/events/{id}/confirm` - Confirmar asistencia

### Notificaciones
- `GET /api/notifications` - Listar notificaciones
- `PUT /api/notifications/{id}/read` - Marcar como leída

## Variables de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dunab_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
SERVER_PORT=8080
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=DUNAB System
VITE_ENABLE_MOCK=false
VITE_DEBUG=true
```

## Desarrollo

### Backend

```bash
# Compilar
./mvnw clean install

# Ejecutar tests
./mvnw test

# Ejecutar con perfil dev (H2)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **CuentaDunab**: Cuenta de dinero DUNAB del estudiante
- **Transaccion**: Transacciones (ingresos/egresos)
- **CategoriaTransaccion**: Categorías de transacciones
- **Evento**: Eventos universitarios
- **InscripcionEvento**: Inscripciones a eventos
- **Notificacion**: Notificaciones del sistema
- **Materia**: Materias académicas

### Esquema

El esquema de base de datos se genera automáticamente con Hibernate. Para ver las tablas:

```bash
docker exec -it dunab-postgres psql -U postgres -d dunab_db
\dt
```

## Seguridad

- Autenticación basada en JWT
- Contraseñas hasheadas con BCrypt
- CORS configurado
- Validación de entrada en backend
- Protección contra SQL Injection
- XSS prevention

## Internacionalización

El frontend soporta múltiples idiomas:
- Español (es)
- Inglés (en)

Archivos de traducción en: `dunab-frontend/public/locales/`

## Testing

### Backend
```bash
cd dunab-backend
./mvnw test
```

### Frontend
```bash
cd dunab-frontend
npm run test
```

## Despliegue

### Backend
```bash
cd dunab-backend
./mvnw clean package
java -jar target/dunab-backend-1.0.0.jar
```

### Frontend
```bash
cd dunab-frontend
npm run build
# Los archivos están en dist/
```

## Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Equipo

Desarrollado para la Universidad Autónoma de Bucaramanga (UNAB).

## Soporte

Para reportar problemas o solicitar características, abre un issue en el repositorio.
