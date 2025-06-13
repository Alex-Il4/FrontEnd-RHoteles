<script setup>
import Menu from './components/menu.vue'; // Importa el componente Menu
// No necesitas importar nada más aquí si el menú es el único componente global que añades.
</script>

<template>
  <v-app>
    <!-- Coloca el componente Menu aquí, fuera del <v-main> si es un menú de navegación global
         que siempre debe estar visible (ej. una barra superior o lateral). -->
    <Menu />

    <v-main>
      <!-- <router-view /> es donde se cargarán los componentes de las rutas (ej. AboutSection, HotelesList) -->
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
/* Tus estilos existentes se mantienen. */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>