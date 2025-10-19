# HotelSite - Веб-приложение отеля с винодельней

Полнофункциональное веб-приложение для управления отелем с винодельней, включающее административную панель, систему бронирования, каталог вин и ресторанное меню.

## 🏗️ Архитектура проекта

### Технологический стек
- **Frontend**: React 18.3.1 + TypeScript + Tailwind CSS + MobX
- **Backend**: Node.js + Express + Sequelize ORM
- **База данных**: PostgreSQL
- **Контейнеризация**: Docker + Docker Compose
- **Reverse Proxy**: Nginx
- **Аутентификация**: JWT токены

### Структура проекта
```
HotelSiteTailwind/
├── hotel-project/           # Frontend (React приложение)
│   ├── src/
│   │   ├── components/      # React компоненты
│   │   ├── storage/         # MobX stores
│   │   ├── components/http/ # API клиенты
│   │   └── ...
│   ├── public/             # Статические файлы
│   ├── Dockerfile          # Frontend контейнер
│   └── nginx.conf          # Nginx конфигурация
├── HotelSiteBackend/        # Backend (Express API)
│   ├── controllers/         # Контроллеры API
│   ├── models/             # Sequelize модели
│   ├── routes/             # API маршруты
│   ├── middleware/         # Middleware (auth, validation)
│   ├── static/             # Статические файлы (изображения, видео)
│   └── Dockerfile          # Backend контейнер
├── Docker-compose.yml      # Docker Compose конфигурация
└── README.md              # Этот файл
```

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Git

### Запуск проекта

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd HotelSiteTailwind
```

2. **Запуск всех сервисов**
```bash
docker compose up -d
```

3. **Проверка статуса**
```bash
docker compose ps
```

### Доступ к приложению

|       Сервис     |               URL              |        Описание         |
|------------------|--------------------------------|-------------------------|
|    **Frontend**  |      http://localhost:3000     |   Основное приложение   |
|  **Backend API** |    http://localhost:5001/api   |        REST API         |
| **Adminer (БД)** |      http://localhost:8080     | Управление базой данных |
|    **Swagger**   | http://localhost:5001/api-docs |     API документация    |

### Данные для входа в Adminer
- **Сервер**: `db`
- **Пользователь**: `postgres`
- **Пароль**: `2005vino2024`
- **База данных**: `HotelSite`

## 📱 Функциональность

### Публичная часть
- **Главная страница**: Информация об отеле и услугах
- **Винодельня**: Процесс производства вина, галерея
- **Ресторан**: Меню блюд с фотографиями и описаниями
- **Магазин**: Каталог вин с фильтрацией и поиском
- **Номера**: Информация о номерах отеля
- **Мероприятия**: Календарь событий и мероприятий
- **Центр производства локальных продуктов**: Каталог локальных продуктов

### Административная панель
- **Аутентификация**: JWT-based авторизация
- **Управление контентом**: Редактирование всех страниц сайта
- **Медиа-менеджер**: Загрузка и управление изображениями/видео
- **CRUD операции**: Создание, редактирование, удаление всех сущностей
- **Реальное время**: Мгновенное обновление контента на всех устройствах

## 🔧 Разработка

### Локальная разработка

1. **Запуск только базы данных**
```bash
docker compose up -d db adminer
```

2. **Запуск frontend в dev режиме**
```bash
cd hotel-project
npm install
npm start
```

3. **Запуск backend в dev режиме**
```bash
cd HotelSiteBackend
npm install
npm run dev
```

### Структура API

#### Основные эндпоинты
- `GET /api/rooms` - Список номеров
- `GET /api/wines` - Каталог вин
- `GET /api/dishes` - Меню ресторана
- `GET /api/events` - Мероприятия
- `GET /api/pages` - Контент страниц

#### Административные эндпоинты (требуют авторизации)
- `POST /api/user/login` - Авторизация
- `POST /api/rooms` - Создание номера
- `PUT /api/rooms/:id` - Обновление номера
- `DELETE /api/rooms/:id` - Удаление номера

### База данных

#### Основные таблицы
- `rooms` - Номера отеля
- `wines` - Каталог вин
- `dishes` - Блюда ресторана
- `events` - Мероприятия
- `pages` - Контент страниц
- `users` - Пользователи системы

#### Связанные таблицы
- `room_images`, `wine_images`, `dish_images` - Изображения
- `room_properties`, `room_conveniences` - Свойства номеров
- `wine_types`, `wine_sweetness` - Классификация вин

## 🐛 Отладка и диагностика

### Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f db
```

### Проверка состояния контейнеров

```bash
# Статус контейнеров
docker compose ps

# Использование ресурсов
docker stats

# Проверка портов
netstat -tulpn | grep :3000
netstat -tulpn | grep :5001
```

### Частые проблемы и решения

#### 1. Белый экран приложения
**Причина**: Проблемы с nginx конфигурацией или сборкой frontend
**Решение**:
```bash
docker compose down
docker rmi kireyd/frontend:latest
docker compose build --no-cache frontend
docker compose up -d
```

#### 2. Ошибка "Cannot connect to backend"
**Причина**: Backend не может подключиться к базе данных
**Решение**:
```bash
# Проверить логи backend
docker compose logs backend

# Перезапустить backend
docker compose restart backend
```

#### 3. Изображения не загружаются
**Причина**: Проблемы с проксированием статических файлов
**Решение**:
```bash
# Проверить nginx конфигурацию
docker compose exec frontend cat /etc/nginx/conf.d/default.conf

# Проверить доступность статики
curl http://localhost:3000/static/rooms/test.jpg
```

#### 4. Ошибки авторизации (401 Unauthorized)
**Причина**: Проблемы с JWT токенами
**Решение**:
```bash
# Проверить переменные окружения backend
docker compose exec backend env | grep JWT

# Очистить localStorage в браузере
# Открыть DevTools → Application → Local Storage → Clear All
```

### Мониторинг производительности

```bash
# Использование памяти и CPU
docker stats

# Проверка дискового пространства
docker system df

# Очистка неиспользуемых ресурсов
docker system prune -a
```

## 🔒 Безопасность

### JWT Аутентификация
- Токены действительны 24 часа
- Автоматическое обновление при активности
- Защищенные маршруты требуют валидный токен

### Переменные окружения
```bash
# Backend
JWT_SECRET=your-super-secret-jwt-key-here-2024
DB_HOST=db
DB_PORT=5432
DB_NAME=HotelSite
DB_USER=postgres
DB_PASSWORD=2005vino2024

# Frontend
REACT_APP_API_URL=""  # Пустая строка для относительных путей
```

## 📦 Деплой

### Подготовка к продакшену

1. **Обновить переменные окружения**
```yaml
# В Docker-compose.yml
environment:
  - JWT_SECRET=production-secret-key
  - DB_PASSWORD=secure-production-password
```

2. **Собрать образы**
```bash
docker compose build --no-cache
```

3. **Загрузить на Docker Hub**
```bash
docker push kireyd/frontend:latest
docker push kireyd/backend:latest
```

### Деплой на сервер

```bash
# На сервере
git clone <repository-url>
cd HotelSiteTailwind
docker compose pull
docker compose up -d
```

## 📚 Дополнительная документация

- [README_FIXES.md](./README_FIXES.md) - Подробный анализ всех исправленных ошибок
- [TECHNICAL_REQUIREMENTS.md](./TECHNICAL_REQUIREMENTS.md) - Техническое задание
- [DOCKER_FIX_INSTRUCTIONS.md](./DOCKER_FIX_INSTRUCTIONS.md) - Инструкции по Docker

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker compose logs -f`
2. Убедитесь, что все контейнеры запущены: `docker compose ps`
3. Проверьте доступность портов: `netstat -tulpn | grep :3000`
4. Очистите кеш браузера: `Ctrl+Shift+R` (Windows) или `Cmd+Shift+R` (Mac)

## 📄 Лицензия

Проект разработан для внутреннего использования отеля.

---

**Последнее обновление**: 20 октября 2025  
**Версия**: 1.0.0  
**Статус**: ✅ Полностью функциональный
