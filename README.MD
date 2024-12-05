# SkillsCulptor

Este proyecto utiliza Docker para la gestión de entornos.  

- [Construcción de Contenedores Docker - Backend](#construcción-de-contenedores-docker---backend)
  - [Despliegue Inicial de los Contenedores](#despliegue-inicial-de-los-contenedores)
  - [Contenedores Desplegados Anteriormente](#contenedores-desplegados-anteriormente)
- [Construcción del Contenedor Docker - Frontend](#construcción-del-contenedor-docker---frontend)

# Construcción de Contenedores Docker - Backend
En la sección de backend, contamos con tres contenedores que se comunican entre sí. Dado que el proceso es más complejo, he incluido un archivo Makefile en el directorio del backend que facilitará el despliegue de los contenedores. Puedes ejecutar el comando make para ver todas las acciones disponibles que puedes realizar.  

![Contenedores - backend](https://raw.githubusercontent.com/juanwilde/docker-symfony/refs/heads/master/Docker%20structure.png)  

```bash
make                             
usage: make [target]

targets:
egrep: warning: egrep is obsolescent; using grep -E
grep: warning: stray \ before :
grep: warning: stray \ before white space
grep: warning: stray \ before white space
help                    Show this help message
run                     Start the containers
stop                    Stop the containers
restart                 Restart the containers
build                   Rebuilds all the containers
prepare                 Runs backend commands
composer-install        Installs composer dependencies
be-logs                 Tails the Symfony dev log
ssh-be                  ssh's into the be container
code-style              Runs php-cs to fix code styling following Symfony rules
```
## Despliegue Inicial de los Contenedores
Si es la primera vez que despliegas los contenedores, sigue estos pasos:  
1. Construir los contenedores:
```bash
make build
```
2. Arrancar los contenedores:
```bash
make run
```
3. Instalar todas las dependencias necesarias:
```bash
make composer-install
```

## Contenedores Desplegados Anteriormente
Si ya has desplegado los contenedores anteriormente, simplemente ejecútalos para iniciarlos si aún no lo están:  
```bash
make run
```

# Construcción del Contenedor Docker - Frontend
En el frontend, solo tenemos un contenedor. Siguiendo la lógica anterior, si es la primera vez que despliegas el proyecto en tu equipo, ejecuta el siguiente comando:  
```bash
docker-compose up --build --no-recreate -d
```
A partir de la segunda vez, podemos utilizar:
```bash
docker-compose up -d
```
