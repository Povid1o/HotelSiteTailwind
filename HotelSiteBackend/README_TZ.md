# HotelSiteBackend — Полная сборка по ТЗ

## Быстрый старт
1. Заполните `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotelsite
DB_USER=postgres
DB_PASSWORD=postgres
PORT=5000
```

2. Установите зависимости:
```
npm i
```

3. Миграции (если используете CLI):
```
npx sequelize-cli db:migrate
```

4. Запуск (dev, с sync если без миграций):
```
npm start
```

## Эндпоинты
Смотрите `swagger.yaml` и файлы роутов в `routes/`.
