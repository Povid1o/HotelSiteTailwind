import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    plugins: [react()],
    // Explicit public values only. Never substitute the complete process.env.
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL ?? ''),
      'process.env.REACT_APP_YM_ID': JSON.stringify(env.REACT_APP_YM_ID ?? '')
    },
    build: { outDir: 'build', assetsDir: 'static/assets', sourcemap: false },
    server: {
      host: '127.0.0.1',
      proxy: {
        '/api': 'http://127.0.0.1:5001',
        '^/static/(dishes|pages|rooms|wines|events|news|videos|fallbacks)/': 'http://127.0.0.1:5001'
      }
    }
  };
});
