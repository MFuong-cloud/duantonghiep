FROM php:8.2-fpm

# Cài extension cần thiết
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip git unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd

# Cài Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Tạo thư mục làm việc (không copy code vào đây!)
WORKDIR /var/www

# Không COPY code, không composer install ở đây!
# Những việc đó sẽ làm khi chạy container (hoặc bên ngoài)

# Đảm bảo permissions (tạm thời, có thể xử lý bằng volume hoặc script khởi động)
RUN chown -R www-data:www-data /var/www

# CMD mặc định — nhưng migration không nên chạy tự động trong dev
CMD ["php-fpm"]
