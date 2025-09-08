<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOne, getOne, updateOne } from '../api'

const route = useRoute(), router = useRouter()
const id = route.params.id

const form = ref({ nombre: '', nacionalidad: '', anio_nacimiento: null, imagen_url: '' })

async function loadOne() { if (id) form.value = await getOne('arquitectos', id) }
async function save() {
  const required = ['nombre','nacionalidad','anio_nacimiento','imagen_url']
  for (const f of required) { if (!form.value[f] && form.value[f] !== 0) { alert(`Falta: ${f}`); return } }
  if (id) await updateOne('arquitectos', id, form.value)
  else await createOne('arquitectos', form.value)
  router.push('/arquitectos')
}
onMounted(loadOne)
</script>

<template>
  <section style="padding:1rem;max-width:720px">
    <h1>{{ id ? 'Editar' : 'Nuevo' }} arquitecto</h1>
    <label>Nombre <input v-model="form.nombre"></label>
    <label>Nacionalidad <input v-model="form.nacionalidad"></label>
    <label>Año de nacimiento <input type="number" v-model.number="form.anio_nacimiento"></label>
    <label>Imagen URL <input v-model="form.imagen_url"></label>
    <div style="margin-top:1rem">
      <button @click="save">Guardar</button>
      <router-link to="/arquitectos" style="margin-left:.5rem">Cancelar</router-link>
    </div>
  </section>
</template>

<style>
label { display:block; margin:.5rem 0; }
input { width:100%; padding:.4rem; }
</style>

