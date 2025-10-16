# Медиа файлы - Структура и использование

## Структура папок

```
HotelSiteBackend/static/
├── dishes/     # Изображения блюд
├── wines/      # Изображения вин и бутылок
├── rooms/      # Фотографии номеров
├── pages/      # Изображения для страниц сайта
├── videos/     # Видео файлы
└── general/    # Общие файлы (по умолчанию)
```

## API для загрузки файлов

### POST /api/upload

**Параметры:**
- `file` (FormData) - файл для загрузки
- `type` (string) - тип медиа: `dishes`, `wines`, `rooms`, `pages`, `videos`, `general`

**Пример использования:**

```javascript
// Загрузка изображения блюда
const formData = new FormData();
formData.append('file', imageFile);
formData.append('type', 'dishes');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

**Ответ:**
```json
{
  "url": "/static/dishes/1760606278369_5hlood.png",
  "fileName": "1760606278369_5hlood.png",
  "originalName": "original-image.png",
  "size": 13665,
  "type": "dishes"
}
```

## Использование на фронтенде

### Для блюд
```javascript
import { uploadMediaFile } from './components/http/dishAPI';

const imageUrl = await uploadMediaFile(file, 'dishes');
```

### Для вин
```javascript
import { uploadMediaFile } from './components/http/dishAPI';

const imageUrl = await uploadMediaFile(file, 'wines');
```

### Для номеров
```javascript
import { uploadMediaFile } from './components/http/dishAPI';

const imageUrl = await uploadMediaFile(file, 'rooms');
```

## Автоматическое преобразование URL

Фронтенд автоматически преобразует относительные URL (`/static/...`) в полные URL с базовым адресом API:

```javascript
// Автоматически преобразуется в:
// http://localhost:5001/static/dishes/image.png
```

## Правила именования файлов

Файлы автоматически получают уникальные имена:
- Формат: `{timestamp}_{randomString}.{extension}`
- Пример: `1760606278369_5hlood.png`

## Поддерживаемые типы файлов

- **Изображения:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **Видео:** `.mp4`, `.webm`, `.mov`
- **Документы:** `.pdf`, `.doc`, `.docx`

## Безопасность

- Проверка типов файлов
- Ограничение размера файлов
- Уникальные имена файлов для предотвращения конфликтов
- Организация по папкам для лучшей структуры
