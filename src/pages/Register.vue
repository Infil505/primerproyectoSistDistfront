<template>
    <div class="center">
        <h2>Crear cuenta</h2>

        <form @submit.prevent="onRegister" class="form">
            <input v-model.trim="name" type="text" placeholder="Nombre completo" required />

            <input v-model.trim="gmail" type="email" placeholder="Correo (gmail)" required />

            <input v-model="password" type="password" placeholder="Contraseña (mínimo 8 caracteres)" minlength="8"
                required />

            <input v-model="confirm" type="password" placeholder="Confirmar contraseña" minlength="8" required />

            <button type="submit" :disabled="loading">
                {{ loading ? "Creando..." : "Registrarme" }}
            </button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>

        <p class="hint">
            ¿Ya tienes cuenta?
            <router-link to="/">Iniciar sesión</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register, login, saveAuth } from "../api";

const name = ref("");
const gmail = ref("");
const password = ref("");
const confirm = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

function extractErr(e) {
    return e?.response?.data?.error || e?.message || "Error al registrar";
}

async function onRegister() {
    error.value = "";

    if (password.value.length < 8) {
        error.value = "La contraseña debe tener al menos 8 caracteres";
        return;
    }
    if (password.value !== confirm.value) {
        error.value = "Las contraseñas no coinciden";
        return;
    }

    loading.value = true;
    try {
        // 1) Crear el usuario (POST /users -> 201 { _id, gmail, name })
        await register(gmail.value, password.value, name.value);

        // 2) Opcional pero útil: iniciar sesión automáticamente con las mismas credenciales
        const data = await login(gmail.value, password.value);
        saveAuth(data);

        // 3) Redirigir a la pantalla principal
        router.push("/edificios");
    } catch (e) {
        error.value = extractErr(e);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.center {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 300px;
}

.form input {
    padding: .6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

button {
    padding: .6rem;
    border: 0;
    border-radius: 6px;
    background: #0ea5e9;
    color: #fff;
    cursor: pointer;
}

.error {
    color: #e11d48;
}

.hint {
    font-size: .95rem;
}
</style>
