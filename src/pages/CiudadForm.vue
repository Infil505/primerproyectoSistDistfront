<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOne, getOne, updateOne } from '../api'

const route = useRoute(), router = useRouter()
const id = route.params.id

const form = ref({ nombre: '', pais: '', poblacion: null, imagen_url: '' })

async function loadOne() { if (id) form.value = await getOne('ciudades', id) }
async function save() {
  const required = ['nombre','pais','poblacion','imagen_url']
  for (const f of required) { if (!form.value[f] && form.value[f] !== 0) { alert(`Falta: ${f}`); return } }
  if (id) await updateOne('ciudades', id, form.value)
  else await createOne('ciudades', form.value)
  router.push('/ciudades')
}
onMounted(loadOne)
</script>

<template>
  <section style="padding:1rem;max-width:720px">
    <h1>{{ id ? 'Editar' : 'Nueva' }} ciudad</h1>
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
