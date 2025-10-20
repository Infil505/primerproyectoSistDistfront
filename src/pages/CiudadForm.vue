<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOne, getOne, updateOne } from '../api'
import SuccessMessage from '../components/SuccessMessage.vue'

const route = useRoute(), router = useRouter()
const id = route.params.id

const form = ref({ nombre: '', pais: '', poblacion: null, imagen_url: '' })

const showMessage = ref(false)
const messageText = ref('')

async function loadOne() { if (id) form.value = await getOne('ciudades', id) }

async function save() {
  const required = ['nombre','pais','poblacion','imagen_url']
  for (const f of required) {
    if (!form.value[f] && form.value[f] !== 0) { alert(`Falta: ${f}`); return }
  }

  if (id) {
    await updateOne('ciudades', id, form.value)
    messageText.value = '✅ Los cambios de la ciudad fueron enviados a la cola de actualización.'
  } else {
    await createOne('ciudades', form.value)
    messageText.value = '🌆 La nueva ciudad fue agregada a la cola de procesamiento. ¡Gracias!'
  }

  showMessage.value = true
}

function handleHide() {
  showMessage.value = false
  router.push('/ciudades')
}

onMounted(loadOne)
</script>

<template>
  <section style="padding:1rem;max-width:720px;position:relative">
    <h1>{{ id ? 'Editar' : 'Nueva' }} ciudad</h1>

    <!-- Mensaje reutilizable -->
    <SuccessMessage v-if="showMessage" :show="showMessage" :duration="2500" @hide="handleHide">
      {{ messageText }}
    </SuccessMessage>

    <label>Nombre <input v-model="form.nombre"></label>
    <label>País <input v-model="form.pais"></label>
    <label>Población <input type="number" v-model.number="form.poblacion"></label>
    <label>Imagen URL <input v-model="form.imagen_url"></label>

    <div style="margin-top:1rem">
      <button @click="save">Guardar</button>
      <router-link to="/ciudades" style="margin-left:.5rem">Cancelar</router-link>
    </div>
  </section>
</template>

<style>
label { display:block; margin:.5rem 0; }
input { width:100%; padding:.4rem; }
</style>
