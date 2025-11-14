## 1. Cách build project (no dev)

### 1.1. Build lại toàn bộ (reset database)
> Dùng khi cần load lại dữ liệu từ file `db.sql` hoặc xóa toàn bộ dữ liệu MySQL cũ.

```bash
docker-compose down -v
docker-compose up -d --build
```

### 1.2. Build lại code mà không ảnh hưởng database
```bash
docker-compose build app
docker-compose up -d
```

## 2. Cách build phục vụ code

### 2.1. Build lần đầu:
```bash
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

### 2.2. Lần build thứ 2 trở đi
```bash
# Chỉ build docker lên thôi
docker-compose up -d
```

### 2.3. Thêm package mới
```bash
docker-compose exec app composer install
```

### 2.4. Khi mới pull code (có migration mới)
```bash
docker-compose exec app php artisan migrate
```
## 3. Thông tin về địa chỉ url
| Thành phần              | Địa chỉ                                        |
| ----------------------- | ---------------------------------------------- |
| Laravel app             | [http://localhost:8080](http://localhost:8080) |
| phpMyAdmin              | [http://localhost:8081](http://localhost:8081) |
| MySQL host (từ Laravel) | `db`                                           |
| MySQL user/password     | `laravel / laravel` hoặc `root / root`         |
