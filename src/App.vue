<template>
  <div class="app-container">
    <nav v-if="isAuthed" class="nav">
      <div class="nav-brand">
        <span class="brand-icon">🏙️</span>
        <strong class="brand-text">Catálogo de Edificios</strong>
      </div>
      
      <div class="nav-links">
        <router-link to="/edificios" class="nav-link">
          <span class="link-icon">🏢</span>
          Edificios
        </router-link>
        <router-link to="/ciudades" class="nav-link">
          <span class="link-icon">🌆</span>
          Ciudades
        </router-link>
        <router-link to="/arquitectos" class="nav-link">
          <span class="link-icon">👷</span>
          Arquitectos
        </router-link>
      </div>
      
      <div class="nav-actions">
        <button 
          class="process-queue" 
          @click="processQueue" 
          :disabled="processing"
          title="Procesar mensajes pendientes en RabbitMQ"
        >
          <span class="btn-icon">{{ processing ? '⏳' : '🗂️' }}</span>
          <span class="btn-text">{{ processing ? 'Procesando...' : 'Procesar Cola' }}</span>
        </button>
        
        <button class="logout" @click="logout">
          <span class="btn-icon">🚪</span>
          <span class="btn-text">Salir</span>
        </button>
      </div>
    </nav>

    <!-- Notificación de resultado -->
    <transition name="slide-fade">
      <div v-if="queueResult" :class="['queue-notification', queueResult.type]">
        <button class="close-btn" @click="queueResult = null" aria-label="Cerrar">×</button>
        <div class="notification-header">
          <span class="notification-icon">{{ queueResult.type === 'success' ? '✅' : '❌' }}</span>
          <strong class="notification-title">{{ queueResult.title }}</strong>
        </div>
        <div class="queue-stats">
          <div class="stat-item">
            <span class="stat-label">📊 Procesados</span>
            <span class="stat-value">{{ queueResult.processed }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">✅ Exitosos</span>
            <span class="stat-value">{{ queueResult.succeeded }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">❌ Fallidos</span>
            <span class="stat-value">{{ queueResult.failed }}</span>
          </div>
        </div>
        <div v-if="queueResult.errors?.length" class="error-details">
          <details>
            <summary>Ver errores ({{ queueResult.errors.length }})</summary>
            <ul>
              <li v-for="(err, i) in queueResult.errors" :key="i">{{ err.error }}</li>
            </ul>
          </details>
        </div>
      </div>
    </transition>

    <router-view />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { clearAuth, getAuth, processQueue as processQueueAPI } from "./api";

const router = useRouter();
const isAuthed = computed(() => !!getAuth());

const processing = ref(false);
const queueResult = ref(null);

function logout() {
  clearAuth();
  router.push("/");
}
async function processQueue() {
  processing.value = true;
  queueResult.value = null;

  try {
    const data = await processQueueAPI();

    if (data.success) {
      queueResult.value = {
        type: "success",
        title: "Cola procesada exitosamente",
        processed: data.processed,
        succeeded: data.succeeded,
        failed: data.failed,
        errors: data.errors || [],
      };

      if (data.failed === 0) {
        setTimeout(() => {
          router.go(0);
        }, 1200);
      } else {
        setTimeout(() => {
          queueResult.value = null;
        }, 10000);
      }
    } else {
      throw new Error(data.error || "Error desconocido");
    }
  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message;
    queueResult.value = {
      type: "error",
      title: "Error al procesar cola",
      processed: error.response?.data?.processed || 0,
      succeeded: error.response?.data?.succeeded || 0,
      failed: error.response?.data?.failed || 0,
      errors: error.response?.data?.errors || [{ error: errorMsg }],
    };
  } finally {
    processing.value = false;
  }
}

</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #ffffff;
}

/* Navegación */
.nav {
  padding: 1rem 2rem;
  background: #ffffff;
  display: flex;
  gap: 2rem;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e5e7eb;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
}

.brand-text {
  font-size: 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.nav-link {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #667eea;
}

.nav-link:hover::before {
  width: 80%;
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.nav-link.router-link-active::before {
  display: none;
}

.link-icon {
  font-size: 1.1rem;
}

.nav-actions {
  display: flex;
  gap: 0.75rem;
}

/* Botones */
.process-queue,
.logout {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.process-queue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.process-queue:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.process-queue:active:not(:disabled) {
  transform: translateY(0);
}

.process-queue:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.logout {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.logout:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Notificación */
.queue-notification {
  position: fixed;
  top: 100px;
  right: 30px;
  min-width: 420px;
  max-width: 500px;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  background: white;
}

.queue-notification.success {
  border-left: 6px solid #10b981;
}

.queue-notification.error {
  border-left: 6px solid #ef4444;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
}

.queue-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
}

.stat-item {
  background: #f9fafb;
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.stat-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #111827;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #111827;
  transform: rotate(90deg);
}

.error-details {
  margin-top: 1rem;
  font-size: 0.85rem;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.error-details summary {
  cursor: pointer;
  user-select: none;
  padding: 0.25rem;
  font-weight: 600;
  color: #991b1b;
}

.error-details summary:hover {
  text-decoration: underline;
}

.error-details ul {
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  max-height: 150px;
  overflow-y: auto;
}

.error-details ul::-webkit-scrollbar {
  width: 6px;
}

.error-details ul::-webkit-scrollbar-track {
  background: #fee2e2;
  border-radius: 3px;
}

.error-details ul::-webkit-scrollbar-thumb {
  background: #fca5a5;
  border-radius: 3px;
}

.error-details ul::-webkit-scrollbar-thumb:hover {
  background: #f87171;
}

.error-details li {
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  color: #7f1d1d;
}

/* Animaciones */
.slide-fade-enter-active {
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-fade-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(100%) scale(0.9);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .nav {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-links {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .brand-text {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 1rem;
  }

  .queue-notification {
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }

  .nav-link .btn-text,
  .btn-text {
    display: none;
  }

  .queue-stats {
    grid-template-columns: 1fr;
  }
}
</style>