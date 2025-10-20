import { ref, computed } from "vue";
import { getAuth, saveAuth, clearAuth, login as apiLogin } from "../api";

const state = ref(getAuth()); // { user, token } | null

// Mantén sincronizado si abres varias pestañas
window.addEventListener("storage", (e) => {
  if (e.key === "auth") state.value = getAuth();
});

export function useAuth() {
  const isAuthed = computed(() => !!state.value?.token);
  const user = computed(() => state.value?.user || null);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    state.value = data;
    return data;
  }

  function logout() {
    clearAuth();
    state.value = null;
    if (location.pathname !== "/") location.replace("/");
  }

  function setAuth(obj) {
    saveAuth(obj);
    state.value = obj;
  }

  return { isAuthed, user, login, logout, setAuth };
}
