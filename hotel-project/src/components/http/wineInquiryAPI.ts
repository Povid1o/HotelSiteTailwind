import { $authHost, $host } from './index';

export interface WineInquirySettings {
  recipientEmail: string;
  smtpConfigured: boolean;
}

export const getWineInquirySettings = async (): Promise<WineInquirySettings> => {
  const { data } = await $authHost.get('api/wine-inquiries/settings');
  return data;
};

export const saveWineInquirySettings = async (recipientEmail: string): Promise<WineInquirySettings> => {
  const { data } = await $authHost.put('api/wine-inquiries/settings', { recipientEmail });
  return data;
};

export const submitWineInquiry = async (wineId: number, email: string, website: string) => {
  const { data } = await $host.post('api/wine-inquiries', { wineId, email, website });
  return data;
};
