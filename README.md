# HotelSite - Веб-приложение отеля с винодельней (V4 Redesign)

Полнофункциональное веб-приложение для управления отелем с винодельней, включающее современную публичную часть (V4 редизайн), административную панель управления динамическим контентом, систему онлайн-бронирования номеров TravelLine, винную галерею с фильтрацией и ресторанное меню.

---

## 🏗️ Архитектура проекта

### Технологический стек

- **Frontend**: React 18.3.1 + TypeScript + Tailwind CSS + MobX (управление состоянием)
- **Backend**: Node.js + Express + Sequelize ORM
- **База данных**: PostgreSQL 16 Alpine (с поддержкой JSONB для гибкого контента страниц)
- **Reverse Proxy / Edge Server**: Caddy 2 (с поддержкой HTTP/2, HTTP/3, Zstd/Gzip сжатия, проксирования API и автоматической прямой отдачи статических медиа-файлов через shared volume)
- **Интеграция бронирования**: Модуль и виджет поиска **TravelLine** (`TravelLineScript`, `TravelLineSearchForm`, `travelLine.ts`)
- **Контейнеризация**: Docker + Docker Compose
- **Аутентификация**: JWT (JSON Web Tokens)
- **SEO & Безопасность**: `SiteMeta` (динамические OpenGraph и мета-теги), `AgeGate` (подтверждение 18+ для алкогольной продукции)

---

### 📂 Структура проекта

```
HotelSiteTailwind/
├── Caddyfile                  # Конфигурация основного Caddy reverse-proxy
├── Caddyfile.local            # Локальная конфигурация Caddy
├── Caddyfile.server           # Серверная конфигурация Caddy (с автоматическим HTTPS)
├── docker-compose.yml         # Оркестрация сервисов (db, backend, frontend, caddy)
│
├── docs/                      # Проектная документация и аудиты
│   ├── agent-redesign-brief.md         # Бриф и ТЗ по V4 редизайну
│   ├── backend-db-audit-2026-08-03.md  # Аудит структуры БД и моделей
│   └── project-improvement-plan.md     # План оптимизации и развития
│
├── Example/                   # Дизайн-макеты и концепты (V4 Mockup)
│
├── hotel-project/             # Frontend (React + TypeScript + Tailwind + MobX)
│   ├── src/
│   │   ├── components/
│   │   │   ├── editable/           # Базовые визуальные редакторские компоненты
│   │   │   ├── pages_editable/     # Постраничные редакторы V4 (HomeEdit, VineryEdit, etc.)
│   │   │   ├── cards/              # Карточки вин, номеров и блюд
│   │   │   ├── modals/             # Модальные окна (дегустации, предупреждения)
│   │   │   ├── TravelLineSearchForm.tsx # Интерактивный форма поиска номеров TravelLine
│   │   │   ├── TravelLineScript.tsx     # Загрузчик скрипта TravelLine
│   │   │   ├── AgeGate.tsx         # Плашка подтверждения возраста 18+
│   │   │   ├── SiteMeta.tsx        # Динамические мета-теги и SEO
│   │   │   └── RouteDataLoader.tsx # Оптимизированная предзагрузка данных маршрутов
│   │   ├── storage/                # MobX сторы (PageStore, WineStore, DishStore, etc.)
│   │   ├── utils/                  # Утилиты (travelLine.ts, API хелперы)
│   │   └── emergencyContent/       # Резервный статический контент при сбоях API
│   ├── Dockerfile                  # Сборка фронтенда в Nginx контейнер
│   └── nginx.conf                  # Внутренняя конфигурация Nginx для фронтенда
│
└── HotelSiteBackend/          # Backend (Node.js Express API)
    ├── controllers/            # Контроллеры API (dishes, rooms, wines, pages, etc.)
    ├── models/                 # Sequelize модели (PostgreSQL + JSONB таблицы)
    ├── routes/                 # Маршруты REST API (/api/...)
    ├── middleware/             # Прослойки (JWT auth, загрузка файлов, обработка ошибок)
    ├── scripts/                # Скрипты инициализации (bootstrapDatabase.js)
    ├── seed/                   # Начальные сиды данных
    ├── static/                 # Загруженные медиафайлы (номера, вина, блюда, видео)
    └── Dockerfile              # Dockerfile бэкенда
```

---

## 🚀 Быстрый старт

### Предварительные требования
- Docker и Docker Compose (v2+)
- Node.js 18+ (для локальной разработки вне Docker)

### 1. Запуск в Docker (Рекомендуемый способ)

```bash
# 1. Клонирование репозитория
git clone <repository-url>
cd HotelSiteTailwind

# 2. Настройка переменных окружения
cp .env.example .env

# 3. Запуск всех сервисов (db, backend, frontend, caddy)
docker compose up -d --build
```

### Доступ к сервисам

| Сервис | URL | Описание |
| :--- | :--- | :--- |
| **Приложение (Caddy Proxy)** | `http://localhost:8081` | Основной вход (Frontend + API прокси) |
| **Backend API (Прямой)** | `http://localhost:8000/api` | REST API сервис (Node.js) |
| **Swagger API Docs** | `http://localhost:8000/api-docs` | Документация REST API |
| **Adminer (База данных)** | `http://localhost:8080` | СУБД Web-интерфейс (запускается по требованию) |

### Данные для входа в Adminer:
- **Система**: PostgreSQL
- **Сервер**: `db`
- **Пользователь**: `postgres`
- **База данных**: `HotelSite`

---

## 📱 Функциональность

### Публичная часть (V4 Redesign)
- **Главная (`/`)**: Визитка отеля с V4-дизайном, интерактивными блоками и модулем быстрого поиска TravelLine.
- **Отель (`/Hotel`)**: Номера отеля с динамическим списком удобств, характеристик, цен и интеграцией прямых ссылок в модуль бронирования.
- **Винодельня (`/Vinery`)**: История винодельни, философия производства, сорта винограда и модальное окно записи на дегустации.
- **Ресторан (`/Restaurant`)**: Меню блюд по категориям (закуски, горячее, десерты) с подробными карточками, КБЖУ и фото.
- **Винный магазин (`/Shop` & `/Shop/:productId`)**: Каталог вин собственного производства с фильтрацией по видам (красное, белое, розовое) и сладости, а также детальной карточкой каждого винного сорта.
- **Мероприятия (`/Events`)**: Афиша предстоящих событий и тематических вечеров.
- **Возрастная проверка (`AgeGate`)**: Защитная плашка 18+ при доступе к разделам с информацией об алкогольной продукции.

### Административная панель (`/admin`)
- **JWT Авторизация (`/login`)**: Безопасный доступ для администраторов.
- **Постраничный V4-редактор**: Визуальное редактирование заголовков, текстов, плашек и медиа-контента страниц (`V4HeroEdit`, `V4InfoPageEdit`, `HomeEdit`, `VineryEdit` и др.) с сохранением в `content_json` (PostgreSQL JSONB).
- **Управление каталогами**: CRUD-операции для вин, блюд ресторана, номеров отеля и мероприятий.
- **Медиа-менеджер**: Прямая загрузка изображений и видео с автоматическим кэшированием через Caddy.

---

## 🔧 Локальная разработка (без Docker)

### 1. Запуск СУБД в Docker

```bash
docker compose up -d db
```

### 2. Запуск Backend API

```bash
cd HotelSiteBackend
npm install
npm run dev
```
Backend запустится на `http://localhost:8000`. При первом старте скрипт `scripts/bootstrapDatabase.js` автоматически создаст необходимую структуру таблиц и админ-аккаунт.

### 3. Запуск Frontend

```bash
cd hotel-project
npm install
npm start
```
Frontend запустится на `http://localhost:3000`.

---

## ⚡ Особенности Caddy Reverse Proxy

В проекте используется **Caddy 2** в качестве единой точки входа:
1. **Эффективное обслуживание медиа-файлов**: Запросы к `/static/*` обрабатываются Caddy напрямую из общего Docker volume в обход Node.js / Express, что существенно снижает нагрузку на CPU и память.
2. **Автоматическое сжатие**: Включены алгоритмы `zstd` и `gzip`.
3. **SPA Роутинг**: Автоматический фоллбек для ненайденных путей на `index.html` для корректной работы React Router.

---

## 📚 Проектная документация

- [docs/agent-redesign-brief.md](./docs/agent-redesign-brief.md) — Подробное техническое задание на V4 редизайн
- [docs/backend-db-audit-2026-08-03.md](./docs/backend-db-audit-2026-08-03.md) — Результаты аудита бэкенда и базы данных
- [docs/project-improvement-plan.md](./docs/project-improvement-plan.md) — План пошаговых улучшений и рефакторинга
- [HotelSiteBackend/MEDIA_GUIDE.md](./HotelSiteBackend/MEDIA_GUIDE.md) — Руководство по загрузке и работе со статическими медиафайлами

---

## 🤝 Поддержка и диагностика

### Просмотр логов контейнеров
```bash
# Логи всех сервисов
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f caddy
docker compose logs -f backend
docker compose logs -f frontend
```

---

**Версия**: 4.0.0 (V4 Redesign)  
**Статус**: ✅ Активный проект

