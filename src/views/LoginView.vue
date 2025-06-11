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

          <v-text-field v-model="email" density="compact" placeholder="Email address"
            prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

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

<script>
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios
// Importa el router si lo usas para redirigir
import router from '../router'; // Ajusta la ruta a tu archivo de router

export default {
  name: 'LoginView', // Asegúrate de que el nombre del componente sea correcto
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = null; // Limpiar mensajes de error anteriores

      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', { // Ajusta la URL de tu endpoint de login
          email: this.email,
          password: this.password,
        });

        // Asumiendo que tu backend devuelve { userId: ..., username: ..., email: ... }
        const userData = response.data;

        // Despacha una acción para guardar los datos del usuario en Vuex
        this.$store.dispatch('login', userData); // 'login' es la acción que definimos en el store

        // Redirige al usuario a la página principal o a la página de reservaciones
        router.push('/home'); // Ajusta la ruta a donde quieres redirigir
        // O si no usas router: window.location.href = '/home';

      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.response) {
          // El servidor respondió con un estado fuera del rango 2xx
          this.errorMessage = error.response.data.message || 'Credenciales inválidas.';
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          this.errorMessage = 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.';
        } else {
          // Algo pasó al configurar la solicitud que disparó un error
          this.errorMessage = 'Error inesperado al iniciar sesión.';
        }
      }
    },
  },
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