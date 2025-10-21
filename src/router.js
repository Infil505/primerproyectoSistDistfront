import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "./api";

import Home from "./App.vue";
import ArquitectoForm from "./pages/ArquitectoForm.vue";
import ArquitectosList from "./pages/ArquitectosList.vue";
import CiudadesList from "./pages/CiudadesList.vue";
import CiudadForm from "./pages/CiudadForm.vue";
import EdificioForm from "./pages/EdificioForm.vue";
import EdificiosList from "./pages/EdificiosList.vue";
import Login from "./pages/Login.vue";
import Register from "./pages/Register.vue";

const routes = [
  { path: "/", name: "Login", component: Login, meta: { guestOnly: true } },
  { path: "/register", name: "Register", component: Register, meta: { guestOnly: true } },
  { path: "/home", name: "Home", component: Home, meta: { requiresAuth: true } },
  
  {
    path: "/edificios",
    component: EdificiosList,
    meta: { requiresAuth: true },
  },
  {
    path: "/edificios/nuevo",
    component: EdificioForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/edificios/:id",
    component: EdificioForm,
    props: true,
    meta: { requiresAuth: true },
  },

  { 
    path: "/ciudades", 
    component: CiudadesList, 
    meta: { requiresAuth: true } 
  },
  {
    path: "/ciudades/nuevo",
    component: CiudadForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/ciudades/:id",
    component: CiudadForm,
    props: true,
    meta: { requiresAuth: true },
  },

  {
    path: "/arquitectos",
    component: ArquitectosList,
    meta: { requiresAuth: true },
  },
  {
    path: "/arquitectos/nuevo",
    component: ArquitectoForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/arquitectos/:id",
    component: ArquitectoForm,
    props: true,
    meta: { requiresAuth: true },
  },

  // Redirigir rutas no encontradas
  { 
    path: "/:pathMatch(.*)*", 
    redirect: (to) => {
      const isAuth = !!getAuth();
      return isAuth ? "/edificios" : "/";
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuth = !!getAuth();

  if (to.meta.guestOnly && isAuth) {
    next("/edificios");
    return;
  }
  if (to.meta.requiresAuth && !isAuth) {
    next("/");
    return;
  }

  next();
});

export default router;