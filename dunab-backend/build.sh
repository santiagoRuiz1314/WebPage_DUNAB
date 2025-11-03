#!/bin/bash
# Script de compilación para el proyecto DUNAB Backend
# Asegura que se use Java 21 para la compilación

# Configurar Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

echo "============================================"
echo "  DUNAB Backend - Script de Compilación"
echo "============================================"
echo "Java Home: $JAVA_HOME"
echo "Java Version:"
java -version
echo ""

# Ejecutar Maven
echo "Ejecutando Maven clean compile..."
mvn clean compile

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Compilación exitosa!"
    exit 0
else
    echo ""
    echo "✗ Error en la compilación"
    exit 1
fi
