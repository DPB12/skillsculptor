# Etapa 1: Construcción
FROM node:18 AS build

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar los archivos del proyecto
COPY package*.json ./
COPY . .

# Instalar dependencias y construir la aplicación
RUN npm install && npm run build

# Etapa 2: Servir los archivos estáticos
FROM nginx:stable-alpine

# Copiar los archivos construidos al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80