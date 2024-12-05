FROM node:18-alpine

WORKDIR /app

# COPY package.json .

# RUN npm install

# RUN npm i -g serve

# COPY . .

# RUN npm run build

# Copia solo la construcción precompilada
COPY dist ./dist

# Instala 'serve' para servir los archivos estáticos
RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]