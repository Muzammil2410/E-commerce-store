/**
 * Auth API - real-time backend integration for register & login
 * Uses same base URL as product API (VITE_API_URL or http://localhost:5000)
 */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const AUTH_API = `${API_BASE}/api/auth`

/**
 * Register a new user (seller, buyer, or employee)
 * @param {{ name: string, email: string, password: string, role: 'seller'|'buyer'|'employee' }} data
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function register(data) {
  const res = await axios.post(`${AUTH_API}/register`, data)
  return res.data
}

/**
 * Login (buyer, seller, employee, or hardcoded admin)
 * @param {{ email: string, password: string, role?: string }} data - role optional; if provided must match account
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function login(data) {
  const res = await axios.post(`${AUTH_API}/login`, data)
  return res.data
}

/**
 * Get stored auth token (for attaching to protected requests)
 */
export function getAuthToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
}

/**
 * Set auth token in localStorage (call after login/register)
 */
export function setAuthToken(token) {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('authToken', token)
  }
}

/**
 * Clear auth token (logout)
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

// Attach Bearer token to all axios requests when user is logged in
axios.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { API_BASE, AUTH_API }
