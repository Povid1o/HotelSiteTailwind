# Исправление проблемы Stale Closure в BoxEditable

## ❌ Проблема: Обновляется только последняя картинка

**Симптомы**:
- При изменении нескольких картинок в BoxEditable (процессы производства/сервисы) сохраняется только последнее изменение
- Все предыдущие изменения теряются
- Требуется переоткрытие модального окна для применения каждого изменения

**Пример**:
```
User меняет:
- Фото процесса #1: Сбор винограда → newPhoto1.jpg
- Фото процесса #2: Ферментация → newPhoto2.jpg
- Фото процесса #3: Выдержка → newPhoto3.jpg

Результат после сохранения:
- Процесс #1: СТАРОЕ фото ❌
- Процесс #2: СТАРОЕ фото ❌
- Процесс #3: newPhoto3.jpg ✅ (только последнее!)
```

## 🔍 Корневая причина: Stale Closure

**Код ДО исправления**:
```typescript
// VineryEdit.tsx
const handleProductionStageChange = useCallback((stageIndex, newData) => {
    const updatedStages = pageData.productionSection.stages.map((stage, index) => {
        // ← pageData.productionSection захвачен в closure!
        if (index === stageIndex) {
            return {
                ...stage,
                name: newData.name || stage.name,
                image: newData.image !== undefined ? newData.image : stage.image
            };
        }
        return stage;
    });

    onContentChange('productionSection', {
        ...pageData.productionSection, // ← СТАРЫЕ данные из closure!
        stages: updatedStages
    });
}, [onContentChange, pageData.productionSection]); // ← Зависимость
```

## 🔄 Что происходит (Race Condition):

```
НАЧАЛЬНОЕ СОСТОЯНИЕ: stages = [stage1_old, stage2_old, stage3_old]

1. User меняет фото процесса #1
   ↓
2. BoxEditable вызывает onDataChange({ image: newPhoto1 })
   ↓
3. handleProductionStageChange получает вызов
   → Использует pageData.productionSection = { stages: [stage1_old, stage2_old, stage3_old] }
   → Создает updatedStages = [stage1_NEW, stage2_old, stage3_old]
   → Вызывает onContentChange('productionSection', { stages: [stage1_NEW, ...] })
   ↓
4. PageContentStorage.updatePageContentLocal обновляет MobX store
   → store.pages[x].content.productionSection.stages = [stage1_NEW, stage2_old, stage3_old]
   ↓
5. MobX observer перерендеривает VineryEdit с новым pageData
   → НО handleProductionStageChange мемоизирован! (из-за useCallback)
   → Функция все еще содержит СТАРЫЙ pageData в closure
   ↓
6. User (БЕЗ переоткрытия модального окна) меняет фото процесса #2
   ↓
7. handleProductionStageChange снова вызывается
   → Использует pageData.productionSection = { stages: [stage1_old, stage2_old, stage3_old] } (ИЗ CLOSURE!)
   → Создает updatedStages = [stage1_old, stage2_NEW, stage3_old]
   → Вызывает onContentChange('productionSection', { stages: [stage1_old, stage2_NEW, ...] })
   ↓
8. ИЗМЕНЕНИЕ ПРОЦЕССА #1 ПОТЕРЯНО! ❌
   → store.pages[x].content.productionSection.stages = [stage1_old, stage2_NEW, stage3_old]
```

## ✅ Решение: useRef для актуальных данных

**Код ПОСЛЕ исправления**:
```typescript
// VineryEdit.tsx
const VineryEdit = ({ pageData, onContentChange }) => {
    // Ref для хранения актуальных данных
    const pageDataRef = useRef(pageData);
    
    // Обновляем ref при каждом изменении pageData
    useEffect(() => {
        pageDataRef.current = pageData;
    }, [pageData]);

    const handleProductionStageChange = useCallback((stageIndex, newData) => {
        // Читаем АКТУАЛЬНЫЕ данные из ref вместо closure!
        const currentProductionSection = pageDataRef.current.productionSection;
        const currentStages = currentProductionSection?.stages || [];
        
        const updatedStages = currentStages.map((stage, index) => {
            if (index === stageIndex) {
                return {
                    ...stage,
                    name: newData.name || stage.name,
                    image: newData.image !== undefined ? newData.image : stage.image
                };
            }
            return stage;
        });

        onContentChange('productionSection', {
            ...currentProductionSection,
            stages: updatedStages
        });
    }, [onContentChange]); // ← pageData.productionSection УБРАН из зависимостей!
}
```

## 🎯 Как работает теперь:

```
1. User меняет фото процесса #1
   ↓
2. handleProductionStageChange вызывается
   → pageDataRef.current.productionSection.stages = [stage1_old, stage2_old, stage3_old]
   → updatedStages = [stage1_NEW, stage2_old, stage3_old]
   → onContentChange обновляет store → [stage1_NEW, stage2_old, stage3_old] ✅
   ↓
3. MobX обновляет pageData
   ↓
4. useEffect обновляет pageDataRef.current = NEW pageData
   → pageDataRef.current.productionSection.stages = [stage1_NEW, stage2_old, stage3_old] ✅
   ↓
5. User меняет фото процесса #2
   ↓
6. handleProductionStageChange вызывается
   → pageDataRef.current.productionSection.stages = [stage1_NEW, stage2_old, stage3_old] ✅ (АКТУАЛЬНЫЕ!)
   → updatedStages = [stage1_NEW, stage2_NEW, stage3_old]
   → onContentChange обновляет store → [stage1_NEW, stage2_NEW, stage3_old] ✅
   ↓
7. ВСЕ ИЗМЕНЕНИЯ СОХРАНЕНЫ! ✅
```

## 📋 Изменения:

### 1. VineryEdit.tsx
```typescript
+ // Ref для хранения актуальных данных
+ const pageDataRef = useRef(pageData);
+ 
+ useEffect(() => {
+     pageDataRef.current = pageData;
+ }, [pageData]);

const handleProductionStageChange = useCallback((stageIndex, newData) => {
-   const updatedStages = pageData.productionSection.stages.map((stage, index) => {
+   const currentProductionSection = pageDataRef.current.productionSection;
+   const currentStages = currentProductionSection?.stages || [];
+   
+   const updatedStages = currentStages.map((stage, index) => {
        // ...
    });

    onContentChange('productionSection', {
-       ...pageData.productionSection,
+       ...currentProductionSection,
        stages: updatedStages
    });
-}, [onContentChange, pageData.productionSection]);
+}, [onContentChange]);
```

### 2. HomeEdit.tsx (аналогично для servicesSection)
```typescript
+ // Ref для хранения актуальных данных
+ const pageDataRef = useRef(pageData);
+ 
+ useEffect(() => {
+     pageDataRef.current = pageData;
+ }, [pageData]);

const handleServicesSectionServicesChange = useCallback((serviceIndex, newData) => {
-   const updatedServices = pageData.servicesSection.services.map((service, index) => {
+   const currentServicesSection = pageDataRef.current.servicesSection;
+   const currentServices = currentServicesSection?.services || [];
+   
+   const updatedServices = currentServices.map((service, index) => {
        // ...
    });

    onContentChange('servicesSection', {
-       ...pageData.servicesSection,
+       ...currentServicesSection,
        services: updatedServices
    });
-}, [onContentChange, pageData.servicesSection]);
+}, [onContentChange]);
```

## �� Как проверить:

### Шаг 1: Жесткая перезагрузка
```
Cmd+Shift+R
```

### Шаг 2: Тест на странице "Винодельня"
1. Откройте "Контент на страницах" → "Винодельня" → "Править"
2. Прокрутите до секции "Процесс производства"
3. Измените фото в процессе #1 → не закрывайте модальное окно
4. Измените фото в процессе #2 → не закрывайте модальное окно
5. Измените фото в процессе #3 → не закрывайте модальное окно
6. **Закройте и переоткройте модальное окно**
7. **Ожидаемый результат**: ✅ ВСЕ ТРИ фотографии изменились!

### Шаг 3: Тест на главной странице (servicesSection)
1. Откройте "Главная" → "Править"
2. Прокрутите до секции "Сервисы"
3. Измените фото в нескольких сервисах подряд
4. **Переоткройте модальное окно**
5. **Ожидаемый результат**: ✅ Все изменения применены!

## 💡 Почему useRef работает:

1. **ref.current мутабельный** - изменяется БЕЗ перерендера
2. **useEffect обновляет ref** при каждом изменении pageData
3. **useCallback читает свежие данные** из ref вместо closure
4. **Нет зависимости от pageData** → функция не пересоздается → нет stale closure

## 🔧 Альтернативные решения (не использовались):

### 1. Убрать useCallback
```typescript
// Просто функция (пересоздается при каждом рендере)
const handleProductionStageChange = (stageIndex, newData) => {
    // Всегда использует актуальный pageData
}
```
**Минус**: Пересоздание функции при каждом рендере (но обычно не проблема)

### 2. Функциональное обновление
```typescript
onContentChange('productionSection', (current) => ({
    ...current,
    stages: updatedStages
}));
```
**Минус**: Требует изменения PageContentStorage.updatePageContentLocal

## Backend Status:
✅ Backend работает на localhost:5001
