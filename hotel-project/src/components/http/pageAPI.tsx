import { $authHost, $host, API_BASE } from "./index";

const createFormDataWithFiles = (data: any) => {
    const formData = new FormData();
    
    const processObject = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fieldName = prefix ? `${prefix}[${key}]` : key;
        
        if (value instanceof File) {
          formData.append(fieldName, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${fieldName}[${index}]`, item);
            } else if (typeof item === 'object' && item !== null) {
              processObject(item, `${fieldName}[${index}]`);
            } else {
              formData.append(`${fieldName}[${index}]`, String(item));
            }
          });
        } else if (typeof value === 'object' && value !== null) {
          processObject(value, fieldName);
        } else {
          formData.append(fieldName, String(value));
        }
      });
    };
    
    processObject(data);
    return formData;
  };

export const fetchPageContent = async () => {
  const { data } = await $host.get('api/pages');
  
  // Преобразуем ответ бэкенда в формат фронтенда
  return data.map((page: any) => ({
    id: page.id, // Добавляем id
    name: page.name,
    path: page.path,
    isActive: page.is_active,
    content: page.content_json || {} // content_json -> content
  }));
};

export const updatePageSection = async (pageId: number, section: string, content: any) => {
  // Upload any File fields and replace with URLs
  const uploadIfFile = async (val: any) => {
    // Проверяем как обычный File, так и File обернутый в MobX Proxy
    const isFile = val instanceof File || (val && val.constructor && val.constructor.name === 'File');
    
    if (isFile) {
      console.log('📤 uploadIfFile: Uploading file:', val.name || 'unknown');
      const form = new FormData();
      form.append('file', val);
      const type = val.type?.startsWith('video/') ? 'videos' : 'pages';
      form.append('type', type);
      const { data } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log('✅ uploadIfFile: File uploaded successfully to:', data.url);
      return data.url;
    }
    return val;
  }

  const deepProcess = async (obj: any, section: string): Promise<any> => {
    if (obj === null || obj === undefined) return obj
    
    // Проверяем, является ли это File объектом (может быть обернут в MobX Proxy)
    if (obj instanceof File || (obj && obj.constructor && obj.constructor.name === 'File')) {
      console.log('🟢 pageAPI.deepProcess: Found raw File object, uploading...');
      const result = await uploadIfFile(obj);
      console.log('🟢 pageAPI.deepProcess: File uploaded to:', result);
      return result;
    }
    
    if (Array.isArray(obj)) {
      const res = [] as any[]
      for (const item of obj) {
        const processed = await deepProcess(item, section);
        // ✅ Фильтруем null значения (отфильтрованные blob URLs)
        if (processed !== null && processed !== undefined) {
          res.push(processed);
        }
      }
      return res
    }
    
    if (typeof obj === 'object') {
      // ✅ ПАТЧ: если объект формата { src: File }, загружаем File и возвращаем { src: url }
      if (obj.src && (obj.src instanceof File || (obj.src.constructor && obj.src.constructor.name === 'File'))) {
        console.log('📤 pageAPI.deepProcess: Found { src: File } object, uploading File...');
        const uploadedUrl = await uploadIfFile(obj.src);
        console.log('✅ pageAPI.deepProcess: { src: File } uploaded to:', uploadedUrl);
        return { ...obj, src: uploadedUrl };
      }
      
      // ✅ ФИЛЬТРУЕМ blob URLs в объектах { src: "blob:..." }
      if (obj.src && typeof obj.src === 'string' && obj.src.startsWith('blob:')) {
        console.warn('⚠️ pageAPI: Skipping blob URL in object.src (not valid for other devices):', obj.src);
        return null; // Пропускаем объекты с blob URLs
      }
      
      // Рекурсивно обрабатываем все ключи объекта
      const out: any = {}
      for (const k of Object.keys(obj)) {
        const v = obj[k]
        out[k] = await deepProcess(v, section)
      }
      return out
    }
    
    // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
    if (typeof obj === 'string' && obj.startsWith('blob:')) {
      console.warn('⚠️ pageAPI: Skipping blob URL (not valid for other devices):', obj);
      return null; // Пропускаем blob URLs
    }
    
    return obj
  }

  const processed = await deepProcess(content, section)
  const { data } = await $authHost.patch(`api/pages/${pageId}/content`, {
    section,
    data: processed
  });
  
  return {
    id: data.id,
    name: data.name,
    path: data.path,
    isActive: data.is_active,
    content: data.content_json || {}
  };
};

export const createPage = async (pageData: any) => {
  const { data } = await $authHost.post('api/pages', {
    name: pageData.name,
    path: pageData.path,
    is_active: pageData.isActive !== undefined ? pageData.isActive : true,
    content_json: pageData.content || {}
  });
  
  return {
    id: data.id,
    name: data.name,
    path: data.path,
    isActive: data.is_active,
    content: data.content_json || {}
  };
};

export const togglePageActive = async (pageId: number) => {
  const { data } = await $authHost.patch(`api/pages/${pageId}/toggle-active`);
  
  return {
    id: data.id,
    name: data.name,
    path: data.path,
    isActive: data.is_active,
    content: data.content_json || {}
  };
};
