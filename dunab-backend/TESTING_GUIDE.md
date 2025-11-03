# 🧪 Guía de Testing - DUNAB Backend

## 📋 Script de Pruebas Automatizadas

He creado un script completo para probar todos los endpoints del backend de manera automatizada.

---

## 🚀 Inicio Rápido

### Paso 1: Iniciar el servidor

```bash
cd "/Users/davidruiz/Development/Estr datos/dunab-backend"
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Espera a ver este mensaje:
```
Started DunabApplication in X.XXX seconds
```

### Paso 2: En otra terminal, ejecutar las pruebas

#### Opción A: Todas las pruebas de una vez
```bash
./test-endpoints.sh --all
```

#### Opción B: Flujo completo paso a paso
```bash
./test-endpoints.sh --flow
```

#### Opción C: Menú interactivo
```bash
./test-endpoints.sh
```

---

## 📊 ¿Qué prueba el script?

### ✅ Tests incluidos:

1. **Registro de Usuario** (`POST /api/auth/register`)
   - Crea un usuario nuevo
   - Obtiene token JWT
   - Crea automáticamente cuenta DUNAB

2. **Login** (`POST /api/auth/login`)
   - Autentica con email/password
   - Retorna token JWT

3. **Obtener Cuenta DUNAB** (`GET /api/dunab/accounts/student/{id}`)
   - Obtiene cuenta del estudiante
   - Verifica saldo inicial

4. **Consultar Saldo** (`GET /api/dunab/accounts/{id}/balance`)
   - Obtiene saldo actual de la cuenta

5. **Crear Transacción** (`POST /api/dunab/transactions`)
   - Crea transacción de crédito
   - Requiere rol ADMINISTRADOR/COORDINADOR

6. **Historial de Transacciones** (`GET /api/dunab/transactions/cuenta/{id}`)
   - Lista todas las transacciones de una cuenta

7. **Transacciones Recientes** (`GET /api/dunab/transactions/cuenta/{id}/recientes`)
   - Obtiene las últimas N transacciones desde el Stack

8. **Obtener Notificaciones** (`GET /api/notifications`)
   - Lista notificaciones del usuario

9. **Contar No Leídas** (`GET /api/notifications/count`)
   - Cuenta notificaciones no leídas

10. **Ranking** (`GET /api/dunab/ranking`)
    - Obtiene ranking de estudiantes por saldo

11. **Estadísticas** (`GET /api/dunab/statistics`)
    - Obtiene estadísticas generales del sistema

12. **Refresh Token** (`POST /api/auth/refresh`)
    - Refresca el token de acceso

---

## 🎯 Flujo de Prueba Completo

El flujo `--flow` ejecuta este escenario:

```
1. ✓ Registrar usuario estudiante
2. ✓ Obtener cuenta DUNAB automática
3. ✓ Consultar saldo inicial (0.00)
4. ✓ Registrar usuario administrador
5. ✓ Crear transacción de crédito (+100.00)
6. ✓ Consultar nuevo saldo (100.00)
7. ✓ Ver historial de transacciones
8. ✓ Ver notificaciones generadas
9. ✓ Mostrar resumen
```

---

## 📝 Ejemplo de Output

```bash
================================================
  TEST 1: REGISTRO DE USUARIO
================================================

Testing: Registrar nuevo usuario
Endpoint: POST /api/auth/register
Response Status: 201
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tipo": "Bearer",
    "id": 1,
    "email": "test1730598234@unab.edu.co",
    "nombre": "Test",
    "apellido": "Usuario",
    "rol": "ESTUDIANTE"
  },
  "timestamp": "2025-11-02T15:30:34.567"
}
✓ Registrar nuevo usuario

Token obtenido: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
User ID: 1
```

---

## 🛠️ Requisitos

### Obligatorios:
- ✅ `curl` - Para hacer requests HTTP
  ```bash
  # Verificar instalación
  curl --version
  ```

### Opcionales (recomendados):
- ✅ `jq` - Para formatear JSON
  ```bash
  # macOS
  brew install jq

  # Linux
  sudo apt install jq

  # Verificar
  jq --version
  ```

Sin `jq`, el script funciona pero los JSON no se verán formateados.

---

## 🔍 Pruebas Manuales con curl

Si prefieres probar manualmente, aquí están los comandos:

### 1. Registrar usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@unab.edu.co",
    "password": "password123",
    "codigoEstudiante": "2024001",
    "rol": "ESTUDIANTE"
  }' | jq
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@unab.edu.co",
    "password": "password123"
  }' | jq
```

Guarda el token que recibes:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Obtener cuenta DUNAB
```bash
curl -X GET http://localhost:8080/api/dunab/accounts/student/1 \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 4. Consultar saldo
```bash
curl -X GET http://localhost:8080/api/dunab/accounts/1/balance \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 5. Crear transacción (como admin)
```bash
# Primero registra un admin
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@unab.edu.co",
    "password": "admin123",
    "codigoEstudiante": "ADMIN001",
    "rol": "ADMINISTRADOR"
  }' | jq

# Guarda el token del admin
ADMIN_TOKEN="..."

# Crea transacción
curl -X POST http://localhost:8080/api/dunab/transactions \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cuentaId": 1,
    "tipo": "CREDITO",
    "monto": 100.00,
    "descripcion": "Bono de bienvenida"
  }' | jq
```

### 6. Ver historial
```bash
curl -X GET http://localhost:8080/api/dunab/transactions/cuenta/1 \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 7. Ver notificaciones
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer $TOKEN" | jq
```

### 8. Ver ranking
```bash
curl -X GET http://localhost:8080/api/dunab/ranking \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🐛 Troubleshooting

### Error: "Servidor NO está corriendo"
**Solución:**
```bash
# Inicia el servidor
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Error: "Permission denied"
**Solución:**
```bash
chmod +x test-endpoints.sh
```

### Error: "curl: command not found"
**Solución:**
```bash
# macOS
brew install curl

# Linux
sudo apt install curl
```

### Error: "jq: command not found"
**No es crítico**, pero para instalarlo:
```bash
# macOS
brew install jq

# Linux
sudo apt install jq
```

### Error 401: Unauthorized
**Causa:** Token expirado o inválido

**Solución:** Ejecuta login nuevamente para obtener nuevo token

### Error 403: Forbidden
**Causa:** El usuario no tiene el rol necesario

**Solución:** Crea un usuario con rol ADMINISTRADOR o COORDINADOR

### Error 404: Not Found
**Causa:** El ID no existe en la base de datos

**Solución:** Verifica que el ID sea correcto

---

## 📚 Endpoints Disponibles - Resumen

### Autenticación
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| POST | `/api/auth/refresh` | Refrescar token | Público |

### Cuentas DUNAB
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/dunab/accounts` | Crear cuenta | ADMIN |
| GET | `/api/dunab/accounts/{id}` | Consultar cuenta | Cualquiera |
| GET | `/api/dunab/accounts/student/{id}` | Cuenta por estudiante | Cualquiera |
| GET | `/api/dunab/accounts/{id}/balance` | Consultar saldo | Cualquiera |
| GET | `/api/dunab/accounts` | Listar todas | ADMIN/COORD |
| GET | `/api/dunab/ranking` | Ranking | Cualquiera |
| PUT | `/api/dunab/accounts/{id}/limite` | Actualizar límite | ADMIN |
| PUT | `/api/dunab/accounts/{id}/estado` | Cambiar estado | ADMIN |
| PUT | `/api/dunab/accounts/{id}/suspender` | Suspender | ADMIN |
| PUT | `/api/dunab/accounts/{id}/activar` | Activar | ADMIN |
| GET | `/api/dunab/statistics` | Estadísticas | ADMIN/COORD |
| DELETE | `/api/dunab/accounts/{id}` | Eliminar | ADMIN |

### Transacciones
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| POST | `/api/dunab/transactions` | Crear transacción | ADMIN/COORD |
| GET | `/api/dunab/transactions/{id}` | Consultar | Cualquiera |
| GET | `/api/dunab/transactions/cuenta/{id}` | Historial | Cualquiera |
| GET | `/api/dunab/transactions/cuenta/{id}/recientes` | Recientes (Stack) | Cualquiera |
| DELETE | `/api/dunab/transactions/{id}/anular` | Anular | ADMIN |

### Notificaciones
| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/api/notifications` | Mis notificaciones | Cualquiera |
| GET | `/api/notifications/unread` | No leídas | Cualquiera |
| GET | `/api/notifications/count` | Contador | Cualquiera |
| PUT | `/api/notifications/{id}/read` | Marcar leída | Cualquiera |
| DELETE | `/api/notifications/{id}` | Eliminar | Cualquiera |

---

## ✅ Checklist de Verificación

Antes de comenzar con el frontend, verifica que:

- [ ] El servidor arranca sin errores
- [ ] El script de test ejecuta sin errores
- [ ] Registro de usuario funciona (201)
- [ ] Login funciona (200)
- [ ] Se obtiene token JWT
- [ ] Cuenta DUNAB se crea automáticamente
- [ ] Consulta de saldo funciona
- [ ] Creación de transacción funciona
- [ ] Notificaciones se crean automáticamente
- [ ] Ranking funciona
- [ ] No hay errores de CORS

Si todos los checks pasan, **tu backend está listo para el frontend**! 🎉

---

## 🎯 Próximos Pasos

Una vez que todas las pruebas pasen:

1. ✅ Backend verificado
2. 🚀 Iniciar desarrollo del frontend
3. 🔗 Conectar frontend con estos endpoints
4. 🎨 Crear UI para cada funcionalidad

**¡Estás listo para empezar con el frontend!**
