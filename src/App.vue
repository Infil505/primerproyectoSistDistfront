<template>
  <div>
    <nav style="padding:1rem; background:#f4f6f8; display:flex; gap:1rem; align-items:center;">
      <strong>🏙️ Catálogo de edificios</strong>
      <router-link to="/edificios">Edificios</router-link>
      <router-link to="/ciudades">Ciudades</router-link>
      <router-link to="/arquitectos">Arquitectos</router-link>
    </nav>
    <router-view />
  </div>
</template>
