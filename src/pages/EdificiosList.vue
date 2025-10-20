<script setup>
import { ref, onMounted } from 'vue'
import { list, deleteOne } from '../api'
import SuccessMessage from '../components/SuccessMessage.vue'

const items = ref([])
const loading = ref(false)

// Diccionarios: { _id: { ...doc } }
const arquitectosById = ref({})
const ciudadesById = ref({})

// Estado del mensaje
const showMessage = ref(false)
const messageText = ref('')

function indexById(arr = []) {
    return (arr || []).reduce((acc, it) => {
        if (it && it._id) acc[it._id] = it
        return acc
    }, {})
}

async function load() {
    loading.value = true
    try {
        const [edificios, arquitectos, ciudades] = await Promise.all([
            list('edificios'),
            list('arquitectos'),
            list('ciudades'),
        ])
        items.value = edificios || []
        arquitectosById.value = indexById(arquitectos)
        ciudadesById.value = indexById(ciudades)
    } finally {
        loading.value = false
    }
}

async function remove(id) {
    if (!confirm('¿Eliminar edificio?')) return
    await deleteOne('edificios', id)

    // Mostrar mensaje
    messageText.value = '🗑️ El edificio fue enviado a la cola de eliminación.'
    showMessage.value = true

    // Recargar después de unos segundos
    setTimeout(async () => {
        showMessage.value = false
        await load()
    }, 2500)
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

function calcularAntiguedad(anioInauguracion) {
    if (!anioInauguracion) return null
    const anioActual = new Date().getFullYear()
    const antiguedad = anioActual - anioInauguracion
    return antiguedad === 0 ? 'Inaugurado este año' : `${antiguedad} años`
}

function formatUso(uso) {
    if (!uso) return 'N/A'
    return uso.charAt(0).toUpperCase() + uso.slice(1)
}

// Helpers para mostrar nombres
function nombreArquitecto(id) {
    return arquitectosById.value[id]?.nombre || 'Desconocido'
}
function nombreCiudad(id) {
    return ciudadesById.value[id]?.nombre || 'Desconocida'
}

onMounted(load)
</script>

<template>
    <section style="padding:1rem">
        <header style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h1>Edificios</h1>
            <router-link to="/edificios/nuevo"
                style="background:#3b82f6;color:white;padding:.5rem 1rem;border-radius:8px;text-decoration:none">
                ➕ Nuevo
            </router-link>
        </header>

        <!-- Mensaje bonito -->
        <SuccessMessage v-if="showMessage" :show="showMessage" :duration="2500" @hide="showMessage = false">
            {{ messageText }}
        </SuccessMessage>

        <div v-if="loading" style="text-align:center;padding:2rem;color:#6b7280">Cargando…</div>

        <ul v-else style="list-style:none;padding:0;display:grid;gap:1rem">
            <li v-for="e in items" :key="e._id"
                style="background:white;border:1px solid #e5e7eb;border-radius:12px;padding:1rem;display:flex;align-items:center;gap:1rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:box-shadow 0.2s">
                <img :src="e.imagen_url" :alt="e.nombre"
                    style="height:100px;width:100px;object-fit:cover;border-radius:10px;flex-shrink:0">

                <div style="flex:1;display:grid;gap:.3rem">
                    <div style="display:flex;align-items:center;gap:.5rem">
                        <strong style="font-size:1.125rem;color:#111827">{{ e.nombre }}</strong>
                    </div>

                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem;margin-top:.25rem">
                        <div style="color:#6b7280;font-size:.875rem">
                            <span style="font-weight:500">🏢 Altura:</span> {{ e.altura_m }} metros
                        </div>
                        <div style="color:#6b7280;font-size:.875rem">
                            <span style="font-weight:500">📊 Pisos:</span> {{ e.pisos }}
                        </div>
                        <div style="color:#6b7280;font-size:.875rem">
                            <span style="font-weight:500">📅 Inauguración:</span> {{ e.anio_inauguracion }}
                            <span v-if="calcularAntiguedad(e.anio_inauguracion)" style="color:#9ca3af">
                                ({{ calcularAntiguedad(e.anio_inauguracion) }})
                            </span>
                        </div>
                        <div style="color:#6b7280;font-size:.875rem">
                            <span style="font-weight:500">🏗️ Uso:</span> {{ formatUso(e.uso) }}
                        </div>
                    </div>

                    <div style="display:flex;gap:1rem;margin-top:.25rem;flex-wrap:wrap">
                        <div v-if="e.ciudad_id" style="color:#9ca3af;font-size:.85rem">
                            <span style="font-weight:600;color:#6b7280">🌆 Ciudad:</span>
                            <router-link :to="`/ciudades/${e.ciudad_id}`"
                                style="margin-left:.25rem;color:#2563eb;text-decoration:none">
                                {{ nombreCiudad(e.ciudad_id) }}
                            </router-link>
                        </div>

                        <div v-if="e.arquitecto_id" style="color:#9ca3af;font-size:.85rem">
                            <span style="font-weight:600;color:#6b7280">🧑‍🎨 Arquitecto:</span>
                            <router-link :to="`/arquitectos/${e.arquitecto_id}`"
                                style="margin-left:.25rem;color:#2563eb;text-decoration:none">
                                {{ nombreArquitecto(e.arquitecto_id) }}
                            </router-link>
                        </div>
                    </div>

                    <div v-if="e.updatedAt" style="color:#9ca3af;font-size:.75rem;margin-top:.25rem">
                        <span style="font-weight:500">Última actualización:</span> {{ formatDate(e.updatedAt) }}
                    </div>
                </div>

                <div style="display:flex;gap:.5rem;flex-shrink:0">
                    <router-link :to="`/edificios/${e._id}`"
                        style="background:#10b981;color:white;padding:.5rem 1rem;border-radius:6px;text-decoration:none;font-size:.875rem">
                        ✏️ Editar
                    </router-link>
                    <button @click="remove(e._id)"
                        style="background:#ef4444;color:white;padding:.5rem 1rem;border-radius:6px;border:none;cursor:pointer;font-size:.875rem">
                        🗑️ Eliminar
                    </button>
                </div>
            </li>
        </ul>

        <div v-if="!loading && items.length === 0" style="text-align:center;padding:3rem;color:#9ca3af">
            No hay edificios registrados. ¡Agrega el primero!
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
