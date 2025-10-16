import axios from "axios"

// Sanitize API base to avoid trailing slashes
export const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5001').replace(/\/+$/, '')

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