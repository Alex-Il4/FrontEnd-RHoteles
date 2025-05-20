<template>
  <v-container fluid fill-height class="login-page-background">
    <v-row align="center" justify="center" class="fill-height pt-16">
      <v-col cols="12" md="8" class="d-flex align-center justify-center">
        <v-carousel
          height="400"
          show-arrows="hover"
          cycle
          hide-delimiter-background
          class="rounded-lg elevation-10"
        >
          <v-carousel-item
            v-for="(imageSrc, i) in slides"
            :key="i"
            :src="imageSrc"
            cover
          >
            </v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center justify-center">
        <v-card
          class="pa-12 pb-8 card-border-animation"
          elevation="15"
          max-width="438"
          rounded="lg"
          :style="{
            backgroundImage: `url(${BGLoginCard})`, /* Fondo de imagen para la tarjeta */
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            color: 'white', /* Color del texto dentro de la tarjeta */
            backgroundColor: '#121212' /* Hace que la imagen de fondo sea visible */
          }"
        >
          <div class="text-subtitle-1 text-medium-emphasis">Account</div>

          <v-text-field
            density="compact"
            placeholder="Email address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
          ></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password

            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Forgot login password?</a>
          </div>

          <v-text-field
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
          ></v-text-field>

          <v-btn
            class="mb-8"
            color="blue"
            size="large"
            variant="tonal"
            block
            @click="login"
          >
            Log In
          </v-btn>

          <v-card-text class="text-center">
            <a
              class="text-blue text-decoration-none"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
            </a>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// 1. Importa tus imágenes del carrusel aquí
import CarouselImage1 from '../assets/BGLogin.jpg'; // Asegúrate de que estas rutas sean correctas para tus archivos
import CarouselImage2 from '../assets/BGLogin2.jpg';
import CarouselImage3 from '../assets/BGLogin3.jpg';

const visible = ref(false);
const store = useStore();
const router = useRouter();

// 3. Define el array 'slides' con las imágenes importadas
const slides = ref([
  CarouselImage1,
  CarouselImage2,
  CarouselImage3
]);

const login = async () => {
  await store.dispatch('login');
  router.push('/app/dashboard');
};
</script>

<style scoped>
.login-page-background {
  background-color: transparent !important; 
}

.v-row.fill-height {
  height: 100%;
}

/* Animación del borde (tu código existente) */
.card-border-animation {
  border: 2px solid;
  border-image-slice: 1;
  animation: blue-flicker 2s linear infinite;
}

@keyframes blue-flicker {
  0%, 100% {
    border-image-source: linear-gradient(to right, #72c9e6, #1E90FF, #5073db, #00BFFF);
  }
  50% {
    border-image-source: linear-gradient(to right, transparent, transparent, transparent, transparent);
  }
}
</style>