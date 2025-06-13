<template>
  <div class="carrito-container bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
    <button @click="volverHome" class="btn-volver">Reservar más</button>

    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Tus Reservaciones</h1>

    <div v-if="loadingReservas" class="text-center text-gray-700 text-lg">
      Cargando tus reservaciones...
      <v-progress-circular indeterminate color="primary" class="ml-2"></v-progress-circular>
    </div>

    <div v-else-if="errorCargandoReservas" class="text-center text-red-600 text-lg">
      Hubo un error al cargar tus reservaciones. Por favor, inténtalo de nuevo.
    </div>

    <div v-else-if="reservasDetalladas.length === 0 && !loadingReservas && !errorCargandoReservas" class="text-center text-gray-700 text-lg">
      No hay reservaciones realizadas.
    </div>

    <v-container fluid class="w-full max-w-7xl mx-auto">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="reserva in reservasDetalladas"
          :key="reserva.id"
          class="mb-6"
        >
          <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column">
            <v-img
              :src="reserva.hotelDetails.imageUrl || 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible'"
              :alt="reserva.hotelDetails.nombreHotel"
              height="200px"
              cover
              @error="onImageError"
            />

            <v-card-title class="text-xl font-semibold text-gray-900 mb-2">
              {{ reserva.hotelDetails.nombreHotel }}
            </v-card-title>
            <v-card-subtitle class="text-gray-600 text-sm mb-2">
              {{ reserva.hotelDetails.ciudad }}
            </v-card-subtitle>
            <v-card-text class="text-gray-700 text-base flex-grow">
              {{ reserva.hotelDetails.descripcion }}
            </v-card-text>

            <v-spacer></v-spacer>
            <v-card-actions class="d-flex flex-column align-start pt-0">
              <p class="text-lg font-bold text-blue-600 mb-4 ml-4">
                ${{ reserva.precioTotal ? reserva.precioTotal.toFixed(2) : '0.00' }} / Total
                </p>
              <v-btn
                color="red"
                dark
                block
                class="rounded-md transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                @click="eliminarReservacion(reserva.id)"
                :loading="isDeleting[reserva.id]"
                :disabled="isDeleting[reserva.id]"
              >
                Eliminar reservación
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

// --- Constantes de API ---
const API_BASE_RESERVATIONS_URL = 'http://localhost:8081/api/reservations'; // Puerto de tu API de reservas
const API_BASE_HOTELES_URL = 'http://localhost:8081/api/hoteles';       // Puerto de tu API de hoteles

// --- Inicialización ---
const router = useRouter();
const store = useStore(); // Para acceder al userId del store

// --- Variables Reactivas (Estado del componente) ---
const reservas = ref([]); // Almacenará las reservas crudas obtenidas del backend (Reserva objects)
const reservasDetalladas = ref([]); // Almacenará las reservas con los detalles del hotel "anidados"
const loadingReservas = ref(true); // Estado de carga de las reservas
const errorCargandoReservas = ref(false); // Estado de error al cargar reservas
const isDeleting = ref({}); // Objeto para controlar el estado de eliminación de cada reserva por su ID (ej. { 123: true, 456: false })

const snackbar = ref({
  show: false,
  message: '',
  color: '',
  timeout: 3000,
});

// --- Mapeo de Imágenes Locales (si las usas para los hoteles) ---
// Si tienes un mapeo de hotelID a imágenes locales, inclúyelo aquí.
// Por ejemplo:
// import hotel1Img from '../assets/hotel1.jpg';
// import hotel2Img from '../assets/hotel2.jpg';
// const localHotelImages = {
//   1: hotel1Img,
//   2: hotel2Img,
//   // ... otros mapeos si los tienes
// };

// Función para obtener la imagen del hotel (si usas mapeo local)
// const getHotelImage = (id) => localHotelImages[id] || 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible';


// --- Funciones ---

/**
 * Redirige al usuario a la página principal de hoteles.
 */
function volverHome() {
  router.push('/');
}

/**
 * Obtiene los detalles de un hotel dado su ID desde la API de hoteles.
 * Esta es la implementación de la Opción B.
 * @param {number} hotelId - El ID del hotel.
 * @returns {Promise<object|null>} Los detalles del hotel o null si hay un error.
 */
async function fetchHotelDetails(hotelId) {
  try {
    const response = await axios.get(`${API_BASE_HOTELES_URL}/${hotelId}`);
    // console.log(`Detalles del hotel ${hotelId}:`, response.data); // Para depuración
    // Aquí puedes añadir la propiedad imageUrl si la necesitas y no viene de tu API de hoteles
    // Por ejemplo, si tienes un mapeo local de imágenes:
    // response.data.imageUrl = getHotelImage(hotelId);
    return response.data;
  } catch (err) {
    console.error(`Error al obtener detalles del hotel ${hotelId}:`, err.response ? err.response.data : err.message);
    return null; // Retorna null si no se pueden obtener los detalles
  }
}

/**
 * Carga las reservas del usuario autenticado desde el backend.
 * Luego, para cada reserva, obtiene los detalles completos del hotel.
 */
async function cargarReservaciones() {
  loadingReservas.value = true;
  errorCargandoReservas.value = false;
  reservasDetalladas.value = []; // Limpiar antes de cargar nuevas reservas

  const userId = store.getters.getUserId;

  if (!userId) {
    snackbar.value = {
      show: true,
      message: 'No se encontró el ID de usuario. Por favor, inicie sesión.',
      color: 'warning',
      timeout: 5000,
    };
    errorCargandoReservas.value = true;
    loadingReservas.value = false;
    return;
  }

  try {
    // Paso 1: Obtener las reservas del usuario
    const responseReservas = await axios.get(`${API_BASE_RESERVATIONS_URL}/user/${userId}`);
    reservas.value = responseReservas.data; // Almacena las reservas crudas (ej. { id: 1, userId: 1, hotelId: 2, precioTotal: 110.50 })

    // Paso 2: Para cada reserva, obtener los detalles completos del hotel
    // Usamos Promise.all para hacer todas las llamadas de hotel en paralelo
    const promises = reservas.value.map(async (reserva) => {
      const hotelDetails = await fetchHotelDetails(reserva.hotelId);
      // Combinamos la reserva con los detalles del hotel.
      // Si hotelDetails es null (por error en fetchHotelDetails), usamos un objeto placeholder.
      return {
        ...reserva, // Propiedades de la reserva (id, userId, hotelId, precioTotal)
        hotelDetails: hotelDetails || { // Propiedades del hotel (nombreHotel, ciudad, descripcion, etc.)
          hotelID: reserva.hotelId, // Mantén el ID del hotel, útil para depuración
          nombreHotel: 'Hotel Desconocido',
          ciudad: 'Ubicación No Disponible',
          descripcion: 'Detalles del hotel no pudieron ser cargados.',
          imageUrl: 'https://placehold.co/600x400/CCCCCC/000000?text=Hotel+No+Encontrado', // Placeholder si no se encuentra
          precioPorNoche: 0, // Valor por defecto
          calificacionEstrellas: 0,
          capacidadMaxima: 0,
          serviciosExclusivos: 'No disponibles'
        }
      };
    });

    // Esperar a que todas las promesas de detalles de hotel se resuelvan
    reservasDetalladas.value = await Promise.all(promises);

  } catch (err) {
    console.error('Error al cargar reservaciones o detalles de hotel:', err.response ? err.response.data : err.message);
    snackbar.value = {
      show: true,
      message: 'Error al cargar tus reservaciones. Inténtalo de nuevo.',
      color: 'error',
      timeout: 5000,
    };
    errorCargandoReservas.value = true;
  } finally {
    loadingReservas.value = false;
  }
}

/**
 * Elimina una reservación usando el endpoint DELETE.
 * @param {number} reservaId - El ID de la reserva a eliminar.
 */
async function eliminarReservacion(reservaId) {
  isDeleting.value = { ...isDeleting.value, [reservaId]: true }; // Activa el estado de carga para ese botón

  try {
    const response = await axios.delete(`${API_BASE_RESERVATIONS_URL}/${reservaId}`);

    if (response.status === 204) { // 204 No Content es el status esperado para un DELETE exitoso
      snackbar.value = {
        show: true,
        message: 'Reservación eliminada con éxito.',
        color: 'success',
      };
      // Después de eliminar exitosamente, recarga la lista de reservas
      await cargarReservaciones();
    } else {
      // Aunque el status no sea 204, si no lanzó un error, puede ser un caso especial.
      snackbar.value = {
        show: true,
        message: 'Hubo un problema al eliminar la reservación. Inténtalo de nuevo.',
        color: 'error',
      };
      console.error('Error al eliminar reserva - Status no 204:', response.status, response.data);
    }
  } catch (err) {
    console.error('Error al eliminar la reservación:', err.response ? err.response.data : err.message);
    let errorMessageText = 'Error al eliminar la reserva. Por favor, inténtalo de nuevo.';
    if (err.response && err.response.data && err.response.data.message) {
      errorMessageText = err.response.data.message;
    } else if (err.response && err.response.status === 404) {
      errorMessageText = 'La reserva que intentas eliminar no fue encontrada.';
    } else if (err.request) {
      errorMessageText = 'No se pudo conectar con el servidor de reservas.';
    }

    snackbar.value = {
      show: true,
      message: errorMessageText,
      color: 'error',
      timeout: 5000,
    };
  } finally {
    // Importante: Restablecer el estado de carga para el botón específico
    isDeleting.value = { ...isDeleting.value, [reservaId]: false };
  }
}

/**
 * Función para manejar errores de carga de imagen.
 * Cuando una imagen no se carga, se reemplaza con un placeholder.
 * @param {Event} event - El evento de error de la imagen.
 */
function onImageError(event) {
  event.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible';
}

// --- Hook de Ciclo de Vida ---
// Se ejecuta cuando el componente se monta en el DOM.
// Aquí es donde iniciamos la carga de las reservaciones.
onMounted(cargarReservaciones);
</script>

<style scoped>
/* Tus estilos existentes aquí. No necesitan cambios. */
.carrito-container {
  min-height: calc(100vh - 64px); /* Ajusta si tienes un app-bar/toolbar fijo */
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.btn-volver {
  background-color: #007bff; /* Color azul */
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
  display: block; /* Para que ocupe todo el ancho si está solo en una línea, y centrarlo */
  margin-left: auto;
  margin-right: auto;
}

.btn-volver:hover {
  background-color: #0056b3; /* Tono más oscuro al pasar el ratón */
}

/* Estilos de las tarjetas de hotel, si los necesitas. Ya los tienes en el otro componente. */
.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.h-full {
  height: 100%;
}

.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}
</style>