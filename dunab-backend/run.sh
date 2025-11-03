#!/bin/bash
# Script para ejecutar el proyecto DUNAB Backend
# Asegura que se use Java 21 para la ejecución

# Configurar Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

echo "============================================"
echo "  DUNAB Backend - Ejecutar Aplicación"
echo "============================================"
echo "Java Home: $JAVA_HOME"
echo "Java Version:"
java -version
echo ""

# Verificar si se especificó un perfil
PROFILE=${1:-dev}

echo "Ejecutando con perfil: $PROFILE"
echo ""

# Ejecutar Spring Boot
mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE
