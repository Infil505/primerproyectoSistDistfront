// src/api/index.js
import axios from 'axios'

function resolveBaseURL() {
  const envBase = (import.meta.env.VITE_API_BASE || '').trim()
  if (envBase) return envBase.replace(/\/$/, '')
  // Dev: usa /api (Vite proxy). Prod: fallback directo al backend.
  return import.meta.env.DEV
    ? '/api'
    : 'https://lucent-toffee-15f013.netlify.app/.netlify/functions'
}

const baseURL = resolveBaseURL()
console.log('[API base]', baseURL)

export const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
})

// — Logs defensivos (no rompen si base es relativa)
const isAbs = (s) => /^https?:\/\//i.test(s || '')
const joinUrl = (base, path) => {
  base = base || ''; path = path || ''
  if (isAbs(base)) return new URL(path, base).toString()
  const b = base.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

api.interceptors.request.use((cfg) => {
  const full = joinUrl(cfg.baseURL, cfg.url)
  console.log('[API→]', (cfg.method || 'get').toUpperCase(), full, cfg.params ? { params: cfg.params } : '')
  cfg.metadata = { start: performance.now(), full }
  return cfg
})

api.interceptors.response.use(
  (res) => {
    const ms = performance.now() - (res.config.metadata?.start ?? performance.now())
    const finalUrl = res.request?.responseURL || res.config.metadata?.full || joinUrl(res.config.baseURL, res.config.url)
    const ct = res.headers?.['content-type'] || ''
    console.log('[API←]', res.status, finalUrl, `${ms.toFixed(0)}ms`, ct)
    if (!ct.includes('application/json')) console.warn('Respuesta no JSON (¿SPA?) desde:', finalUrl)
    return res
  },
  (err) => {
    const cfg = err.config || {}
    const finalUrl = err.request?.responseURL || joinUrl(cfg.baseURL, cfg.url)
    console.error('[API×]', err.response?.status ?? 'ERR', finalUrl, err.message)
    throw err
  }
)

// CRUD helpers
export const list       = (entity, params = {}) => api.get(`/${entity}`, { params }).then(r => r.data)
export const getOne     = (entity, id)          => api.get(`/${entity}`, { params: { id } }).then(r => r.data)
export const createOne  = (entity, payload)     => api.post(`/${entity}`, payload).then(r => r.data)
export const updateOne  = (entity, id, data)    => api.put(`/${entity}?id=${id}`, data).then(r => r.data)
export const deleteOne  = (entity, id)          => api.delete(`/${entity}?id=${id}`).then(r => r.data)
