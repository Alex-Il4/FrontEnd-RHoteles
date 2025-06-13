<template>
  <v-app>
    <Menu />

    <v-main>
      <v-container class="my-8">
        <h2 class="text-h4 text-center mb-6">Reserva los hoteles de tus sueños</h2>

        <v-row v-if="loading" justify="center">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <v-row v-else-if="error" justify="center">
          <v-col cols="12" class="text-center">
            <v-alert type="error" prominent>
              Lo sentimos, no pudimos cargar los hoteles. Por favor, inténtalo de nuevo más tarde.
            </v-alert>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col v-for="hotel in hotels" :key="hotel.hotelID" cols="12" sm="6" md="4" lg="3" class="d-flex">
            <v-card class="hotel-card d-flex flex-column" elevation="5">
              <v-img :src="getHotelImage(hotel.hotelID)" class="white--text align-end" height="200px" cover>
                <v-card-title class="hotel-card-title">{{ hotel.nombreHotel }}</v-card-title>
              </v-img>

              <v-card-text class="flex-grow-1">
                <div class="text-subtitle-1 mb-2">
                  <v-icon small left>mdi-map-marker</v-icon>
                  {{ hotel.ciudad }}
                </div>
                <v-rating :value="hotel.calificacionEstrellas" color="amber" dense half-increments readonly
                  size="20"></v-rating>
                <p class="description mt-3">{{ hotel.descripcion }}</p>
                <div class="mt-3">
                  <p class="font-weight-medium">Precio por Noche: ${{ hotel.precioPorNoche.toFixed(2) }}</p>
                  <p class="font-weight-medium">Servicios Exclusivos: {{ hotel.serviciosExclusivos }}</p>
                  <p class="font-weight-medium">Capacidad Máxima: {{ hotel.capacidadMaxima }} personas</p>
                </div>
              </v-card-text>

              <v-card-actions class="pt-0">
                <v-btn color="primary" text @click="reserveHotel(hotel)" :disabled="isReserving">
                  Reservar
                  <v-icon right>mdi-check-circle</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// Importaciones necesarias
import Menu from '../components/menu.vue'; // Asegúrate de que la ruta sea correcta para tu componente Menu
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex'; // Para acceder al store de Vuex

// Importa tus imágenes locales explícitamente aquí.
// Asegúrate de que estas rutas sean correctas y los archivos existan en tu carpeta 'src/assets/'.
// Si tus imágenes están en una subcarpeta de assets, ajusta la ruta (ej. '../assets/images/hotel1.jpg')
import hotel1Img from '../assets/hotel1.jpg';
import hotel2Img from '../assets/hotel2.jpg';
// Añade más imports para cada imagen local que tengas, si aplica:
// import hotel3Img from '../assets/hotel3.jpg';
// import hotel4Img from '../assets/hotel4.jpg';


// --- Inicialización ---
const store = useStore(); // Obtiene la instancia del store de Vuex


// --- Variables Reactivas (Estado del componente) ---
const hotels = ref([]); // Almacena la lista de hoteles obtenida de la API
const loading = ref(true); // Indica si los hoteles están cargando
const error = ref(false); // Indica si hubo un error al cargar los hoteles

// Estado para la operación de reserva
const isReserving = ref(false); // Indica si una solicitud de reserva está en progreso
const snackbar = ref({ // Controla el snackbar para mostrar mensajes al usuario
  show: false,
  message: '',
  color: '',
  timeout: 3000, // Duración en ms para que el snackbar se oculte
});


// --- Mapeo de Imágenes Locales ---
// Este objeto mapea los hotelID a las variables de imagen importadas.
// Asegúrate de que los IDs aquí coincidan con los IDs que tu API devuelve.
const localHotelImages = {
  1: hotel1Img,
  2: hotel2Img,
  // Continúa mapeando para otros hotel IDs según tus imágenes locales:
  // 3: hotel3Img,
  // 4: hotel4Img,
};


// --- Funciones ---

/**
 * Obtiene la ruta de imagen para un hotel dado su ID.
 * Si no hay una imagen local mapeada, devuelve un placeholder genérico.
 * @param {number} id - El ID del hotel.
 * @returns {string} La ruta de la imagen o URL del placeholder.
 */
const getHotelImage = (id) => {
  return localHotelImages[id] || 'https://via.placeholder.com/400x200/CCCCCC/000000?text=Imagen+No+Disponible';
};

/**
 * Obtiene la lista de hoteles desde el backend.
 */
const fetchHotels = async () => {
  loading.value = true; // Inicia el estado de carga
  error.value = false;  // Limpia cualquier error anterior
  try {
    // URL de tu API para obtener hoteles. Asegúrate de que el puerto sea correcto.
    const response = await axios.get('http://localhost:8081/api/hoteles');
    hotels.value = response.data; // Asigna los hoteles obtenidos a la variable reactiva
  } catch (err) {
    console.error('Error al obtener hoteles:', err);
    error.value = true; // Establece el estado de error
  } finally {
    loading.value = false; // Finaliza el estado de carga
  }
};

/**
 * Maneja la lógica para crear una nueva reserva.
 * @param {object} hotel - El objeto completo del hotel que se desea reservar.
 */
const reserveHotel = async (hotel) => {
  const userId = store.getters.getUserId; // Obtiene el userId del store de Vuex

  // 1. Validación de usuario logueado
  if (!userId) {
    snackbar.value = {
      show: true,
      message: 'Debes iniciar sesión para poder reservar un hotel.',
      color: 'warning',
      timeout: 4000,
    };
    console.warn('Intento de reserva sin userId en el store.');
    return; // Detiene la ejecución si no hay userId
  }

  // 2. Validación de datos del hotel (precioPorNoche)
  // Verifica si el precioPorNoche es null/undefined o no es un número.
  // El mensaje "Hotel con precioPorNoche inválido: X" que viste se debía a que 'hotel' era el ID directamente
  // y no el objeto completo, por eso hotel.precioPorNoche era undefined.
  // Con el cambio en el @click="reserveHotel(hotel)" esto ya debería pasar el objeto completo.
  if (hotel.precioPorNoche === null || typeof hotel.precioPorNoche === 'undefined' || isNaN(hotel.precioPorNoche)) {
      snackbar.value = {
          show: true,
          message: 'El precio del hotel no es válido. No se puede reservar.',
          color: 'error',
          timeout: 4000,
      };
      console.error('Hotel con precioPorNoche inválido detectado en la UI (objeto completo):', hotel);
      return;
  }

  isReserving.value = true; // Inicia el estado de reserva (para deshabilitar el botón, etc.)

  try {
    // 3. Preparar los datos de la reserva para enviar al backend
    // Asegúrate de que las claves (userId, hotelId, precioTotal) coincidan con tu entidad Reserva en Java.
    const reservaData = {
      userId: userId,
      hotelId: hotel.hotelID, // Usar el ID del hotel seleccionado del objeto 'hotel'
      // Por simplicidad, usamos precioPorNoche como precioTotal.
      // Si necesitas calcular el precio total basado en duración, etc., hazlo aquí.
      precioTotal: hotel.precioPorNoche,
    };

    // 4. Realizar la solicitud POST al endpoint de reservas
    // URL de tu API para crear reservas. Asegúrate de que el puerto sea correcto (diferente al de hoteles).
    const response = await axios.post('http://localhost:8081/api/reservations', reservaData);

    // 5. Manejo de la respuesta
    if (response.status === 201) { // HttpStatus.CREATED en Spring Boot
      snackbar.value = {
        show: true,
        message: `¡Reserva para ${hotel.nombreHotel} creada con éxito!`,
        color: 'success',
      };
      console.log('Reserva creada exitosamente:', response.data);
      // Aquí podrías añadir lógica adicional, como:
      // - Redirigir al usuario a una página de confirmación de reserva.
      // - Actualizar una lista de "mis reservas" en el frontend.
      // - Mostrar un diálogo de confirmación más detallado.
    } else {
      // Si el backend devuelve un status diferente a 201 pero sin error
      snackbar.value = {
        show: true,
        message: 'Hubo un problema inesperado al crear la reserva. Inténtalo de nuevo.',
        color: 'error',
      };
      console.error('Error al crear reserva - Status no 201:', response.status, response.data);
    }
  } catch (err) {
    // 6. Manejo de errores de la solicitud (errores de red, 4xx, 5xx)
    console.error('Error al enviar la reserva:', err.response ? err.response.data : err.message);
    let errorMessageText = 'Ocurrió un error al procesar tu reserva. Inténtalo de nuevo.';

    if (err.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (err.response.status === 400) { // Bad Request
        errorMessageText = err.response.data.message || 'Datos de reserva inválidos.';
      } else if (err.response.status === 404) { // Not Found
        errorMessageText = 'No se encontró el recurso de reserva (revisa la URL del endpoint).';
      } else if (err.response.status === 500) { // Internal Server Error
        errorMessageText = 'Error interno del servidor al crear la reserva.';
      } else if (err.response.data && err.response.data.message) {
        // Si el backend envía un mensaje de error específico
        errorMessageText = err.response.data.message;
      }
    } else if (err.request) {
      // La solicitud fue hecha pero no se recibió respuesta (ej. backend no está corriendo)
      errorMessageText = 'No se pudo conectar con el servidor de reservas. Asegúrate de que el backend esté funcionando.';
    }

    snackbar.value = {
      show: true,
      message: errorMessageText,
      color: 'error',
      timeout: 5000,
    };
  } finally {
    isReserving.value = false; // Finaliza el estado de reserva
  }
};


// --- Ciclo de Vida ---
// Se ejecuta cuando el componente se monta en el DOM
onMounted(fetchHotels);
</script>

<style scoped>
/* Scoped styles for this component */
.hotel-card {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.hotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.hotel-card-title {
  font-size: 1.5em;
  font-weight: bold;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  padding: 16px;
}

.description {
  color: #555;
  font-size: 0.95em;
}

.v-rating .v-icon {
  margin-right: 2px;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.8em !important;
  }
}
</style>