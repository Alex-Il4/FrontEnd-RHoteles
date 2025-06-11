<template>
  <section class="hero-section">
    <div class="background-grid">
      <div class="grid-item grid-item-1"></div>
      <div class="grid-item grid-item-2"></div>
      <div class="grid-item grid-item-3"></div>
      <div class="grid-item grid-item-4"></div>
      <div class="grid-item grid-item-5"></div>
      <div class="grid-item grid-item-6"></div>
    </div>

    <div class="content-overlay">
      <h1 class="main-title">El viaje de tus sueños</h1>
      <p class="subtitle">
        Vieve la mejor experiencia de viaje con nosotros. Descubre destinos únicos y aventuras inolvidables.
      </p>
      <div class="button-container">
        <router-link to="/hoteles">
          <button class="btn primary">Mejores Hoteles</button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
};


</script>

<style scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #1a1a1a;
}

.background-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0;
  z-index: 1;
}

.grid-item {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.6);
}

/* Imágenes personalizadas por sección */
.grid-item-1 {
  grid-column: 1;
  grid-row: 1;
  background-image: url('../assets/hotel1.jpg');
}
.grid-item-2 {
  grid-column: 2 / span 2;
  grid-row: 1;
  background-image: url('../assets/hotel2.jpg');
}
.grid-item-3 {
  grid-column: 3;
  grid-row: 1;
  background-image: url('../assets/hotel3.jpg');
}
.grid-item-4 {
  grid-column: 1;
  grid-row: 2;
  background-image: url('../assets/hotel4.jpg');
}
.grid-item-5 {
  grid-column: 2;
  grid-row: 2;
  background-image: url('../assets/hotel5.jpg');
}
.grid-item-6 {
  grid-column: 3;
  grid-row: 2;
  background-image: url('../assets/hotel6.jpg');
}

.content-overlay {
  position: relative;
  text-align: center;
  color: #fff;
  z-index: 2;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main-title {
  font-size: 3.5em;
  margin-bottom: 0.2em;
  line-height: 1.1;
  font-weight: bold;
}

.subtitle {
  font-size: 1.3em;
  margin-bottom: 2em;
  max-width: 600px;
}

.button-container {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background-color: #fff;
  color: #333;
}

.btn.primary:hover {
  background-color: #e0e0e0;
}

.btn.secondary {
  background-color: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1em;
  }

  .button-container {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2em;
  }
}
</style>
