<script setup>
import { ref, onMounted } from 'vue'
import { list, deleteOne } from '../api'
import SuccessMessage from '../components/SuccessMessage.vue'

const items = ref([])
const loading = ref(false)

// Estado del mensaje reutilizable
const showMessage = ref(false)
const messageText = ref('')

async function load() {
    loading.value = true
    items.value = await list('arquitectos')
    loading.value = false
}

async function remove(id) {
    if (!confirm('¿Eliminar arquitecto?')) return
    await deleteOne('arquitectos', id)

    messageText.value = '🗑️ El arquitecto fue enviado a la cola de eliminación.'
    showMessage.value = true

    setTimeout(async () => {
        showMessage.value = false
        await load()
    }, 2500)
}

function calcularEdad(anioNacimiento) {
    if (!anioNacimiento) return null
    const anioActual = new Date().getFullYear()
    return anioActual - anioNacimiento
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
            <h1>Arquitectos</h1>
            <router-link to="/arquitectos/nuevo"
                style="background:#3b82f6;color:white;padding:.5rem 1rem;border-radius:8px;text-decoration:none">➕
                Nuevo</router-link>
        </header>

        <!-- Mensaje reutilizable -->
        <SuccessMessage v-if="showMessage" :show="showMessage" :duration="2500" @hide="showMessage = false">
            {{ messageText }}
        </SuccessMessage>

        <div v-if="loading" style="text-align:center;padding:2rem;color:#6b7280">Cargando…</div>

        <ul v-else style="list-style:none;padding:0;display:grid;gap:1rem">
            <li v-for="a in items" :key="a._id"
                style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:1rem;display:flex;align-items:center;gap:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:box-shadow 0.2s">
                <img :src="a.imagen_url" :alt="a.nombre"
                    style="height:80px;width:80px;object-fit:cover;border-radius:10px;flex-shrink:0">
                <div style="flex:1;display:grid;gap:.25rem">
                    <div style="display:flex;align-items:center;gap:.5rem">
                        <strong style="font-size:1.125rem;color:#111827">{{ a.nombre }}</strong>
                    </div>
                    <div style="color:#6b7280;font-size:.875rem">
                        <span style="font-weight:500">Nacionalidad:</span> {{ a.nacionalidad }}
                    </div>
                    <div style="color:#6b7280;font-size:.875rem">
                        <span style="font-weight:500">Año de nacimiento:</span> {{ a.anio_nacimiento }}
                        <span v-if="calcularEdad(a.anio_nacimiento)" style="color:#9ca3af">
                            ({{ calcularEdad(a.anio_nacimiento) }} años)
                        </span>
                    </div>
                    <div v-if="a.updatedAt" style="color:#9ca3af;font-size:.75rem;margin-top:.25rem">
                        <span style="font-weight:500">Última actualización:</span> {{ formatDate(a.updatedAt) }}
                    </div>
                </div>
                <div style="display:flex;gap:.5rem;flex-shrink:0">
                    <router-link :to="`/arquitectos/${a._id}`"
                        style="background:#10b981;color:white;padding:.5rem 1rem;border-radius:6px;text-decoration:none;font-size:.875rem">✏️
                        Editar</router-link>
                    <button @click="remove(a._id)"
                        style="background:#ef4444;color:white;padding:.5rem 1rem;border-radius:6px;border:none;cursor:pointer;font-size:.875rem">🗑️
                        Eliminar</button>
                </div>
            </li>
        </ul>

        <div v-if="!loading && items.length === 0" style="text-align:center;padding:3rem;color:#9ca3af">
            No hay arquitectos registrados. ¡Agrega el primero!
        </div>
    </section>
</template>

<style scoped>
li:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
}

button:hover {
    opacity: 0.9;
}

a:hover {
    opacity: 0.9;
}
</style>
