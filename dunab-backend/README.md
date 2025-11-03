# Sistema de Gestión de Dinero UNAB (DUNAB) - Backend

## Descripción

Backend del Sistema de Gestión de Moneda Virtual DUNAB para la Universidad. Implementado con Spring Boot y Java 17.

## Stack Tecnológico

- **Java**: 17
- **Spring Boot**: 3.2.0
- **Base de Datos**: PostgreSQL (producción) / H2 (desarrollo)
- **Seguridad**: Spring Security + JWT
- **Construcción**: Maven

## Estructura del Proyecto

```
dunab-backend/
├── src/
│   ├── main/
│   │   ├── java/com/unab/dunab/
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── service/          # Lógica de negocio
│   │   │   ├── repository/       # Repositorios JPA
│   │   │   ├── model/            # Entidades JPA
│   │   │   ├── dto/              # DTOs (request/response)
│   │   │   ├── config/           # Configuraciones
│   │   │   ├── security/         # Seguridad JWT
│   │   │   ├── exception/        # Excepciones personalizadas
│   │   │   ├── utils/            # Estructuras de datos (Queue, Stack)
│   │   │   └── DunabApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/                     # Pruebas unitarias
├── pom.xml
└── README.md
```

## Estructuras de Datos Implementadas

### 1. NotificationQueue (Cola - FIFO)
- **Ubicación**: `utils/NotificationQueue.java`
- **Uso**: Gestión de notificaciones del sistema
- **Operaciones**: enqueue, dequeue, peek, isEmpty, size

### 2. TransactionHistoryStack (Pila - LIFO)
- **Ubicación**: `utils/TransactionHistoryStack.java`
- **Uso**: Historial reciente de transacciones
- **Operaciones**: push, pop, peek, isEmpty, size, getRecent

## Requisitos Previos

- Java 17 o superior
- Maven 3.8+
- PostgreSQL 14+ (para producción)

## Instalación y Ejecución

### Modo Desarrollo (H2 en memoria)

```bash
# Compilar el proyecto
mvn clean install

# Ejecutar en modo desarrollo
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

La aplicación estará disponible en: `http://localhost:8080`
H2 Console disponible en: `http://localhost:8080/h2-console`

### Modo Producción (PostgreSQL)

1. Crear base de datos PostgreSQL:
```sql
CREATE DATABASE dunab_db;
```

2. Configurar credenciales en `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/dunab_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

3. Ejecutar:
```bash
mvn spring-boot:run
```

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Gestión DUNAB
- `GET /api/dunab/accounts/{id}` - Consultar cuenta
- `GET /api/dunab/accounts/{id}/balance` - Consultar saldo
- `POST /api/dunab/transactions` - Crear transacción
- `GET /api/dunab/transactions/student/{id}` - Historial de estudiante

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/{id}/read` - Marcar como leída

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events/{id}/register` - Inscribirse a evento

## Variables de Entorno

```bash
# JWT
JWT_SECRET=tu-secreto-jwt-muy-largo-y-seguro
JWT_EXPIRATION=86400000

# Base de datos
DB_URL=jdbc:postgresql://localhost:5432/dunab_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Desarrollo

### Ejecutar tests
```bash
mvn test
```

### Empaquetar aplicación
```bash
mvn package
```

El JAR se generará en: `target/dunab-backend-1.0.0.jar`

### Ejecutar JAR
```bash
java -jar target/dunab-backend-1.0.0.jar
```

## Características Implementadas

- ✅ CRUD completo de cuentas DUNAB
- ✅ CRUD completo de transacciones
- ✅ Sistema de notificaciones con Cola (Queue)
- ✅ Historial de transacciones con Pila (Stack)
- ✅ Autenticación JWT
- ✅ Validaciones de negocio
- ✅ Manejo de excepciones global
- ✅ Auditoría de transacciones

## Configuración de Seguridad

El sistema implementa 3 roles:
- **ESTUDIANTE**: Consultar su DUNAB, ver historial
- **COORDINADOR**: Asignar DUNAB por eventos
- **ADMINISTRADOR**: CRUD completo, gestión de usuarios

## Autor

Proyecto académico - Universidad UNAB
Fecha: Noviembre 2025
Versión: 1.0.0
