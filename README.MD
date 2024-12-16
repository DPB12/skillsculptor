# SkillsCulptor  
Este proyecto utiliza Docker para la gestión de entornos. Para levantar el proyecto, simplemente ejecuta los siguientes comandos. Los contenedores están configurados para instalar automáticamente todas las dependencias necesarias, de modo que no es necesario realizar configuraciones adicionales.
### Para construir los contenedores, utiliza el siguiente comando:
```bash
docker-compose build
```
### Para iniciar los contenedores, usa:
```bash
docker-compose up
```
### También puedes combinar ambos pasos en un solo comando, que construirá y levantará los contenedores en un solo paso:
```
docker-compose up --build
```
⚠️ **Advertencia**: Al levantar los contenedores, se realiza una actualización de las tablas de la base de datos en el contenedor de backend. Este proceso verifica si las tablas existen y las crea en caso de que no lo estén. La actualización depende del contenedor de la base de datos, por lo que se comprueba si está disponible antes de ejecutar el proceso. Si el contenedor de la base de datos no está disponible, la actualización no se realizará hasta que lo esté. Es importante esperar a que este proceso termine, ya que de lo contrario podrían surgir problemas.
```bash
backend   | DNS fwd/rev mismatch: db != db.skillsculptor_app-network
backend   | db [172.18.0.2] 3306 (?) : Connection refused
backend   | Esperando a que MySQL esté disponible...
backend   | DNS fwd/rev mismatch: db != db.skillsculptor_app-network
backend   | db [172.18.0.2] 3306 (?) : Connection refused
backend   | Esperando a que MySQL esté disponible...
```
Una vez que el contenedor de la base de datos esté accesible, el contenedor de backend procederá a realizar la actualización de las tablas y nos informará de que FPM está corriendo. Cuando este mensaje aparezca, significa que todo está funcionando correctamente.
```bash
db        | 2024-12-13T15:04:48.632413Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.39'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
backend   | DNS fwd/rev mismatch: db != db.skillsculptor_app-network
backend   | db [172.18.0.2] 3306 (?) open
backend   | Creando las tablas en la base de datos...
backend   |  Updating database schema...
backend   | 
backend   |      10 queries were executed
backend   | 
backend   |  [OK] Database schema updated successfully!                                     
backend   | 
backend   | Iniciando PHP-FPM...
backend   | [13-Dec-2024 15:05:03] NOTICE: fpm is running, pid 87
backend   | [13-Dec-2024 15:05:03] NOTICE: ready to handle **connections**
```
⚠️ **Advertencia**: Si no esperamos a que termine el proceso explicado anteriormente, el backend nos mostrará un error 502 Bad Gateway.