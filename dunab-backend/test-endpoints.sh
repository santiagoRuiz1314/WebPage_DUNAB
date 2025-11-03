#!/bin/bash

# Script de prueba automatizada de endpoints DUNAB Backend
# Autor: Sistema DUNAB
# Fecha: 2025-11-02

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables globales
BASE_URL="http://localhost:8080"
TOKEN=""
REFRESH_TOKEN=""
USER_ID=""
CUENTA_ID=""
TRANSACCION_ID=""

# Contador de pruebas
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para imprimir encabezados
print_header() {
    echo -e "\n${BLUE}================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================${NC}\n"
}

# Función para imprimir resultado de test
print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗${NC} $2"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Función para hacer request y verificar
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local description=$5
    local auth_header=""

    if [ ! -z "$TOKEN" ]; then
        auth_header="Authorization: Bearer $TOKEN"
    fi

    echo -e "${YELLOW}Testing:${NC} $description"
    echo -e "${YELLOW}Endpoint:${NC} $method $endpoint"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -H "$auth_header" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -H "$auth_header" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi

    # Separar body y status code
    body=$(echo "$response" | sed '$d')
    status=$(echo "$response" | tail -n1)

    echo -e "${YELLOW}Response Status:${NC} $status"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"

    if [ "$status" -eq "$expected_status" ]; then
        print_test 0 "$description"
        echo "$body"
        return 0
    else
        print_test 1 "$description (Expected: $expected_status, Got: $status)"
        return 1
    fi
}

# Verificar que el servidor esté corriendo
check_server() {
    print_header "VERIFICANDO SERVIDOR"

    echo "Verificando que el servidor esté en $BASE_URL..."

    if curl -s --max-time 5 "$BASE_URL/api/auth/login" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Servidor está corriendo"
        return 0
    else
        echo -e "${RED}✗${NC} Servidor NO está corriendo"
        echo -e "${YELLOW}Por favor, inicia el servidor con:${NC}"
        echo -e "  mvn spring-boot:run -Dspring-boot.run.profiles=dev"
        exit 1
    fi
}

# Test 1: Registro de usuario
test_register() {
    print_header "TEST 1: REGISTRO DE USUARIO"

    local timestamp=$(date +%s)
    local email="test${timestamp}@unab.edu.co"

    local data=$(cat <<EOF
{
  "nombre": "Test",
  "apellido": "Usuario",
  "email": "$email",
  "password": "password123",
  "codigoEstudiante": "TEST${timestamp}",
  "rol": "ESTUDIANTE"
}
EOF
)

    response=$(make_request "POST" "/api/auth/register" "$data" 201 "Registrar nuevo usuario")

    if [ $? -eq 0 ]; then
        TOKEN=$(echo "$response" | jq -r '.data.token')
        REFRESH_TOKEN=$(echo "$response" | jq -r '.data.refreshToken')
        USER_ID=$(echo "$response" | jq -r '.data.id')

        echo -e "\n${GREEN}Token obtenido:${NC} ${TOKEN:0:50}..."
        echo -e "${GREEN}User ID:${NC} $USER_ID"
    fi
}

# Test 2: Login
test_login() {
    print_header "TEST 2: LOGIN"

    # Primero registramos un usuario para login
    local timestamp=$(date +%s)
    local email="login${timestamp}@unab.edu.co"
    local password="password123"

    # Registro
    local register_data=$(cat <<EOF
{
  "nombre": "Login",
  "apellido": "Test",
  "email": "$email",
  "password": "$password",
  "codigoEstudiante": "LOGIN${timestamp}",
  "rol": "ESTUDIANTE"
}
EOF
)

    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$register_data" \
        "$BASE_URL/api/auth/register" > /dev/null

    # Login
    local login_data=$(cat <<EOF
{
  "email": "$email",
  "password": "$password"
}
EOF
)

    response=$(make_request "POST" "/api/auth/login" "$login_data" 200 "Login con credenciales correctas")

    if [ $? -eq 0 ]; then
        TOKEN=$(echo "$response" | jq -r '.data.token')
        USER_ID=$(echo "$response" | jq -r '.data.id')
        echo -e "\n${GREEN}Login exitoso. Token actualizado.${NC}"
    fi
}

# Test 3: Obtener cuenta DUNAB del estudiante
test_get_cuenta() {
    print_header "TEST 3: OBTENER CUENTA DUNAB"

    if [ -z "$USER_ID" ]; then
        echo -e "${RED}Error: USER_ID no definido. Ejecuta test_register primero.${NC}"
        return 1
    fi

    response=$(make_request "GET" "/api/dunab/accounts/student/$USER_ID" "" 200 "Obtener cuenta DUNAB por estudiante")

    if [ $? -eq 0 ]; then
        CUENTA_ID=$(echo "$response" | jq -r '.data.id')
        echo -e "\n${GREEN}Cuenta ID:${NC} $CUENTA_ID"
    fi
}

# Test 4: Consultar saldo
test_get_balance() {
    print_header "TEST 4: CONSULTAR SALDO"

    if [ -z "$CUENTA_ID" ]; then
        echo -e "${RED}Error: CUENTA_ID no definido.${NC}"
        return 1
    fi

    make_request "GET" "/api/dunab/accounts/$CUENTA_ID/balance" "" 200 "Consultar saldo de cuenta"
}

# Test 5: Crear transacción (requiere admin/coordinador)
test_create_transaction() {
    print_header "TEST 5: CREAR TRANSACCIÓN"

    # Registrar un admin
    local timestamp=$(date +%s)
    local admin_email="admin${timestamp}@unab.edu.co"

    local admin_data=$(cat <<EOF
{
  "nombre": "Admin",
  "apellido": "Test",
  "email": "$admin_email",
  "password": "password123",
  "codigoEstudiante": "ADMIN${timestamp}",
  "rol": "ADMINISTRADOR"
}
EOF
)

    admin_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$admin_data" \
        "$BASE_URL/api/auth/register")

    ADMIN_TOKEN=$(echo "$admin_response" | jq -r '.data.token')
    TOKEN=$ADMIN_TOKEN

    if [ -z "$CUENTA_ID" ]; then
        echo -e "${RED}Error: CUENTA_ID no definido.${NC}"
        return 1
    fi

    local trans_data=$(cat <<EOF
{
  "cuentaId": $CUENTA_ID,
  "tipo": "CREDITO",
  "monto": 100.00,
  "descripcion": "Bono de prueba"
}
EOF
)

    response=$(make_request "POST" "/api/dunab/transactions" "$trans_data" 201 "Crear transacción de crédito")

    if [ $? -eq 0 ]; then
        TRANSACCION_ID=$(echo "$response" | jq -r '.data.id')
        echo -e "\n${GREEN}Transacción ID:${NC} $TRANSACCION_ID"
    fi
}

# Test 6: Obtener historial de transacciones
test_get_transactions() {
    print_header "TEST 6: HISTORIAL DE TRANSACCIONES"

    if [ -z "$CUENTA_ID" ]; then
        echo -e "${RED}Error: CUENTA_ID no definido.${NC}"
        return 1
    fi

    make_request "GET" "/api/dunab/transactions/cuenta/$CUENTA_ID" "" 200 "Obtener historial de transacciones"
}

# Test 7: Obtener transacciones recientes (desde Stack)
test_get_recent_transactions() {
    print_header "TEST 7: TRANSACCIONES RECIENTES (STACK)"

    if [ -z "$CUENTA_ID" ]; then
        echo -e "${RED}Error: CUENTA_ID no definido.${NC}"
        return 1
    fi

    make_request "GET" "/api/dunab/transactions/cuenta/$CUENTA_ID/recientes?limit=5" "" 200 "Obtener transacciones recientes desde Stack"
}

# Test 8: Obtener notificaciones
test_get_notifications() {
    print_header "TEST 8: OBTENER NOTIFICACIONES"

    make_request "GET" "/api/notifications" "" 200 "Obtener notificaciones del usuario"
}

# Test 9: Contar notificaciones no leídas
test_count_unread_notifications() {
    print_header "TEST 9: CONTAR NOTIFICACIONES NO LEÍDAS"

    make_request "GET" "/api/notifications/count" "" 200 "Contar notificaciones no leídas"
}

# Test 10: Obtener ranking
test_get_ranking() {
    print_header "TEST 10: RANKING DE ESTUDIANTES"

    make_request "GET" "/api/dunab/ranking" "" 200 "Obtener ranking de estudiantes por saldo"
}

# Test 11: Obtener estadísticas generales
test_get_statistics() {
    print_header "TEST 11: ESTADÍSTICAS GENERALES"

    # Necesitamos token de admin
    make_request "GET" "/api/dunab/statistics" "" 200 "Obtener estadísticas generales del sistema"
}

# Test 12: Refresh token
test_refresh_token() {
    print_header "TEST 12: REFRESH TOKEN"

    if [ -z "$REFRESH_TOKEN" ]; then
        echo -e "${YELLOW}Refresh token no disponible, saltando test...${NC}"
        return
    fi

    make_request "POST" "/api/auth/refresh?refreshToken=$REFRESH_TOKEN" "" 200 "Refrescar token de acceso"
}

# Función para mostrar resumen
print_summary() {
    print_header "RESUMEN DE PRUEBAS"

    echo -e "Total de pruebas: ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Pruebas exitosas: ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Pruebas fallidas: ${RED}$FAILED_TESTS${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "\n${GREEN}¡Todas las pruebas pasaron! ✓${NC}"
        echo -e "${GREEN}El backend está listo para el frontend.${NC}"
    else
        echo -e "\n${YELLOW}Algunas pruebas fallaron. Revisa los logs arriba.${NC}"
    fi
}

# Menú principal
show_menu() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  DUNAB Backend - Test Automatizado        ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

    echo "Selecciona una opción:"
    echo "  1) Ejecutar TODAS las pruebas"
    echo "  2) Test individual: Registro"
    echo "  3) Test individual: Login"
    echo "  4) Test individual: Obtener cuenta DUNAB"
    echo "  5) Test individual: Consultar saldo"
    echo "  6) Test individual: Crear transacción"
    echo "  7) Test individual: Historial de transacciones"
    echo "  8) Test individual: Transacciones recientes (Stack)"
    echo "  9) Test individual: Notificaciones"
    echo " 10) Test individual: Ranking"
    echo " 11) Test individual: Estadísticas"
    echo " 12) Ejecutar flujo completo (Registro → Transacción → Consultas)"
    echo "  0) Salir"
    echo ""
}

# Ejecutar todas las pruebas
run_all_tests() {
    check_server
    test_register
    test_login
    test_get_cuenta
    test_get_balance
    test_create_transaction
    test_get_transactions
    test_get_recent_transactions
    test_get_notifications
    test_count_unread_notifications
    test_get_ranking
    test_get_statistics
    test_refresh_token
    print_summary
}

# Flujo completo
run_complete_flow() {
    print_header "FLUJO COMPLETO DE PRUEBAS"

    check_server

    echo -e "\n${YELLOW}Paso 1:${NC} Registrando usuario..."
    test_register

    echo -e "\n${YELLOW}Paso 2:${NC} Obteniendo cuenta DUNAB..."
    test_get_cuenta

    echo -e "\n${YELLOW}Paso 3:${NC} Consultando saldo inicial..."
    test_get_balance

    echo -e "\n${YELLOW}Paso 4:${NC} Creando transacción de crédito..."
    test_create_transaction

    echo -e "\n${YELLOW}Paso 5:${NC} Consultando nuevo saldo..."
    test_get_balance

    echo -e "\n${YELLOW}Paso 6:${NC} Consultando historial..."
    test_get_transactions

    echo -e "\n${YELLOW}Paso 7:${NC} Obteniendo notificaciones..."
    test_get_notifications

    print_summary
}

# Verificar dependencias
check_dependencies() {
    command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl no está instalado.${NC}" >&2; exit 1; }
    command -v jq >/dev/null 2>&1 || { echo -e "${YELLOW}Advertencia: jq no está instalado. Los JSON no se mostrarán formateados.${NC}" >&2; }
}

# Main
main() {
    check_dependencies

    if [ "$1" == "--all" ]; then
        run_all_tests
        exit 0
    fi

    if [ "$1" == "--flow" ]; then
        run_complete_flow
        exit 0
    fi

    while true; do
        show_menu
        read -p "Opción: " option

        case $option in
            1) run_all_tests ;;
            2) check_server && test_register ;;
            3) check_server && test_login ;;
            4) check_server && test_get_cuenta ;;
            5) check_server && test_get_balance ;;
            6) check_server && test_create_transaction ;;
            7) check_server && test_get_transactions ;;
            8) check_server && test_get_recent_transactions ;;
            9) check_server && test_get_notifications ;;
            10) check_server && test_get_ranking ;;
            11) check_server && test_get_statistics ;;
            12) run_complete_flow ;;
            0) echo -e "\n${GREEN}¡Hasta luego!${NC}\n"; exit 0 ;;
            *) echo -e "${RED}Opción inválida${NC}" ;;
        esac

        read -p $'\n\nPresiona ENTER para continuar...'
    done
}

# Ejecutar
main "$@"
