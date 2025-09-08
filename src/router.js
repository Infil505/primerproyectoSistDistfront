import { createRouter, createWebHistory } from "vue-router";
import EdificiosList from "./pages/EdificiosList.vue";
import EdificioForm from "./pages/EdificioForm.vue";
import CiudadesList from "./pages/CiudadesList.vue";
import CiudadForm from "./pages/CiudadForm.vue";
import ArquitectosList from "./pages/ArquitectosList.vue";
import ArquitectoForm from "./pages/ArquitectoForm.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/edificios" },

    { path: "/edificios", component: EdificiosList },
    { path: "/edificios/nuevo", component: EdificioForm },
    { path: "/edificios/:id", component: EdificioForm, props: true },

    { path: "/ciudades", component: CiudadesList },
    { path: "/ciudades/nuevo", component: CiudadForm },
    { path: "/ciudades/:id", component: CiudadForm, props: true },

    { path: "/arquitectos", component: ArquitectosList },
    { path: "/arquitectos/nuevo", component: ArquitectoForm },
    { path: "/arquitectos/:id", component: ArquitectoForm, props: true },
  ],
});
