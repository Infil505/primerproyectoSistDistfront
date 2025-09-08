import axios from 'axios'

// Usa VITE_API_BASE con fallback a /api

const baseURL2 = import.meta.env.VITE_API_BASE || '/api'
const api = axios.create({ baseURL: baseURL2 })

// Mostrar URL final + params ANTES de enviar
api.interceptors.request.use((config) => {
  // URL “final” estimada (baseURL + url)
  const fullUrl = config.baseURL
    ? new URL(config.url ?? '', config.baseURL).toString()
    : (config.url ?? '')

  console.log(
    '[API→]',
    (config.method || 'get').toUpperCase(),
    fullUrl,
    config.params ? { params: config.params } : ''
  )

  // guardar para medir tiempo
  config.metadata = { start: performance.now(), fullUrl }
  return config
})

export const list     = (entity, params={}) => api.get(`/${entity}`, { params }).then(r => r.data)
export const getOne   = (entity, id)        => api.get(`/${entity}`, { params: { id } }).then(r => r.data)
export const createOne= (entity, payload)   => api.post(`/${entity}`, payload).then(r => r.data)
export const updateOne= (entity, id, data)  => api.put(`/${entity}?id=${id}`, data).then(r => r.data)
export const deleteOne= (entity, id)        => api.delete(`/${entity}?id=${id}`).then(r => r.data)

// Mostrar URL realmente usada, status y CT al volver
api.interceptors.response.use(
  (res) => {
    const ms = performance.now() - (res.config.metadata?.start ?? performance.now())
    const finalUrl =
      res.request?.responseURL || // URL real usada por XHR
      res.config.metadata?.fullUrl

    const ct = res.headers?.['content-type'] || ''
    console.log('[API←]', res.status, finalUrl, `${ms.toFixed(0)}ms`, ct)

    // Avisar si la API devolvió HTML (SPA) en vez de JSON
    if (!ct.includes('application/json')) {
      console.warn('Respuesta no JSON (¿SPA?) desde:', finalUrl)
    }
    return res
  },
  (err) => {
    const cfg = err.config || {}
    const finalUrl =
      err.request?.responseURL ||
      (cfg.baseURL ? new URL(cfg.url ?? '', cfg.baseURL).toString() : cfg.url)

    console.error('[API×]', err.response?.status ?? 'ERR', finalUrl, err.message)
    throw err
  }
)
