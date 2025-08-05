import axios from 'axios';

export const testServerConnection = async () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  console.log('=== ТЕСТ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ ===');
  console.log('Тестируем URL:', API_URL);
  
  try {
    // Тест базового подключения
    console.log('1. Тестируем базовое подключение...');
    const response = await axios.get(`${API_URL}/api/health`, { timeout: 5000 });
    console.log('✅ Сервер отвечает:', response.status, response.statusText);
  } catch (error) {
    console.log('❌ Базовое подключение не удалось:', error.message);
  }
  
  // Тест эндпоинтов
  const endpoints = [
    '/api/dishes',
    '/api/rooms', 
    '/api/pages',
    '/api/wines'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`2. Тестируем эндпоинт: ${endpoint}`);
      const response = await axios.get(`${API_URL}${endpoint}`, { timeout: 5000 });
      console.log(`✅ ${endpoint} доступен:`, response.status);
    } catch (error) {
      console.log(`❌ ${endpoint} недоступен:`, error.response?.status || error.message);
    }
  }
};