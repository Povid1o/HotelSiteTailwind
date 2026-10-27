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
  baseURL: API_BASE || '/',
  withCredentials: true
})

const $authHost = axios.create({
  baseURL: API_BASE || '/',
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

// An expired session inside the admin panel must not navigate away: that would
// discard whatever is open in an editor.  Failed requests wait here until the
// administrator signs in again in place, and are then sent once more.
let reloginPromise: Promise<void> | null = null
let resolveRelogin: (() => void) | null = null

export const ADMIN_SESSION_EXPIRED_EVENT = 'admin-session-expired'

export const waitForRelogin = () => {
  if (!reloginPromise) {
    reloginPromise = new Promise((resolve) => { resolveRelogin = resolve })
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT))
  }
  return reloginPromise
}

export const completeRelogin = () => {
  resolveRelogin?.()
  reloginPromise = null
  resolveRelogin = null
}

$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    if (
      error?.response?.status === 401 &&
      config && !config.skipAuthRedirect && !config._afterRelogin &&
      window.location.pathname.startsWith('/admin')
    ) {
      await waitForRelogin()
      return $authHost({ ...config, _afterRelogin: true })
    }
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
