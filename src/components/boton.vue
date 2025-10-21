<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    to: {
        type: String,
        default: '/home'
    },
    text: {
        type: String,
        default: 'Inicio'
    },
    icon: {
        type: String,
        default: '←'
    },
    variant: {
        type: String,
        default: 'gray',
        validator: (value) => ['gray', 'blue', 'purple'].includes(value)
    },
    useHistory: {
        type: Boolean,
        default: false
    }
})

const router = useRouter()

const colors = {
    gray: '#6b7280',
    blue: '#3b82f6',
    purple: '#8b5cf6'
}

const hoverColors = {
    gray: '#4b5563',
    blue: '#2563eb',
    purple: '#7c3aed'
}

function handleClick() {
    if (props.useHistory) {
        router.back()
    }
}
</script>

<template>
    <router-link v-if="!useHistory" :to="to" :style="{
        background: colors[variant],
        color: 'white',
        padding: '.5rem 1rem',
        borderRadius: '8px',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.5rem',
        transition: 'all 0.2s',
        fontSize: '.875rem',
        fontWeight: '500'
    }" class="back-button">
        <span>{{ icon }}</span>
        <span>{{ text }}</span>
    </router-link>

    <button v-else @click="handleClick" :style="{
        background: colors[variant],
        color: 'white',
        padding: '.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.5rem',
        transition: 'all 0.2s',
        fontSize: '.875rem',
        fontWeight: '500',
        cursor: 'pointer'
    }" class="back-button">
        <span>{{ icon }}</span>
        <span>{{ text }}</span>
    </button>
</template>

<style scoped>
.back-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.back-button:active {
    transform: translateY(0);
}
</style>