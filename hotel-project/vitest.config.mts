import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.REACT_APP_API_URL': '""', 'process.env.REACT_APP_YM_ID': '""' },
  test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.{ts,tsx}'] }
});
