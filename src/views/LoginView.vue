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

          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            text
            class="mb-4"
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn class="mb-8" color="blue" size="large" variant="tonal" block @click="handleLogin">
            Log In
          </v-btn>

          <v-card-text class="text-center">
            <a
              class="text-blue text-decoration-none"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
              @click.prevent="goToNewAccount">
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
// No necesitas importar axios directamente aquí si toda la lógica de la API está en la acción de Vuex.
// import axios from 'axios';

// Importa tus imágenes del carrusel aquí
import CarouselImage1 from '../assets/BGLogin.jpg';
import CarouselImage2 from '../assets/BGLogin2.jpg';
import CarouselImage3 from '../assets/BGLogin3.jpg';
// Importa la imagen para el fondo de la tarjeta de login
//import BGLoginCard from '../assets/BGLoginCard.jpg'; // Asegúrate de que esta ruta sea correcta

const visible = ref(false); // Para el control de visibilidad de la contraseña
const store = useStore(); // Instancia del store de Vuex
const router = useRouter();

// Define el array 'slides' con las imágenes importadas para el carrusel
const slides = ref([
  CarouselImage1,
  CarouselImage2,
  CarouselImage3
]);

// Variables reactivas para los campos del formulario
const email = ref('');
const password = ref('');
const errorMessage = ref(''); // Para mostrar mensajes de error al usuario

// Función que se llama al hacer clic en el botón "Log In"
const handleLogin = async () => {
  errorMessage.value = ''; // Limpia cualquier mensaje de error anterior

  try {
    // Despacha la acción 'login' del store de Vuex con las credenciales.
    // La acción de Vuex se encargará de la llamada a la API y de actualizar el estado.
    await store.dispatch('login', {
      email: email.value,
      password: password.value
    });

    // Si la acción 'login' en el store no lanzó un error, significa que la autenticación fue exitosa.
    if (store.getters.isAuthenticated) {
      console.log('Login exitoso en el componente. Redirigiendo a /home...');
      // Accede al userId después de que la acción de Vuex lo haya establecido en el store
      console.log('ID de usuario después del login (desde Vuex):', store.getters.getUserId);
      router.push('/'); // Redirige a la página de inicio
    } else {
      // Este caso sería si la acción 'login' en el store finaliza sin lanzar un error,
      // pero por alguna razón interna no establece isAuthenticated a true.
      // Podría ser redundante si la acción siempre lanza un error en caso de fallo.
      errorMessage.value = 'Fallo al iniciar sesión. Por favor, inténtalo de nuevo.';
    }

  } catch (error) {
    // Manejo de errores que son lanzados por la acción 'login' de Vuex.
    // El error.response.data (si existe) contendrá detalles del error desde el servidor.
    console.error('Error al intentar iniciar sesión (componente handleLogin):', error);

    if (error.response) {
      // Errores específicos del servidor (ej. 401 Unauthorized)
      if (error.response.status === 401) {
        errorMessage.value = 'Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña.';
      } else if (error.response.data && error.response.data.message) {
        // Si el backend envía un mensaje de error específico
        errorMessage.value = error.response.data.message;
      } else {
        errorMessage.value = 'Ocurrió un error en el servidor. Por favor, inténtalo más tarde.';
      }
    } else if (error.request) {
      // Error de red (servidor no responde)
      errorMessage.value = 'No se pudo conectar con el servidor. Asegúrate de que el backend esté funcionando.';
    } else {
      // Otros errores (ej. configuración de Axios)
      errorMessage.value = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
    }
  }
};

// Función para redirigir a la página de registro
const goToNewAccount = () => {
  router.push('/new-account');
};
</script>

<style scoped>
/* Tu estilo existente, no se modifica */
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