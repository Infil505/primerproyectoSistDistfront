import axios from 'axios'

// Usa VITE_API_BASE con fallback a /api

const baseURL = import.meta.env.VITE_API_BASE || '/api'
const api = axios.create({ baseURL: '/api' })

export const list     = (entity, params={}) => api.get(`/${entity}`, { params }).then(r => r.data)
export const getOne   = (entity, id)        => api.get(`/${entity}`, { params: { id } }).then(r => r.data)
export const createOne= (entity, payload)   => api.post(`/${entity}`, payload).then(r => r.data)
export const updateOne= (entity, id, data)  => api.put(`/${entity}?id=${id}`, data).then(r => r.data)
export const deleteOne= (entity, id)        => api.delete(`/${entity}?id=${id}`).then(r => r.data)
