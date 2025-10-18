import axios from "axios"

// Sanitize API base to avoid trailing slashes
// В Docker: REACT_APP_API_URL = '' (пустая строка) → baseURL = ''
// Локально: REACT_APP_API_URL = undefined → baseURL = 'http://localhost:5001'
export const API_BASE = (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : 'http://localhost:5001').replace(/\/+$/, '')

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