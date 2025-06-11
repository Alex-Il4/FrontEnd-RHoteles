<template>
  <div>
    <Menu />
    <HeroSection />
    <AboutSection />
    
  </div>
</template>

<script>
import Menu from '../components/menu.vue';
import HeroSection from '../components/HeroSection.vue';
import AboutSection from '../components/AboutSection.vue';

export default {
  name: 'HomeView',
  components: {
    Menu,
    HeroSection,
    AboutSection
  }
};
</script>

<style>

</style>