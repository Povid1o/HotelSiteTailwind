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

export const fetchWines = async () => {
  const { data } = await $host.get('api/wines/tree');
  // Map image urls to absolute
  const mapped = (Array.isArray(data) ? data : []).map((t: any) => ({
    type: t.name,
    assortment: (t.assortment || []).map((s: any) => ({
      sweetness: s.name,
      wines: (s.wines || []).map((w: any) => ({
        id: w.id,
        name: w.name,
        year: w.year,
        alcohol: w.alcohol,
        sugar: w.sugar,
        temperature: w.temperature,
        price: typeof w.price === 'string' ? Number(w.price) : (w.price ?? 0),
        description: (w.description || []).map((d: any) => d.description_text || d),
        images: (w.images || []).map((img: any) => {
          const src = img?.url || ''
          if (!src) return null
          if (src.startsWith('/static/')) return `${API_BASE}${src}`
          return src
        }).filter(Boolean)
      }))
    }))
  }))
  return mapped
};

export const createWine = async (wineType: string, sweetness: string, wineData: any) => {
  // Backend expects ids and arrays
  // First fetch dictionaries
  const [{ data: types }, { data: sweets }] = await Promise.all([
    $host.get('api/wine-types'),
    $host.get('api/wine-sweetness')
  ])
  const type = (types || []).find((t: any) => t.name.toLowerCase() === wineType.toLowerCase())
  const sweet = (sweets || []).find((s: any) => s.name.toLowerCase() === sweetness.toLowerCase())
  if (!type || !sweet) throw new Error('Unknown wine type or sweetness')

  // Upload images first
  const images: Array<{url: string, order: number}> = []
  if (Array.isArray(wineData.images)) {
    for (const img of wineData.images) {
      if (img instanceof File) {
        const form = new FormData()
        form.append('file', img)
        form.append('type', 'wines')
        const { data: up } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        images.push({ url: up.url, order: images.length })
      } else if (typeof img === 'string' && img) {
        // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
        if (img.startsWith('blob:')) {
          console.warn('⚠️ wineAPI: Skipping blob URL (not valid for other devices):', img);
          continue; // Пропускаем blob URLs
        }
        images.push({ url: img, order: images.length })
      }
    }
  }

  const payload = {
    type_id: type.id,
    sweetness_id: sweet.id,
    name: wineData.name || 'Новое вино',
    year: wineData.year ?? null,
    alcohol: wineData.alcohol ?? '',
    sugar: wineData.sugar ?? '',
    temperature: wineData.temperature ?? '',
    price: Number(wineData.price) || 0,
    is_active: true,
    description: Array.isArray(wineData.description) ? wineData.description : [],
    images
  }

  const { data } = await $authHost.post('api/wines', payload)
  return data
};

export const updateWine = async (wineId: number, wineData: any, contextTypeName?: string, contextSweetnessName?: string) => {
  // Reuse create logic to build payload
  const payload = { ...wineData }
  // If images contain files, upload first
  const images: Array<{url: string, order: number}> = []
  if (Array.isArray(wineData.images)) {
    for (const img of wineData.images) {
      if (img instanceof File) {
        const form = new FormData()
        form.append('file', img)
        form.append('type', 'wines')
        const { data: up } = await $authHost.post('api/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        images.push({ url: up.url, order: images.length })
      } else if (typeof img === 'string' && img) {
        // ✅ ФИЛЬТРУЕМ blob URLs! Они не работают на других устройствах
        if (img.startsWith('blob:')) {
          console.warn('⚠️ wineAPI: Skipping blob URL (not valid for other devices):', img);
          continue; // Пропускаем blob URLs
        }
        images.push({ url: img, order: images.length })
      }
    }
  }

  // Map type/sweetness names to ids (from payload or context)
  const needMap = payload.type || payload.sweetness || contextTypeName || contextSweetnessName
  if (needMap) {
    const [{ data: types }, { data: sweets }] = await Promise.all([
      $host.get('api/wine-types'),
      $host.get('api/wine-sweetness')
    ])
    const typeName = (payload.type || contextTypeName || '').toString()
    const sweetName = (payload.sweetness || contextSweetnessName || '').toString()
    if (typeName) {
      const t = (types || []).find((x: any) => x.name.toLowerCase() === typeName.toLowerCase())
      if (t) payload.type_id = t.id
    }
    if (sweetName) {
      const s = (sweets || []).find((x: any) => x.name.toLowerCase() === sweetName.toLowerCase())
      if (s) payload.sweetness_id = s.id
    }
    delete payload.type
    delete payload.sweetness
  }

  // Joi schema requires type_id and sweetness_id
  if (!payload.type_id || !payload.sweetness_id) {
    throw new Error('Missing wine type or sweetness for update')
  }

  // ⚠️ КРИТИЧНО: Отправляем images ТОЛЬКО если есть валидные изображения после фильтрации
  if (wineData.images !== undefined) {
    if (images.length > 0) {
      payload.images = images;
    } else {
      console.warn('⚠️ All wine images were blob URLs and filtered out. NOT sending images field to preserve existing photos in DB.');
    }
  }
  
  if (payload.price !== undefined) payload.price = Number(payload.price) || 0

  const { data } = await $authHost.put(`api/wines/${wineId}`, payload)
  return data
};

export const deleteWine = async (wineId: number, retries = 2) => {
  try {
    const { data } = await $authHost.delete(`api/wines/${wineId}`);
    return data;
  } catch (error: any) {
    // Retry on 500 or 409 errors with exponential backoff
    if (retries > 0 && error.response && [500, 409].includes(error.response.status)) {
      console.warn(`Delete wine ${wineId} failed with ${error.response.status}, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 300 * (3 - retries)));
      return deleteWine(wineId, retries - 1);
    }
    
    // Map error message for better UX
    const message = error.response?.data?.message || error.message || 'Failed to delete wine';
    console.error(`Error deleting wine ${wineId}:`, message);
    throw new Error(message);
  }
};