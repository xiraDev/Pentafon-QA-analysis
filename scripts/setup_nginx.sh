#!/bin/bash

# Variables
FRONTEND_CONF="/etc/nginx/sites-available/pentafon-qa-analysis-Frontend"
BACKEND_CONF="/etc/nginx/sites-available/pentafon-qa-analysis-Backend"
FRONTEND_SYMLINK="/etc/nginx/sites-enabled/pentafon-qa-analysis-Frontend"
BACKEND_SYMLINK="/etc/nginx/sites-enabled/pentafon-qa-analysis-Backend"
CHANGES_MADE=0

# Función para crear archivo si no existe
create_config_if_missing() {
    local file_path=$1
    local config_content=$2

    if [ ! -f "$file_path" ]; then
        echo "El archivo $file_path no existe. Creándolo..."
        echo "$config_content" > "$file_path"
        CHANGES_MADE=1
    else
        echo "El archivo $file_path ya existe. No se realizan cambios."
    fi
}

# Función para crear enlace simbólico si no existe
create_symlink_if_missing() {
    local target_file=$1
    local symlink_path=$2

    if [ ! -L "$symlink_path" ]; then
        echo "El enlace simbólico $symlink_path no existe. Creándolo..."
        ln -sf "$target_file" "$symlink_path"
        CHANGES_MADE=1
    else
        echo "El enlace simbólico $symlink_path ya existe. No se realizan cambios."
    fi
}

# Configuración para el frontend - Revisar el server_name en README, y revisar en root el nombre del proyecto
FRONTEND_CONFIG=$(cat <<EOL
server {
    listen 80;
    server_name pentafon-qa-analysis.xira.services; 

    location / {
        root /var/www/pentafon-qa-analysis/html/;
        index index.html index.htm;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        try_files \$uri \$uri/ /index.html;
    }
}
EOL
)

# Configuración para el backend - Revisar el server_name en README, y revisar en root el nombre del proyecto
BACKEND_CONFIG=$(cat <<EOL
server {
    listen 80;
    server_name pentafon-qa-analysis-back.xira.services;

    location / {
        proxy_pass http://localhost:5011;  
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
)


# Crear archivos de configuración si faltan
create_config_if_missing "$FRONTEND_CONF" "$FRONTEND_CONFIG"
create_config_if_missing "$BACKEND_CONF" "$BACKEND_CONFIG"

# Crear enlaces simbólicos si faltan
create_symlink_if_missing "$FRONTEND_CONF" "$FRONTEND_SYMLINK"
create_symlink_if_missing "$BACKEND_CONF" "$BACKEND_SYMLINK"

# Si se realizaron cambios, verificar y reiniciar Nginx
if [ $CHANGES_MADE -eq 1 ]; then
    echo "Verificando configuración de Nginx..."
    nginx -t
    if [ $? -eq 0 ]; then
        echo "La configuración de Nginx es válida. Reiniciando servicio..."
        sudo systemctl restart nginx
        if [ $? -eq 0 ]; then
            echo "Nginx reiniciado correctamente."
        else
            echo "Error al reiniciar Nginx."
        fi
    else
        echo "Error en la configuración de Nginx. Revisa los archivos generados."
        exit 1
    fi
else
    echo "No se realizaron cambios. Nginx no requiere reinicio."
fi

echo "Script completado."
