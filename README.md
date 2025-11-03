## 1. Cách build project

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

## 2. Thông tin về địa chỉ url
| Thành phần              | Địa chỉ                                        |
| ----------------------- | ---------------------------------------------- |
| Laravel app             | [http://localhost:8080](http://localhost:8080) |
| phpMyAdmin              | [http://localhost:8081](http://localhost:8081) |
| MySQL host (từ Laravel) | `db`                                           |
| MySQL user/password     | `laravel / laravel` hoặc `root / root`         |
