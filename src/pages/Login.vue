<template>
    <div class="center">
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="onLogin" class="form">
            <input v-model.trim="gmail" type="email" placeholder="Correo" required />
            <input v-model="password" type="password" placeholder="Contraseña" required />
            <button type="submit">Entrar</button>
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

const gmail = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

function extractErr(e) {
    return e?.response?.data?.error || e?.message || "Error al iniciar sesión";
}

async function onLogin() {
    error.value = "";
    try {
        const data = await login(gmail.value, password.value);
        saveAuth(data);
        router.push("/home");
    } catch (e) {
        error.value = extractErr(e);
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
    gap: 12px
}

.form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 300px
}

.form input {
    padding: .6rem;
    border: 1px solid #ddd;
    border-radius: 6px
}

button {
    padding: .6rem;
    border: 0;
    border-radius: 6px;
    background: #0ea5e9;
    color: #fff;
    cursor: pointer
}

.error {
    color: #e11d48
}

.hint {
    font-size: .95rem;
}
</style>
