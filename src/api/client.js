import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL 

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh handling
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // Stop infinite loop on the refresh endpoint itself
    if (original.url.includes('/auth/token/refresh/')) {
      logout()
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return api(original)
          })
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing = true

      const refresh = localStorage.getItem('refresh_token')

      if (!refresh) {
        logout()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/api/v1/auth/token/refresh/`,
          { refresh }
        )

        localStorage.setItem('access_token', data.access)
        processQueue(null, data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch (err) {
        processQueue(err, null)
        logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  // Clear Zustand persisted auth so isAuthenticated doesn't survive the session
  localStorage.removeItem('nexcribe-auth')
  // Use a custom event so the React app navigates via React Router.
  // A hard window.location.href reload was causing the GET /api/v1 404 loop
  // because axios fired a request with an empty path during the reload.
  window.dispatchEvent(new Event('auth:logout'))
}

export default api