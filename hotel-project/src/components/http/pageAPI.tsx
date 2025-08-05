import { $authHost, $host } from "./index";

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
  return data;
};

export const updatePageContent = async (pageName: string, content: any) => {
  const formData = createFormDataWithFiles({
    name: pageName,
    content: content
  });

  const { data } = await $authHost.put(`api/pages/${encodeURIComponent(pageName)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const togglePageActive = async (pageName: string) => {
  const { data } = await $authHost.patch(`api/pages/${encodeURIComponent(pageName)}/toggle-active`);
  return data;
};