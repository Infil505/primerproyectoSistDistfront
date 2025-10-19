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
    // intenta leer mensaje del backend; cae a message; luego genérico
    return e?.response?.data?.error || e?.response?.data || e?.message || "Error al registrar";
}

async function onRegister() {
    error.value = "";

    // Validaciones de cliente
    const e = String(gmail.value || "").trim().toLowerCase();
    if (!e) {
        error.value = "El correo es obligatorio";
        return;
    }
    // Si de verdad quieres limitar a Gmail (por tu placeholder):
    if (!/@gmail\.com$/i.test(e)) {
        error.value = "El correo debe ser @gmail.com";
        return;
    }

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
        // 1) Crear usuario (espera { name, email, password })
        await register(e, password.value, String(name.value || "").trim());

        // 2) Login automático
        const data = await login(e, password.value);
        saveAuth(data);

        // 3) Redirigir
        router.push("/edificios");
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
            <input v-model.trim="gmail" type="gmail" placeholder="Correo (gmail)" required />

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
