<template>
    <div class="center">
        <div class="card">
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
        const data = await login(email.value.trim().toLowerCase(), password.value);
        saveAuth(data);
        router.push("/home");
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
    padding: 20px;
    background: linear-gradient(135deg, #f2f2f3 0%, #9d96a3 100%);
}

.card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

h2 {
    margin: 0;
    text-align: center;
    color: #1f2937;
    font-size: 1.75rem;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form input {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form input:focus {
    outline: none;
    border-color: #0ea5e9;
}

button {
    padding: 0.75rem;
    border: 0;
    border-radius: 8px;
    background: #0ea5e9;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: background 0.2s;
}

button:hover:not(:disabled) {
    background: #0284c7;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    color: #e11d48;
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
}

.hint {
    font-size: 0.95rem;
    text-align: center;
    color: #6b7280;
    margin: 0;
}

.hint a {
    color: #0ea5e9;
    text-decoration: none;
    font-weight: 500;
}

.hint a:hover {
    text-decoration: underline;
}
</style>