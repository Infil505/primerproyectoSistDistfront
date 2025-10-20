<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register, login } from "../api"; // ← ya no importo saveAuth

const name = ref("");
const email = ref("");
const password = ref("");
const confirm = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

function extractErr(e) {
    return e?.response?.data?.error || e?.response?.data || e?.message || "Error al registrar";
}

async function onRegister() {
    error.value = "";

    // Normaliza email
    const e = String(email.value || "").trim().toLowerCase();
    if (!e) {
        error.value = "El correo es obligatorio";
        return;
    }
    // ⚠️ Si quieres obligar a Gmail, descomenta:
    // if (!/@gmail\.com$/i.test(e)) {
    //   error.value = "El correo debe ser @gmail.com";
    //   return;
    // }

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
        // 1) Crear usuario (espera { email, password, name })
        await register(e, password.value, String(name.value || "").trim());

        // 2) Login automático (api.login ya hace saveAuth por su interceptor)
        await login(e, password.value);

        // 3) Redirigir
        router.push("/home");
    } catch (err) {
        error.value = extractErr(err);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="center">
        <h2>Crear cuenta</h2>

        <form @submit.prevent="onRegister" class="form" novalidate>
            <input v-model.trim="name" type="text" placeholder="Nombre completo" required />

            <!-- Renombrado a email -->
            <input v-model.trim="email" type="email" placeholder="Correo electrónico" required />

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
            <!-- La ruta del login suele ser "/" -->
            <router-link to="/">Iniciar sesión</router-link>
        </p>
    </div>
</template>

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
