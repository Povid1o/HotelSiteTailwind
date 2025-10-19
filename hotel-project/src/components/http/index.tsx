import axios from "axios"

// Sanitize API base to avoid trailing slashes
// В Docker: REACT_APP_API_URL = '' (пустая строка) → baseURL = ''
// Локально: REACT_APP_API_URL = undefined → baseURL = 'http://localhost:5001'
export const API_BASE = (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : 'http://localhost:5001').replace(/\/+$/, '')

// Base URL for static files (images, videos, etc.)
// В Docker: статические файлы обслуживаются через nginx на порту 3000
// Локально: статические файлы обслуживаются через backend на порту 5001
export const STATIC_BASE = process.env.REACT_APP_API_URL !== undefined ? 'http://localhost:3000' : 'http://localhost:5001'

// Debug: Log API_BASE value
console.log('🔧 API_BASE:', API_BASE);
console.log('🔧 process.env.REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const $host = axios.create({
  baseURL: API_BASE
})

const $authHost = axios.create({
  baseURL: API_BASE
})

const authInterceptor = (config: any) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
  $host,
  $authHost
}