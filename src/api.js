import axios from "axios";

// ---------------- Base URL ----------------
function resolveBaseURL() {
  const envBase = (import.meta.env.VITE_API_BASE || "").trim();
  if (envBase) return envBase.replace(/\/$/, "");
  return import.meta.env.DEV
    ? "/api"
    : "https://lucent-toffee-15f013.netlify.app/.netlify/functions";
}

const baseURL = resolveBaseURL();
console.log("[API base]", baseURL);

// --------------- Auth storage ---------------
const AUTH_KEY = "auth";

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}
export function saveAuth(obj) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(obj || null));
}
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

// --------------- Axios instance ---------------
export const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
  // importante para sesiones (cookie 'sid')
  withCredentials: true,
});

const isAbs = (s) => /^https?:\/\//i.test(s || "");
const joinUrl = (base, path) => {
  base = base || "";
  path = path || "";
  if (isAbs(base)) return new URL(path, base).toString();
  const b = base.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

// --------------- Interceptors ---------------
api.interceptors.request.use((cfg) => {
  const full = joinUrl(cfg.baseURL, cfg.url);
  console.log(
    "[API→]",
    (cfg.method || "get").toUpperCase(),
    full,
    cfg.params ? { params: cfg.params } : ""
  );

  const auth = getAuth();
  if (auth?.token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${auth.token}`;
  }

  cfg.metadata = { start: performance.now(), full };
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const code = err.response?.status ?? "ERR";
    const url = err.config?.url;
    const data = err.response?.data;
    console.error("[API×]", code, url, data ?? err.message);
    err.userMessage =
      (typeof data === "string" ? data : data?.error) || err.message || "Error";
    throw err;
  }
);

// --------------- Utils ---------------
const unwrap = (r) => (r && r.data !== undefined ? r.data : null);
const normEmail = (v) => String(v || "").trim().toLowerCase();

// --------------- CRUD genérico ---------------
export const list = (entity, params = {}) =>
  api.get(`/${entity}`, { params }).then(unwrap);

export const getOne = (entity, id) =>
  api.get(`/${entity}`, { params: { id } }).then(unwrap);

export const createOne = (entity, payload) =>
  api.post(`/${entity}`, payload).then(unwrap);

export const updateOne = (entity, id, data) =>
  api.put(`/${entity}?id=${encodeURIComponent(id)}`, data).then(unwrap);

export const patchOne = (entity, id, data) =>
  api.patch(`/${entity}?id=${encodeURIComponent(id)}`, data).then(unwrap);

export const deleteOne = (entity, id) =>
  api.delete(`/${entity}?id=${encodeURIComponent(id)}`).then(unwrap);

// --------------- Auth ---------------

// Login con SESIÓN (cookie 'sid') + JWT (token en respuesta)
export const login = (email, password) =>
  api
    .post(`/auth/login`, {
      email: normEmail(email),
      password: String(password || ""),
    })
    .then(unwrap)
    .then((data) => {
      // guarda { user, token } para uso con Bearer en otras FaaS
      saveAuth(data);
      return data;
    });

// Registro (tu backend /users crea usuario)
export const register = (email, password, name) =>
  api
    .post(`/users`, {
      email: normEmail(email),
      password: String(password || ""),
      name: String(name || "").trim(),
    })
    .then(unwrap);

export const changePassword = (id, oldPassword, newPassword) =>
  api
    .patch(`/users?action=changepwd&id=${encodeURIComponent(id)}`, {
      oldPassword,
      newPassword,
    })
    .then(unwrap);

// Sesión opcional (si las usas en UI)
export const sessionMe = () => api.get(`/auth/me`).then(unwrap);
export const sessionLogout = () => api.post(`/auth/logout`).then(unwrap);

export const logout = () => {
  clearAuth();
  // opcional: cerrar sesión del lado servidor
  sessionLogout().catch(() => {});
  if (location.pathname !== "/") location.replace("/");
};

// --------------- MQ helper ---------------
export const isAccepted = (res) =>
  !!res && (res.accepted === true || res.status === "accepted") && !!res.correlationId;

export const processQueue = () => api.post(`/process-queue`).then(unwrap);
