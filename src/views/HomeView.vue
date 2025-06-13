<template>
  <div>
    <HeroSection />
    <AboutSection />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'; // Asegúrate de la ruta correcta
import AboutSection from '../components/AboutSection.vue'; // Asegúrate de la ruta correcta

// En <script setup>, no necesitas el objeto 'export default' para registrar componentes.
// Los componentes importados son automáticamente accesibles en el template.
</script>

<style>
/* Cualquier estilo específico para HomeView si lo tienes */
</style>