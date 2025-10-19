# 🔧 Исправление проблемы с отображением фотографий

**Дата:** 19 октября 2025  
**Проблема:** На удалённых устройствах отображается только последняя добавленная фотография

---

## 🔴 Обнаруженная проблема

### Симптомы:
1. На `localhost` (ваш компьютер) все фото видны - и старые, и новые
2. На `192.168.1.7:3000` (другие устройства) видна только последняя добавленная фотография

### Причина:

**Blob URLs не работают между устройствами!**

Когда администратор добавляет новые фотографии в PhotoSelector:
1. Создаётся **blob URL** для превью: `blob:http://localhost:3000/abc-123`
2. Этот blob URL **существует только на устройстве администратора**
3. При сохранении, фотографии отправляются на backend
4. Backend возвращает реальные URL: `/static/rooms/image.png`
5. **НО!** В локальном состоянии компонента остаются blob URLs!

### Почему это происходит:

#### 1. PhotoSelector создаёт blob URLs (строка 26):
```typescript
// PhotoSelector.tsx:217
if (photo instanceof File) {
    const url = URL.createObjectURL(photo); // ❌ Создаёт blob:// URL
    return { src: url, alt: photo.name, file: photo };
}
```

#### 2. При сохранении, данные отправляются с blob URLs:
```typescript
// NewRoomCard.tsx:61-65
const handlePhotosChange = useCallback((newPhotos) => {
    console.log('Photos changed:', newPhotos); // newPhotos содержит blob URLs!
    setLocalPhotos(newPhotos);
    updateRoomData({ images: newPhotos }); // ❌ Отправляет blob URLs
}, [updateRoomData]);
```

#### 3. HotelStorage.transformRoomToBackend обрабатывает:
```typescript
// HotelStorage.tsx:112-128
if (frontendRoom.images !== undefined) {
    const imageUrls = await Promise.all(
        frontendRoom.images.map(async (img) => {
            if (img instanceof File) {
                return await uploadFile(img, 'rooms'); // ✅ Загружает File
            }
            if (typeof img === 'string') {
                return img; // ❌ Возвращает blob URL как есть!
            }
            return '';
        })
    );
}
```

**Проблема:** `typeof blob_url === 'string'` → blob URL передаётся на backend!

#### 4. Backend сохраняет blob URLs в БД:
```json
{
  "images": [
    { "url": "/static/rooms/old1.png", "order": 0 },  // Старое фото
    { "url": "/static/rooms/old2.png", "order": 1 },  // Старое фото  
    { "url": "blob:http://localhost:3000/abc-123", "order": 2 }  // ❌ BLOB URL!
  ]
}
```

#### 5. При загрузке на другом устройстве:
- `old1.png` ✅ Загружается
- `old2.png` ✅ Загружается
- `blob://...` ❌ Не существует на этом устройстве!

---

## ✅ Решение

### Исправление 1: Фильтровать blob URLs перед отправкой

**Файл:** `hotel-project/src/storage/HotelStorage.tsx` (строка 110-134)

```typescript
// Handle images - upload File objects, normalize URL strings
if (frontendRoom.images !== undefined) {
    const imageUrls = await Promise.all(
        frontendRoom.images.map(async (img) => {
            // Обработка File объектов
            if (img instanceof File) {
                return await uploadFile(img, 'rooms');
            }
            
            // Обработка строковых URL
            if (typeof img === 'string') {
                // ✅ ФИЛЬТРУЕМ blob URLs!
                if (img.startsWith('blob:')) {
                    console.warn('Skipping blob URL:', img);
                    return null; // Не сохраняем blob URLs
                }
                return img; // Сохраняем только реальные URL
            }
            
            // Обработка объектов { src: File, alt: string }
            if (img && typeof img === 'object') {
                const imgObj = img as any;
                if (imgObj.file instanceof File) {
                    return await uploadFile(imgObj.file, 'rooms');
                }
                if (typeof imgObj.src === 'string') {
                    // ✅ ФИЛЬТРУЕМ blob URLs!
                    if (imgObj.src.startsWith('blob:')) {
                        console.warn('Skipping blob URL from object:', imgObj.src);
                        return null;
                    }
                    return imgObj.src;
                }
            }
            
            return null;
        })
    );
    
    // ✅ Удаляем null значения (отфильтрованные blob URLs)
    const validUrls = imageUrls.filter(url => url !== null && url !== '');
    
    backendData.images = validUrls.map((url, index) => ({
        url,
        alt_text: '',
        order: index
    }));
}
```

### Исправление 2: Перезагружать данные после обновления

**Файл:** `hotel-project/src/storage/HotelStorage.tsx` (строка 198-216)

```typescript
updateRoomLocal = async (roomId: number, updatedData: Partial<HotelRoom>) => {
    const room = this._rooms.find(r => r.id === roomId);
    if (room) {
        const oldData = { ...room };
        
        try {
            const backendData = await this.transformRoomToBackend(updatedData);
            const response = await updateRoom(roomId, backendData);
            
            // ✅ КРИТИЧНО: Обновляем данные из backend (с реальными URL!)
            const updatedRoom = this.transformRoomFromBackend(response);
            Object.assign(room, updatedRoom);
            
            // ✅ ДОПОЛНИТЕЛЬНО: Принудительно обновляем массив для реактивности MobX
            this._rooms = [...this._rooms];
            
        } catch (error) {
            console.error('Error updating room:', error);
            Object.assign(room, oldData);
        }
    }
};
```

---

## 🔍 Проверка решения

### Ожидаемое поведение:

1. **Администратор добавляет фото:**
   - Видит blob URL превью локально ✅
   - При сохранении:
     - File загружается на backend → `/static/rooms/new.png`
     - Blob URLs игнорируются (не сохраняются)
     - Старые реальные URL сохраняются

2. **После сохранения:**
   - Backend возвращает актуальный список:
     ```json
     {
       "images": [
         { "url": "/static/rooms/old1.png", "order": 0 },
         { "url": "/static/rooms/old2.png", "order": 1 },
         { "url": "/static/rooms/new.png", "order": 2 }
       ]
     }
     ```
   - Frontend обновляет локальное состояние с реальными URL

3. **На других устройствах:**
   - Все фото загружаются по реальным URL ✅
   - Blob URLs не передаются ✅

---

## 📝 Что нужно проверить

1. Откройте админку
2. Измените фотографии номера (добавьте новые, оставьте старые)
3. Сохраните
4. Проверьте в консоли браузера:
   - Должны быть предупреждения `Skipping blob URL:` (если были blob URLs)
   - Не должно быть ошибок загрузки изображений
5. Откройте сайт с другого устройства (`http://192.168.1.7:3000`)
6. **Все фото должны отображаться!**

---

## 🐛 Проблема с хуками React (отдельная)

**Симптом:** Ошибка появляется только когда:
- Пользователь **находится на странице** во время обновления данных
- **Обновляет страницу** (F5/Ctrl+R)

**Причина:** MobX observer и изменение данных в store во время рендера

### Решение:

Необходимо убедиться, что при обновлении данных в MobX store:
1. Не вызываются дополнительные хуки
2. Структура компонента остаётся стабильной

**Файл:** Проверить все компоненты, которые используют `observer` и `useContext(Context)`

**Подозреваемые компоненты:**
- `Home.tsx` - использует `pageContent` и `hotel` stores
- `Restaurant.tsx` - использует `dish` store
- `Shop.tsx` - использует `wine` store
- `EventContent.tsx` - использует `events` store

**Проверка:**
Убедиться, что все хуки вызываются **до** любых условных return:

```typescript
const Component = observer(() => {
    // ✅ ВСЕ хуки в начале
    const context = useContext(Context);
    const [state, setState] = useState();
    useEffect(() => {}, []);
    
    // ✅ Проверки ПОСЛЕ всех хуков
    if (!context) {
        throw new Error();
    }
    
    // ✅ Early return с загрузкой ПОСЛЕ всех хуков
    if (context.store.isLoading) {
        return <Loading />;
    }
    
    return <div>...</div>;
});
```

---

## 🎯 Итоговые исправления

1. ✅ **HotelStorage.tsx** - фильтрация blob URLs перед отправкой
2. ✅ **HotelStorage.tsx** - принудительное обновление массива `_rooms` для реактивности
3. 🔍 **TODO:** Проверить hooks в компонентах-наблюдателях

---

**После применения этих исправлений фотографии должны корректно отображаться на всех устройствах!**

