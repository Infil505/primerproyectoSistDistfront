<template>
    <div class="center">
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="onLogin" class="form">
            <input v-model.trim="email" type="email" placeholder="Correo electrónico" required />
            <input v-model="password" type="password" placeholder="Contraseña" minlength="8" required />
            <button type="submit" :disabled="loading">
                {{ loading ? "Ingresando..." : "Entrar" }}
            </button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>

        <p class="hint">
            ¿No tienes cuenta?
            <router-link to="/register">Crear una cuenta</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login, saveAuth } from "../api";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

function extractErr(e) {
    return e?.response?.data?.error || e?.message || "Error al iniciar sesión";
}

async function onLogin() {
    error.value = "";
    loading.value = true;
    try {
        // ✅ Enviar email normalizado
        const data = await login(email.value.trim().toLowerCase(), password.value);
        saveAuth(data); // Guarda { user, token }
        router.push("/home"); // Redirige al área protegida
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
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

button {
    padding: 0.6rem;
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
    font-size: 0.95rem;
}
</style>
