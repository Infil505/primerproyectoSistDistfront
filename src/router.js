import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "./api";

import Login from "./pages/Login.vue";
import EdificiosList from "./pages/EdificiosList.vue";
import EdificioForm from "./pages/EdificioForm.vue";
import CiudadesList from "./pages/CiudadesList.vue";
import CiudadForm from "./pages/CiudadForm.vue";
import ArquitectosList from "./pages/ArquitectosList.vue";
import ArquitectoForm from "./pages/ArquitectoForm.vue";
import Register from "./pages/Register.vue";
import Home from "./App.vue";


const routes = [
  { path: "/home", name: "Home", component: Home },
  { path: "/", name: "Login", component: Login },
  { path: "/register", name: "register", component: Register},
  { path: "/edificios", component: EdificiosList, meta: { requiresAuth: true } },
  { path: "/edificios/nuevo", component: EdificioForm, meta: { requiresAuth: true } },
  { path: "/edificios/:id", component: EdificioForm, props: true, meta: { requiresAuth: true } },

  { path: "/ciudades", component: CiudadesList, meta: { requiresAuth: true } },
  { path: "/ciudades/nuevo", component: CiudadForm, meta: { requiresAuth: true } },
  { path: "/ciudades/:id", component: CiudadForm, props: true, meta: { requiresAuth: true } },

  { path: "/arquitectos", component: ArquitectosList, meta: { requiresAuth: true } },
  { path: "/arquitectos/nuevo", component: ArquitectoForm, meta: { requiresAuth: true } },
  { path: "/arquitectos/:id", component: ArquitectoForm, props: true, meta: { requiresAuth: true } },

  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const isAuth = !!getAuth();

  if (to.path === "/home" && isAuth) {
    return next("/home");
  }

  if (to.meta.requiresAuth && !isAuth) {
    return next("/home");
  }

  next();
});

export default router;
