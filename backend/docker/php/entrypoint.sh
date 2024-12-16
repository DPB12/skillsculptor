#!/bin/bash

# Informar sobre la instalación de dependencias
echo "Instalando dependencias con Composer..."
composer install --no-scripts --no-interaction --optimize-autoloader

# Crear directorios para las claves JWT
echo "Creando directorios para las claves JWT..."
mkdir -p config/jwt
openssl genrsa -out config/jwt/private.pem 4096
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
chmod 644 config/jwt/private.pem
chmod 644 config/jwt/public.pem
chown -R appuser:appuser /appdata/www/config/jwt/

# Crear directorios para imágenes
echo "Creando directorios para las imágenes..."
mkdir -p public/imagenes
mkdir -p public/imagenes/avatars
chmod 777 public/imagenes
chmod 777 public/imagenes/avatars

# Esperar a que MySQL esté disponible usando nc
echo "Esperando a que MySQL esté disponible..."
until nc -z -v -w30 db 3306; do
  echo "Esperando a que MySQL esté disponible..."
  sleep 5
done

# Ejecutar la actualización del esquema de Doctrine
echo "Creando las tablas en la base de datos..."
php bin/console doctrine:schema:update --force

# Iniciar PHP-FPM como proceso principal
echo "Iniciando PHP-FPM..."
php-fpm
