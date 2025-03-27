#!/bin/bash

TARGET_DIR="/var/www/pentafon-qa-analysis/html/"
SOURCE_DIR="/home/ec2-user/pentafon-qa-analysis/frontend/dist/"

echo "Preparando directorio de destino: $TARGET_DIR"

# Verificar si el directorio de destino existe
if [ ! -d "$TARGET_DIR" ]; then
    echo "El directorio $TARGET_DIR no existe. Creándolo..."
    sudo mkdir -p "$TARGET_DIR"
    if [ $? -ne 0 ]; then
        echo "Error: No se pudo crear el directorio $TARGET_DIR"
        exit 1
    fi
else
    echo "El directorio $TARGET_DIR ya existe. Borrando archivos antiguos..."
    sudo rm -rf "$TARGET_DIR"/*
    if [ $? -ne 0 ]; then
        echo "Error: No se pudieron borrar los archivos antiguos en $TARGET_DIR"
        exit 1
    fi
fi

echo "Copiando archivos desde $SOURCE_DIR a $TARGET_DIR"

# Copiar archivos
sudo cp -r "$SOURCE_DIR"* "$TARGET_DIR"
if [ $? -ne 0 ]; then
    echo "Error: Falló la copia de archivos desde $SOURCE_DIR a $TARGET_DIR"
    exit 1
fi

echo "Operación completada con éxito."
exit 0
