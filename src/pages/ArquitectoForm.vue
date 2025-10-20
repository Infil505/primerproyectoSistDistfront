<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createOne, getOne, updateOne } from '../api'
import SuccessMessage from '../components/SuccessMessage.vue'

const route = useRoute(), router = useRouter()
const id = route.params.id

const form = ref({ nombre: '', nacionalidad: '', anio_nacimiento: null, imagen_url: '' })

const showMessage = ref(false)
const messageText = ref('')

async function loadOne() {
  if (id) form.value = await getOne('arquitectos', id)
}

async function save() {
  const required = ['nombre', 'nacionalidad', 'anio_nacimiento', 'imagen_url']
  for (const f of required) {
    if (!form.value[f] && form.value[f] !== 0) { alert(`Falta: ${f}`); return }
  }

  if (id) {
    await updateOne('arquitectos', id, form.value)
    messageText.value = '✅ Los cambios del arquitecto fueron enviados a la cola de actualización.'
  } else {
    await createOne('arquitectos', form.value)
    messageText.value = '🧑‍🎨 El nuevo arquitecto fue agregado a la cola de procesamiento. ¡Gracias!'
  }

  showMessage.value = true
}

function handleHide() {
  showMessage.value = false
  router.push('/arquitectos')
}

onMounted(loadOne)
</script>

<template>
  <section style="padding:1rem;max-width:720px;position:relative">
    <h1>{{ id ? 'Editar' : 'Nuevo' }} arquitecto</h1>

    <!-- Mensaje reutilizable -->
    <SuccessMessage v-if="showMessage" :show="showMessage" :duration="2500" @hide="handleHide">
      {{ messageText }}
    </SuccessMessage>

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
/* Tu mismo CSS elegante se mantiene igual */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-700: #374151;
  --gray-900: #111827;
  --white: #ffffff;
  --success: #10b981;
  --radius: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.form-row:nth-child(1) {
  animation-delay: .1s
}

.form-row:nth-child(2) {
  animation-delay: .2s
}

.form-row:nth-child(3) {
  animation-delay: .3s
}

.form-row:nth-child(4) {
  animation-delay: .4s
}

.form-row:nth-child(5) {
  animation-delay: .5s
}

.form-full-width {
  grid-column: 1 / -1;
}

h1 {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--gray-900);
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInDown 0.6s ease-out;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.875rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 1rem;
  background: var(--white);
  color: var(--gray-900);
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  position: relative;
}

input:hover,
select:hover {
  border-color: var(--gray-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, .15);
}

input:not(:placeholder-shown) {
  border-color: var(--success);
  background: rgba(16, 185, 129, .03);
}

button {
  background: var(--primary);
  color: var(--white);
  border: none;
  padding: .875rem 2rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, .2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width .6s, height .6s;
}

button:active::before {
  width: 300px;
  height: 300px;
}

button:hover {
  background: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, .3);
}

button:active {
  transform: translateY(-1px);
}

a {
  color: var(--gray-400);
  text-decoration: none;
  padding: .875rem 1.5rem;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  border: 2px solid transparent;
}

a:hover {
  color: var(--gray-700);
  background: var(--gray-100);
  border-color: var(--gray-200);
  transform: translateY(-2px);
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right .75rem center;
  background-repeat: no-repeat;
  background-size: 1rem;
  padding-right: 2.5rem;
  appearance: none;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

input:focus+.floating-label,
input:not(:placeholder-shown)+.floating-label {
  transform: translateY(-1.5rem) scale(.875);
  color: var(--primary);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-full-width {
    grid-column: 1;
  }

  h1 {
    font-size: 1.5rem;
  }

  button,
  a {
    width: 100%;
    text-align: center;
  }
}

input:focus {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 20px rgba(59, 130, 246, .15);
  }

  50% {
    box-shadow: 0 8px 20px rgba(59, 130, 246, .25);
  }

  100% {
    box-shadow: 0 8px 20px rgba(59, 130, 246, .15);
  }
}

button:disabled {
  opacity: .7;
  animation: loading 1.5s infinite;
}

@keyframes loading {

  0%,
  100% {
    transform: translateY(-3px) scale(1);
  }

  50% {
    transform: translateY(-3px) scale(1.02);
  }
}

* {
  box-sizing: border-box;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
