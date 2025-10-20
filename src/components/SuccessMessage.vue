<template>
    <transition name="fade">
        <div v-if="visible" class="success-message" role="status" aria-live="polite">
            <slot>✅ Acción realizada correctamente.</slot>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    duration: { type: Number, default: 3000 },
})

const emit = defineEmits(['hide'])

const visible = ref(false)
let timer = null

function openOnce() {
    if (timer) clearTimeout(timer)
    visible.value = true
    timer = setTimeout(() => {
        visible.value = false
        emit('hide')
    }, props.duration)
}

// Reacciona cuando cambie `show` (incluido al montar si ya viene en true)
watch(
    () => props.show,
    (val) => { if (val) openOnce() },
    { immediate: true }
)

onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.success-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #10b981;
    color: white;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    font-weight: 500;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: pop 0.25s ease-out;
    z-index: 1000;
}

@keyframes pop {
    0% {
        transform: translate(-50%, -10px);
        opacity: 0;
    }

    100% {
        transform: translate(-50%, 0);
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
