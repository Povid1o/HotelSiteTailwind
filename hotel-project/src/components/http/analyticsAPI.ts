import { $authHost } from './index';

export type AnalyticsPeriod = 7 | 30 | 90;

export interface Totals {
  visits: number;
  users: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: number;
  pageDepth: number;
  newVisitorsShare: number;
}

export interface Insight {
  tone: 'positive' | 'warning' | 'info';
  title: string;
  text: string;
  hypothesis?: string;
}

export interface Goal {
  id: number;
  name: string;
  identifier: string | null;
  reaches: number;
  previousReaches: number;
  conversionRate: number;
}

export interface Dashboard {
  configured: true;
  counterId: string;
  generatedAt: string;
  period: { days: number; from: string; to: string; previousFrom: string; previousTo: string };
  totals: Totals;
  previous: Totals;
  daily: { date: string; visits: number; users: number }[];
  sources: { name: string; visits: number; bounceRate: number; avgDuration: number; bookingRate: number | null }[];
  entryPages: { path: string; visits: number; bounceRate: number; avgDuration: number; bookingRate: number | null }[];
  pages: { path: string; pageviews: number; users: number }[];
  devices: { name: string; visits: number; bounceRate: number; bookingRate: number | null }[];
  cities: { name: string; visits: number }[];
  hours: { hour: number; visits: number }[];
  goals: Goal[];
  ecommerce: { purchases: number; revenue: number } | null;
  insights: Insight[];
}

export type DashboardResponse = Dashboard | { configured: false };

export const getAnalyticsDashboard = async (days: AnalyticsPeriod, refresh = false): Promise<DashboardResponse> => {
  const { data } = await $authHost.get('api/analytics/dashboard', { params: { days, refresh: refresh ? 1 : undefined } });
  return data;
};
