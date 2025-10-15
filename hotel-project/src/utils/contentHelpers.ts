export const getContentOrEmergency = <T>(apiContent: T | null | undefined, emergencyContent: T): T => {
  return apiContent ?? emergencyContent;
};

export const getImageOrEmergency = (apiImage: string | null | undefined, emergencyImage: string): string => {
  return apiImage && apiImage.trim() !== '' ? apiImage : emergencyImage;
};

export const getArrayOrEmergency = <T>(apiArray: T[] | null | undefined, emergencyArray: T[]): T[] => {
  return apiArray && apiArray.length > 0 ? apiArray : emergencyArray;
};

export interface ImageItem {
  src: string;
  alt: string;
}
