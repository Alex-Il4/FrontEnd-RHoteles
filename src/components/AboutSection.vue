<template>
  <section class="about-section">
    <div class="about-content-wrapper">
      <div class="about-left">
        <img src="../assets/foto8.jpg" alt="Hoteles para Vacacionar" class="about-image" />
      </div>
      <div class="about-right">
        <h2 class="section-title">Sobre Nosotros</h2>
        <p class="description">
          Somos tu guía definitiva para encontrar los **mejores hoteles para tus vacaciones**.
          En nuestro sitio, recopilamos y analizamos una amplia gama de opciones de alojamiento
          para que disfrutes de una estadía inolvidable. Nuestro objetivo es simplificar
          tu búsqueda y garantizar que encuentres el lugar perfecto.
        </p>
        <p class="description">
          Con **años de experiencia** en el sector turístico, nuestro equipo se dedica
          a investigar y seleccionar hoteles que cumplan con los más altos estándares
          de calidad, comodidad y servicio. Ya sea que busques lujo, aventura o relajación,
          tenemos algo especial para ti.
        </p>
        <div class="details-grid">
          <div class="specialties">
            <h3>Nuestras Categorías</h3>
            <ul>
              <li>
                <span class="icon">&#10003;</span>
                <span>Hoteles de Lujo</span>
              </li>
              <li>
                <span class="icon">&#10003;</span>
                <span>Alojamientos Económicos</span>
              </li>
              <li>
                <span class="icon">&#10003;</span>
                <span>Resorts Todo Incluido</span>
              </li>
              <li>
                <span class="icon">&#10003;</span>
                <span>Hoteles Familiares</span>
              </li>
            </ul>
          </div>
          <div class="equipment">
            <h3>Servicios Destacados</h3>
            <ul>
              <li>
                <span class="icon">&#127760;</span>
                <span>Guías de Destinos</span>
              </li>
              <li>
                <span class="icon">&#128269;</span>
                <span>Comparación de Precios</span>
              </li>
              <li>
                <span class="icon">&#128172;</span>
                <span>Opiniones de Usuarios</span>
              </li>
              <li>
                <span class="icon">&#128196;</span>
                <span>Ofertas Exclusivas</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutSection',
};
</script>

<style scoped>
.about-section {
  background-color: #0d0d0d;
  color: #f0f0f0;
  padding: 80px 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.about-content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  gap: 60px;
}

.about-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  max-width: 100%;
  max-height: 100%;
}

.about-right {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 2.8em;
  color: #f0f0f0;
  margin-bottom: 30px;
  text-align: left;
}

.description {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #b0b0b0;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 30px;
}

.specialties h3,
.equipment h3 {
  font-size: 1.4em;
  color: #f0f0f0;
  margin-bottom: 15px;
}

.specialties ul,
.equipment ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.specialties li,
.equipment li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1em;
  color: #b0b0b0;
}

.icon {
  margin-right: 10px;
  font-size: 1.2em;
  color: #4CAF50; /* Changed icon color to a more hotel-friendly green */
}

.equipment .icon {
  color: #64B5F6; /* Kept blue for consistency or can be changed */
}

@media (max-width: 992px) {
  .about-content-wrapper {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }

  .about-left {
    width: 100%;
  }

  .about-image {
    max-height: 400px;
    border-radius: 12px;
  }

  .section-title {
    text-align: center;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .about-section {
    padding: 60px 15px;
  }

  .section-title {
    font-size: 2.2em;
  }

  .description {
    font-size: 0.95em;
  }

  .specialties h3,
  .equipment h3 {
    font-size: 1.2em;
  }
}
</style>