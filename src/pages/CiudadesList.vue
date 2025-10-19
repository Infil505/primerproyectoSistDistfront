<script setup>
import { onMounted, ref } from 'vue'
import { deleteOne, list } from '../api'

const items = ref([])
const loading = ref(false)

async function load() {
  loading.value = true
  items.value = await list('ciudades')
  loading.value = false
}
async function remove(id) {
  if (!confirm('¿Eliminar ciudad?')) return
  await deleteOne('ciudades', id)
  await load()
}

function formatDate(date) {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(load)
</script>

<template>
  <section style="padding:1rem">
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h1>Ciudades</h1>
      <router-link to="/ciudades/nuevo" style="background:#3b82f6;color:white;padding:.5rem 1rem;border-radius:8px;text-decoration:none">➕ Nueva</router-link>
    </header>
    <div v-if="loading" style="text-align:center;padding:2rem;color:#6b7280">Cargando…</div>
    <ul v-else style="list-style:none;padding:0;display:grid;gap:1rem">
      <li v-for="c in items" :key="c._id" style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:1rem;display:flex;align-items:center;gap:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:box-shadow 0.2s">
        <img :src="c.imagen_url" :alt="c.nombre" style="height:80px;width:80px;object-fit:cover;border-radius:10px;flex-shrink:0">
        <div style="flex:1;display:grid;gap:.25rem">
          <div style="display:flex;align-items:center;gap:.5rem">
            <strong style="font-size:1.125rem;color:#111827">{{ c.nombre }}</strong>
          </div>
          <div style="color:#6b7280;font-size:.875rem">
            <span style="font-weight:500">País:</span> {{ c.pais }}
          </div>
          <div style="color:#6b7280;font-size:.875rem">
            <span style="font-weight:500">Población:</span> {{ c.poblacion?.toLocaleString?.('es-ES') || 'N/A' }} habitantes
          </div>
          <div style="color:#9ca3af;font-size:.75rem;margin-top:.25rem">
            <span style="font-weight:500">Última actualización:</span> {{ formatDate(c.updatedAt) }}
          </div>
        </div>
        <div style="display:flex;gap:.5rem;flex-shrink:0">
          <router-link :to="`/ciudades/${c._id}`" style="background:#10b981;color:white;padding:.5rem 1rem;border-radius:6px;text-decoration:none;font-size:.875rem">✏️ Editar</router-link>
          <button @click="remove(c._id)" style="background:#ef4444;color:white;padding:.5rem 1rem;border-radius:6px;border:none;cursor:pointer;font-size:.875rem">🗑️ Eliminar</button>
        </div>
      </li>
    </ul>
    <div v-if="!loading && items.length === 0" style="text-align:center;padding:3rem;color:#9ca3af">
      No hay ciudades registradas. ¡Agrega la primera!
    </div>
  </section>
</template>

<style scoped>
li:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
}
button:hover {
  opacity: 0.9;
}
a:hover {
  opacity: 0.9;
}
</style>