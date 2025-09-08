<script setup>
import { ref, onMounted } from 'vue'
import { list, deleteOne } from '../api'

const items = ref([])
const loading = ref(false)

async function load() {
    loading.value = true
    items.value = await list('edificios')
    loading.value = false
}

async function remove(id) {
    if (!confirm('¿Eliminar edificio?')) return
    await deleteOne('edificios', id)
    await load()
}

onMounted(load)
</script>

<template>
    <section style="padding:1rem">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h1>Edificios</h1>
            <router-link to="/edificios/nuevo">➕ Nuevo</router-link>
        </header>

        <div v-if="loading">Cargando…</div>

        <ul v-else style="list-style:none;padding:0;display:grid;gap:.75rem">
            <li v-for="e in items" :key="e._id"
                style="background:white;border:1px solid #e5e7eb;border-radius:10px;padding:.75rem;display:flex;align-items:center;gap:.75rem">
                <img :src="e.imagen_url" alt="" style="height:60px;width:60px;object-fit:cover;border-radius:8px">
                <div style="flex:1">
                    <div><strong>{{ e.nombre }}</strong></div>
                    <small>{{ e.altura_m }} m — {{ e.pisos }} pisos — {{ e.uso }}</small>
                </div>
                <router-link :to="`/edificios/${e._id}`">Editar</router-link>
                <button @click="remove(e._id)">Eliminar</button>
            </li>
        </ul>
    </section>
</template>
