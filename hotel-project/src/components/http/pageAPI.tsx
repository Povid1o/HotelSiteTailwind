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

export const updatePageContent = async (pageId: number, content: any) => {
  // Upload any File fields and replace with URLs
  const uploadIfFile = async (val: any, type: string) => {
    if (val instanceof File) {
      const form = new FormData();
      form.append('file', val);
      form.append('type', type);
      const { data } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      return data.url;
    }
    return val;
  }

  const deepProcess = async (obj: any, section: string): Promise<any> => {
    if (obj === null || obj === undefined) return obj
    if (Array.isArray(obj)) {
      const res = [] as any[]
      let idx = 0
      for (const item of obj) {
        res.push(await deepProcess(item, section))
        idx++
      }
      return res
    }
    if (typeof obj === 'object') {
      const out: any = {}
      for (const k of Object.keys(obj)) {
        const v = obj[k]
        if (k.toLowerCase().includes('image') || k.toLowerCase().includes('video')) {
          out[k] = await uploadIfFile(v, 'pages')
        } else {
          out[k] = await deepProcess(v, section)
        }
      }
      return out
    }
    return obj
  }

  // Сначала получаем текущую страницу
  const { data: currentPage } = await $host.get(`api/pages/${pageId}`);
  
  const processed = await deepProcess(content, currentPage.name)
  
  // Отправляем обновление с правильной структурой
  const { data } = await $authHost.put(`api/pages/${pageId}`, {
    name: currentPage.name,
    path: currentPage.path,
    is_active: currentPage.is_active,
    content_json: processed
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
  // Сначала получаем текущую страницу
  const { data: currentPage } = await $host.get(`api/pages/${pageId}`);
  
  // Обновляем только is_active
  const { data } = await $authHost.put(`api/pages/${pageId}`, {
    name: currentPage.name,
    path: currentPage.path,
    is_active: !currentPage.is_active,
    content_json: currentPage.content_json
  });
  
  return {
    id: data.id,
    name: data.name,
    path: data.path,
    isActive: data.is_active,
    content: data.content_json || {}
  };
};