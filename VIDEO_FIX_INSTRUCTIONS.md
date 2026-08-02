# 🎥 Исправление проблемы с видео - Инструкция

## 📋 Резюме проблемы

**Диагноз:** Ваш коллега **ПРАВ**. Проблема была в конфигурации nginx.

### Что было не так:
1. **Nginx regex был недостаточно специфичным** - не указывал расширения файлов, что могло приводить к конфликтам приоритетов с `location /static/`
2. **Отсутствовали явные MIME-типы** для видео в backend
3. **Не было логирования** для отладки запросов к статическим файлам
4. **Не был установлен client_max_body_size** для больших видео файлов

### Что было исправлено:
✅ Nginx конфигурация с более специфичным regex для медиафайлов  
✅ Явное указание MIME-типов для всех видео форматов в backend  
✅ Добавлено логирование запросов к статическим файлам  
✅ Установлен `client_max_body_size 100M` в nginx  
✅ Добавлены заголовки безопасности (`X-Content-Type-Options`, `Accept-Ranges`)

---

## 🔧 Применение исправлений

### Шаг 1: Остановите контейнеры

```bash
cd /Users/nikitabaslykov/Documents/Javascript/HotelSiteTailwind
docker compose down
```

### Шаг 2: Пересоберите контейнеры

```bash
# Пересборка frontend (nginx) без кеша
docker compose build --no-cache frontend

# Пересборка backend
docker compose build --no-cache backend
```

### Шаг 3: Запустите контейнеры

```bash
docker compose up -d
```

### Шаг 4: Проверьте логи

```bash
# Логи frontend (nginx)
docker compose logs -f frontend

# Логи backend
docker compose logs -f backend
```

---

## 🧪 Тестирование

### 1. Загрузка нового видео

1. Откройте админку: `http://ваш-домен/admin`
2. Перейдите в раздел "Контент на страницах" → "Главная"
3. Нажмите "Править"
4. В секции "Видео" загрузите новый MP4 файл
5. Сохраните изменения

### 2. Проверка в DevTools

**Откройте DevTools (F12) → вкладка Network:**

При загрузке страницы с видео найдите запрос к файлу `*.mp4`:

**Ожидаемые заголовки ответа:**
```
Status: 200 OK
Content-Type: video/mp4
X-Served-By: backend-media
X-Content-Type-Options: nosniff
Accept-Ranges: bytes
Cache-Control: public, immutable
Access-Control-Allow-Origin: *
```

### 3. Проверка прямого доступа

Откройте в браузере:
```
http://ваш-домен/static/pages/имя-файла.mp4
```

Видео должно начать воспроизводиться.

### 4. Проверка на мобильном устройстве

Откройте сайт с другого устройства в локальной сети и убедитесь, что видео воспроизводится.

---

## 🔍 Отладка проблем

### Проблема: Видео не загружается (404)

**Проверьте логи backend:**
```bash
docker compose logs backend | grep "static/pages"
```

Вы должны увидеть:
```
📁 Static file request: /pages/ваш-файл.mp4 | Method: GET
```

**Проверьте, что файл существует:**
```bash
docker compose exec backend ls -la static/pages/
```

### Проблема: Видео не воспроизводится (но загружается)

**Проверьте MIME-type в DevTools:**
- Content-Type должен быть `video/mp4` (или другой видео формат)
- Если это `application/octet-stream`, значит backend не распознает формат

**Проверьте формат видео:**
```bash
docker compose exec backend file static/pages/ваш-файл.mp4
```

### Проблема: 413 Request Entity Too Large

Видео слишком большое. Увеличьте лимит в `nginx.conf`:
```nginx
client_max_body_size 200M;  # Было 100M
```

И в `HotelSiteBackend/index.js`:
```javascript
app.use(fileUpload({
  limits: { fileSize: 200 * 1024 * 1024 }, // Было 100 MB
  ...
}))
```

---

## 📊 Технические детали изменений

### 1. Nginx конфигурация (`hotel-project/nginx.conf`)

**Было:**
```nginx
location ~ ^/static/(dishes|pages|rooms|wines|videos|fallbacks)/ {
    proxy_pass http://backend:8000;
    ...
}
```

**Стало:**
```nginx
location ~ ^/static/(dishes|pages|rooms|wines|videos|fallbacks)/.+\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|avi|mov|wmv|flv|mkv)$ {
    proxy_pass http://backend:8000;
    ...
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Served-By "backend-media" always;
}
```

**Почему это важно:**
- Более специфичный regex гарантирует приоритет над `location /static/`
- Явное указание расширений предотвращает конфликты
- Заголовки безопасности защищают от XSS

### 2. Backend MIME-типы (`HotelSiteBackend/index.js`)

**Добавлено:**
```javascript
app.use(express.static(path.resolve(__dirname, 'static'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
    // ... другие форматы
    res.setHeader('Accept-Ranges', 'bytes');
  }
}))
```

**Почему это важно:**
- Гарантирует правильный MIME-type для всех браузеров
- `Accept-Ranges: bytes` позволяет перематывать видео

### 3. Логирование

**Добавлено:**
```javascript
app.use('/static', (req, res, next) => {
  console.log(`📁 Static file request: ${req.url} | Method: ${req.method}`);
  next();
});
```

**Почему это важно:**
- Позволяет отследить, доходят ли запросы до backend
- Упрощает отладку проблем с маршрутизацией

---

## ✅ Контрольный список

После применения исправлений проверьте:

- [ ] Контейнеры успешно пересобраны и запущены
- [ ] В логах backend видны запросы к `/static/pages/`
- [ ] Новое видео загружается через админку
- [ ] Видео отображается на главной странице
- [ ] В DevTools виден заголовок `X-Served-By: backend-media`
- [ ] Content-Type = `video/mp4`
- [ ] Видео воспроизводится на десктопе
- [ ] Видео воспроизводится на мобильном устройстве
- [ ] Можно перематывать видео (seek bar работает)

---

## 📝 Примечания

1. **Кеширование:** Если видео не обновляется, очистите кеш браузера (Ctrl+Shift+R)
2. **Формат видео:** Рекомендуется использовать MP4 (H.264) для максимальной совместимости
3. **Размер файла:** Для лучшей производительности сжимайте видео до разумных размеров (<50MB)
4. **CDN:** В будущем рассмотрите использование CDN для видео (например, Cloudflare)

---

## 🆘 Если ничего не помогло

Отправьте следующую информацию:

```bash
# 1. Логи nginx
docker compose logs frontend | grep "static/pages" > nginx_logs.txt

# 2. Логи backend
docker compose logs backend | grep "static" > backend_logs.txt

# 3. Список файлов в static/pages
docker compose exec backend ls -la static/pages/ > files_list.txt

# 4. Конфигурация nginx
docker compose exec frontend cat /etc/nginx/conf.d/default.conf > current_nginx.conf
```

И скриншот вкладки Network из DevTools при загрузке видео.

---

**Автор исправлений:** AI Assistant  
**Дата:** 21 октября 2025  
**Основано на рекомендациях вашего коллеги** ✅

