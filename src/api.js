import axios from "axios";

function resolveBaseURL() {
  const envBase = (import.meta.env.VITE_API_BASE || "").trim();
  if (envBase) return envBase.replace(/\/$/, "");
  return import.meta.env.DEV
    ? "/api"
    : "https://lucent-toffee-15f013.netlify.app/.netlify/functions";
}

const baseURL = resolveBaseURL();
console.log("[API base]", baseURL);

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

export const api = axios.create({
  baseURL,
  headers: { Accept: "application/json" },
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
  (res) => {
    const ms =
      performance.now() - (res.config.metadata?.start ?? performance.now());
    const finalUrl =
      res.request?.responseURL ||
      res.config.metadata?.full ||
      joinUrl(res.config.baseURL, res.config.url);
    const ct = res.headers?.["content-type"] || "";
    console.log("[API←]", res.status, finalUrl, `${ms.toFixed(0)}ms`, ct);
    if (!ct.includes("application/json"))
      console.warn("Respuesta no JSON (¿SPA?) desde:", finalUrl);
    return res;
  },
  (err) => {
    const cfg = err.config || {};
    const finalUrl = err.request?.responseURL || joinUrl(cfg.baseURL, cfg.url);
    const code = err.response?.status ?? "ERR";
    console.error("[API×]", code, finalUrl, err.message);

    if (code === 401) {
      clearAuth();
      if (location.pathname !== "/") location.replace("/");
    }
    throw err;
  }
);

const unwrap = (r) => (r && r.data !== undefined ? r.data : null);

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

export const login = (gmail, password) =>
  api
    .post(`/users?action=login`, { gmail, password })
    .then(unwrap)
    .then((data) => {
      saveAuth(data);
      return data;
    });

export const register = (email, password, name) =>
  api.post(`/users`, { email, password, name }).then(unwrap);

export const changePassword = (id, oldPassword, newPassword) =>
  api
    .patch(`/users?action=changepwd&id=${encodeURIComponent(id)}`, {
      oldPassword,
      newPassword,
    })
    .then(unwrap);

export const logout = () => {
  clearAuth();
  if (location.pathname !== "/") location.replace("/");
};

export const isAccepted = (res) =>
  !!res && (res.accepted === true || res.status === "accepted") && !!res.correlationId;

export const processQueue = () =>
  api.post("/process-queue").then(unwrap);