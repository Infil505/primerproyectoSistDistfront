<script setup>
import { ref, onMounted } from 'vue'
import { list, deleteOne } from '../api'

const items = ref([])
const loading = ref(false)

async function load() {
    loading.value = true
    items.value = await list('arquitectos')
    console.log(items.value)
    loading.value = false
}
async function remove(id) {
    if (!confirm('¿Eliminar arquitecto?')) return
    await deleteOne('arquitectos', id)
    await load()
}
onMounted(load)
</script>

<template>
    <section style="padding:1rem">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h1>Arquitectos</h1>
            <router-link to="/arquitectos/nuevo">➕ Nuevo</router-link>
        </header>
        <div v-if="loading">Cargando…</div>
        <ul v-else style="list-style:none;padding:0;display:grid;gap:.75rem">
            <li v-for="a in items" :key="a._id"
                style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:.75rem;display:flex;align-items:center;gap:.75rem">
                <img :src="a.imagen_url" alt="" style="height:60px;width:60px;object-fit:cover;border-radius:8px">
                <div style="flex:1">
                    <div><strong>{{ a.nombre }}</strong></div>
                    <small>{{ a.nacionalidad }} — Nac.: {{ a.anio_nacimiento }}</small>
                </div>
                <router-link :to="`/arquitectos/${a._id}`">Editar</router-link>
                <button @click="remove(a._id)">Eliminar</button>
            </li>
        </ul>
    </section>
</template>
