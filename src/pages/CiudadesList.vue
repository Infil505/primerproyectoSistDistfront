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
onMounted(load)
</script>

<template>
  <section style="padding:1rem">
    <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
      <h1>Ciudades</h1>
      <router-link to="/ciudades/nuevo">➕ Nueva</router-link>
    </header>
    <div v-if="loading">Cargando…</div>
    <ul v-else style="list-style:none;padding:0;display:grid;gap:.75rem">
      <li v-for="c in items" :key="c._id" style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:.75rem;display:flex;align-items:center;gap:.75rem">
        <img :src="c.imagen_url" alt="" style="height:60px;width:60px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div><strong>{{ c.nombre }}</strong></div>
          <small>{{ c.pais }} — Población: {{ c.poblacion?.toLocaleString?.() }}</small>
        </div>
        <router-link :to="`/ciudades/${c._id}`">Editar</router-link>
        <button @click="remove(c._id)">Eliminar</button>
      </li>
    </ul>
  </section>
</template>
