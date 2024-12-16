FROM php:8.3-fpm

ARG UID
EXPOSE $UID

RUN adduser -u ${UID} --disabled-password --gecos "" appuser
RUN mkdir /home/appuser/.ssh
RUN chown -R appuser:appuser /home/appuser/
RUN echo "StrictHostKeyChecking no" >> /home/appuser/.ssh/config
RUN echo "export COLUMNS=300" >> /home/appuser/.bashrc
RUN echo "alias sf=/appdata/www/bin/console" >> /home/appuser/.bashrc

COPY ./php.ini /usr/local/etc/php/php.ini

RUN apt-get update \
    && apt-get install -y git acl openssl openssh-client wget zip vim libssh-dev netcat-traditional dos2unix \
    && apt-get install -y libpng-dev zlib1g-dev libzip-dev libxml2-dev libicu-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip gd soap bcmath sockets \
    && pecl install xdebug \
    && docker-php-ext-enable --ini-name 05-opcache.ini opcache xdebug

RUN curl https://getcomposer.org/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer
RUN composer self-update

RUN wget https://cs.symfony.com/download/php-cs-fixer-v2.phar -O php-cs-fixer
RUN chmod a+x php-cs-fixer
RUN mv php-cs-fixer /usr/local/bin/php-cs-fixer

# Instalación de Symfony CLI
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash
RUN apt install symfony-cli

RUN mkdir -p /appdata/www

WORKDIR /appdata/www

# Copiar el script de inicio al contenedor
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Convertir el script a formato Unix
RUN dos2unix /usr/local/bin/entrypoint.sh

# Hacer el script ejecutable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Usar el script de inicio como entrypoint
ENTRYPOINT ["entrypoint.sh"]
