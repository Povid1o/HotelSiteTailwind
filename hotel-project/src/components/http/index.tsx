import axios from "axios"

// Sanitize API base to avoid trailing slashes
// В Docker: REACT_APP_API_URL = '' (пустая строка) → baseURL = '' (относительные пути)
// Локально: REACT_APP_API_URL = undefined → baseURL = 'http://localhost:5001'
export const API_BASE = (process.env.REACT_APP_API_URL !== undefined ? process.env.REACT_APP_API_URL : 'http://localhost:5001').replace(/\/+$/, '')

// Base URL for static files (images, videos, etc.)
// В Docker: используем ОТНОСИТЕЛЬНЫЕ пути (работает из любой точки локальной сети)
// Локально: статические файлы обслуживаются через backend на порту 5001
export const STATIC_BASE = process.env.REACT_APP_API_URL !== undefined ? '' : 'http://localhost:5001'

const $host = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

const $authHost = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

const authInterceptor = (config: any) => {
  const csrfCookie = document.cookie.split('; ').find((item) => item.startsWith('csrf_token='))
  const csrfToken = csrfCookie?.slice('csrf_token='.length)
  if (csrfToken && !['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
    config.headers['x-csrf-token'] = decodeURIComponent(csrfToken)
  }
  return config
}

$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('isAuth')
      localStorage.removeItem('user')
      // A session probe happens on every public page.  A missing/expired
      // admin session there is expected and must not turn the visitor's page
      // into the login screen.  Protected edit requests still redirect.
      if (!error?.config?.skipAuthRedirect && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  }
)

export {
  $host,
  $authHost
}
