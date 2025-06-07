<template>
  <v-container fluid fill-height class="login-page-background">
    <v-row align="center" justify="center" class="fill-height pt-16">
      <v-col cols="12" md="8" class="d-flex align-center justify-center">
        <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background class="rounded-lg elevation-10">
          <v-carousel-item v-for="(imageSrc, i) in slides" :key="i" :src="imageSrc" cover>
          </v-carousel-item>
        </v-carousel>
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center justify-center">
        <v-card class="pa-12 pb-8 card-border-animation" elevation="15" max-width="438" rounded="lg" :style="{
          backgroundImage: `url(${BGLoginCard})`, /* Fondo de imagen para la tarjeta */
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          color: 'white', /* Color del texto dentro de la tarjeta */
          backgroundColor: '#121212' /* Hace que la imagen de fondo sea visible */
        }">
          <div class="text-subtitle-1 text-medium-emphasis">Account</div>

          <v-text-field v-model="email" density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
            variant="outlined"></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            Password

            <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
              Forgot login password?</a>
          </div>

          <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
            density="compact" placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
            @click:append-inner="visible = !visible" v-model="password"></v-text-field>

          <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="login">
            Log In
          </v-btn>

          <v-card-text class="text-center">
            <a class="text-blue text-decoration-none" href="#" rel="noopener noreferrer" target="_blank">
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
import axios from 'axios'; // Importa axios

// 1. Importa tus imágenes del carrusel aquí
import CarouselImage1 from '../assets/BGLogin.jpg';
import CarouselImage2 from '../assets/BGLogin2.jpg';
import CarouselImage3 from '../assets/BGLogin3.jpg';

const visible = ref(false); // Para el diálogo de login, si lo usas
const store = useStore();
const router = useRouter();

// 3. Define el array 'slides' con las imágenes importadas
const slides = ref([
  CarouselImage1,
  CarouselImage2,
  CarouselImage3
]);

// Define las variables reactivas para el nombre de usuario y la contraseña
const email = ref(''); // Para el campo de nombre de usuario en el formulario
const password = ref(''); // Para el campo de contraseña en el formulario
const errorMessage = ref(''); // Para mostrar mensajes de error al usuario

const login = async () => {
  errorMessage.value = ''; // Limpia cualquier mensaje de error anterior

  try {
    // Realiza la solicitud POST al endpoint de login de tu backend
    const response = await axios.post('http://localhost:8081/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (response.status === 200) {
      console.log('Login exitoso:', response.data);

      router.push('/home');
    } else {
      errorMessage.value = 'Fallo al iniciar sesión. Por favor, inténtalo de nuevo.';
      console.error('Login fallido con status:', response.status);
    }

  } catch (error) {
    // Manejo de errores de la solicitud
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Error de respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
      errorMessage.value = error.response.data || 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.';
      if (error.response.status === 401) {
        errorMessage.value = 'Credenciales inválidas. Por favor, verifica tu nombre de usuario y contraseña.';
      } else {
        errorMessage.value = 'Ocurrió un error en el servidor. Inténtalo más tarde.';
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta (ej. servidor no está corriendo)
      console.error('No se recibió respuesta del servidor:', error.request);
      errorMessage.value = 'No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.';
    } else {
      // Algo más ocurrió al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
      errorMessage.value = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    }
  }
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

  0%,
  100% {
    border-image-source: linear-gradient(to right, #72c9e6, #1E90FF, #5073db, #00BFFF);
  }

  50% {
    border-image-source: linear-gradient(to right, transparent, transparent, transparent, transparent);
  }
}
</style>