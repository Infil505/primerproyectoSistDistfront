<script setup>
import { ref, onMounted } from 'vue'
import { list, getOne, createOne, updateOne } from '../api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(), router = useRouter()
const id = route.params.id

const form = ref({
  nombre: '',
  altura_m: null,
  pisos: null,
  anio_inauguracion: null,
  uso: '',
  imagen_url: '',
  ciudad_id: '',
  arquitecto_id: ''
})

const ciudades = ref([])
const arquitectos = ref([])

async function loadRefs() {
  ciudades.value = await list('ciudades')
  arquitectos.value = await list('arquitectos')
}
async function loadOne() {
  if (id) form.value = await getOne('edificios', id)
}
async function save() {
  // validación mínima
  const required = ['nombre','altura_m','pisos','anio_inauguracion','uso','imagen_url','ciudad_id','arquitecto_id']
  for (const f of required) {
    if (!form.value[f] && form.value[f] !== 0) { alert(`Falta: ${f}`); return }
  }
  if (id) await updateOne('edificios', id, form.value)
  else await createOne('edificios', form.value)
  router.push('/edificios')
}

onMounted(async () => { await loadRefs(); await loadOne() })
</script>

<template>
  <section style="padding:1rem;max-width:780px">
    <h1>{{ id ? 'Editar' : 'Nuevo' }} edificio</h1>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <label>Nombre <input v-model="form.nombre"></label>
      <label>Uso <input v-model="form.uso"></label>

      <label>Altura (m) <input type="number" v-model.number="form.altura_m"></label>
      <label>Pisos <input type="number" v-model.number="form.pisos"></label>

      <label>Año inauguración <input type="number" v-model.number="form.anio_inauguracion"></label>
      <label>Imagen URL <input v-model="form.imagen_url"></label>

      <label>Ciudad
        <select v-model="form.ciudad_id">
          <option disabled value="">-- seleccionar --</option>
          <option v-for="c in ciudades" :key="c._id" :value="c._id">{{ c.nombre }} — {{ c.pais }}</option>
        </select>
      </label>

      <label>Arquitecto
        <select v-model="form.arquitecto_id">
          <option disabled value="">-- seleccionar --</option>
          <option v-for="a in arquitectos" :key="a._id" :value="a._id">{{ a.nombre }} ({{ a.nacionalidad }})</option>
        </select>
      </label>
    </div>

    <div style="margin-top:1rem">
      <button @click="save">Guardar</button>
      <router-link to="/edificios" style="margin-left:.5rem">Cancelar</router-link>
    </div>
  </section>
</template>

<style>
label { display:block; }
input, select { width:100%; padding:.4rem; }
</style>
