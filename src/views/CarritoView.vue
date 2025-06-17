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
          class="d-flex"
        >
          <v-card class="hotel-card d-flex flex-column" elevation="5">
            <v-img :src="getHotelImage(reserva.hotelDetails.hotelID)" class="white--text align-end" height="200px" cover>
              <v-card-title class="hotel-card-title">{{ reserva.hotelDetails.nombreHotel }}</v-card-title>
            </v-img>

            <v-card-text class="flex-grow-1">
              <div class="text-subtitle-1 mb-2">
                <v-icon small left>mdi-map-marker</v-icon>
                {{ reserva.hotelDetails.ciudad }}
              </div>
              <v-rating
                :value="reserva.hotelDetails.calificacionEstrellas"
                color="amber"
                dense
                half-increments
                readonly
                size="20"
              ></v-rating>
              <p class="description mt-3">{{ reserva.hotelDetails.descripcion }}</p>
              <div class="mt-3">
                <p class="font-weight-medium">Precio por Noche: ${{ reserva.hotelDetails.precioPorNoche ? reserva.hotelDetails.precioPorNoche.toFixed(2) : '0.00' }}</p>
                <p class="font-weight-medium">Servicios Exclusivos: {{ reserva.hotelDetails.serviciosExclusivos }}</p>
                <p class="font-weight-medium">Capacidad Máxima: {{ reserva.hotelDetails.capacidadMaxima }} personas</p>
              </div>
            </v-card-text>

            <v-card-actions class="pt-0 d-flex flex-column align-start">
              <p class="text-lg font-bold text-blue-600 mb-4 ml-4">
                ${{ reserva.precioTotal ? reserva.precioTotal.toFixed(2) : '0.00' }} / Total Reserva
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

// --- Importa tus imágenes locales explícitamente aquí ---
// (Estas rutas deben ser relativas a la ubicación de este archivo CarritoView.vue)
// Ejemplo: si tus imágenes están en 'src/assets/images/', y CarritoView.vue está en 'src/views/',
// entonces la ruta sería '../../assets/images/hotel1.jpg'
import hotel1Img from '../assets/hotel1.jpg';
import hotel2Img from '../assets/hotel2.jpg';
// Agrega más imports para cada imagen local que tengas, si aplica.
// Si no tienes imágenes locales y solo quieres usar URLs, puedes eliminar estos imports.


// --- Inicialización ---
const router = useRouter();
const store = useStore();

// --- Variables Reactivas (Estado del componente) ---
const reservas = ref([]);
const reservasDetalladas = ref([]);
const loadingReservas = ref(true);
const errorCargandoReservas = ref(false);
const isDeleting = ref({});

const snackbar = ref({
  show: false,
  message: '',
  color: '',
  timeout: 3000,
});

// --- Mapeo de Imágenes Locales (debe coincidir con HotelesView) ---
// Si tus IDs de hotel en el backend son dinámicos, esto es menos práctico.
// En un entorno de producción, las URLs de imágenes deberían venir de tu backend.
const localHotelImages = {
  1: hotel1Img,
  2: hotel2Img,
  // Asegúrate de mapear los IDs de hotel a las imágenes correctas si las tienes.
  // Ejemplo:
  // 3: hotel3Img, // Si tienes hotel3.jpg y su ID es 3
};


// --- Funciones ---

/**
 * Obtiene la ruta de imagen para un hotel dado su ID.
 * Si no hay una imagen local mapeada, devuelve un placeholder genérico.
 * @param {number} id - El ID del hotel.
 * @returns {string} La ruta de la imagen o URL del placeholder.
 */
const getHotelImage = (id) => {
  // Aquí puedes decidir si prefieres usar una URL directa de hotelDetails
  // si tu backend ya la envía (como 'hotel.imageUrl' o 'hotel.image_url')
  // o si prefieres seguir usando el mapeo local.
  // Por ahora, usamos el mapeo local como en HotelesView.
  return localHotelImages[id] || 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary-800x450.webp';
};

/**
 * Redirige al usuario a la página principal de hoteles.
 */
function volverHome() {
  router.push('/');
}

/**
 * Obtiene los detalles de un hotel dado su ID desde la API de hoteles.
 * @param {number} hotelId - El ID del hotel.
 * @returns {Promise<object|null>} Los detalles del hotel o null si hay un error.
 */
async function fetchHotelDetails(hotelId) {
  try {
    const response = await axios.get(`/api/hoteles/${hotelId}`);
    console.log(`Detalles del hotel ${hotelId} obtenidos:`, response.data); // Log para verificar la respuesta del backend
    // Si tu backend envía 'imageUrl' aquí, podrías usarlo directamente
    // response.data.imageUrl = response.data.imageUrl || getHotelImage(hotelId);
    return response.data;
  } catch (err) {
    console.error(`Error al obtener detalles del hotel ${hotelId}:`, err.response ? err.response.data : err.message);
    return null;
  }
}

/**
 * Carga las reservas del usuario autenticado desde el backend.
 * Luego, para cada reserva, obtiene los detalles completos del hotel.
 */
async function cargarReservaciones() {
  loadingReservas.value = true;
  errorCargandoReservas.value = false;
  reservasDetalladas.value = [];

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
    const responseReservas = await axios.get(`/api/reservations/user/${userId}`);
    reservas.value = responseReservas.data;

    const promises = reservas.value.map(async (reserva) => {
      console.log(`Procesando reserva con hotelId: ${reserva.hotelId}`);
      const hotelDetails = await fetchHotelDetails(reserva.hotelId);

      console.log(`>>>> hotelDetails recibido para ${reserva.hotelId}:`, hotelDetails);
      console.log(`>>>> Tipo de hotelDetails:`, typeof hotelDetails);
      if (hotelDetails && typeof hotelDetails === 'object') {
          console.log(`>>>> Propiedades de hotelDetails:`, Object.keys(hotelDetails));
      }

      return {
        ...reserva,
        hotelDetails: hotelDetails || {
          hotelID: reserva.hotelId,
          nombreHotel: 'Hotel Desconocido',
          ciudad: 'Ubicación No Disponible',
          descripcion: 'Detalles del hotel no pudieron ser cargados.',
          // Importante: Si tu backend no proporciona imageUrl,
          // getHotelImage se encargará del placeholder.
          // Si lo proporciona, este placeholder aquí es menos crítico,
          // pero sirve como último recurso si fetchHotelDetails falla completamente.
          precioPorNoche: 0,
          calificacionEstrellas: 0,
          capacidadMaxima: 0,
          serviciosExclusivos: 'No disponibles'
        }
      };
    });

    reservasDetalladas.value = await Promise.all(promises);
    console.log('Final reservasDetalladas (para depuración):', reservasDetalladas.value);

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
  isDeleting.value = { ...isDeleting.value, [reservaId]: true };

  try {
    const response = await axios.delete(`api/reservations/${reservaId}`);

    if (response.status === 204) {
      snackbar.value = {
        show: true,
        message: 'Reservación eliminada con éxito.',
        color: 'success',
      };
      await cargarReservaciones(); // Recargar la lista
    } else {
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
    isDeleting.value = { ...isDeleting.value, [reservaId]: false };
  }
}

// Ya no necesitamos onImageError si getHotelImage siempre devuelve una URL válida/placeholder
// function onImageError(event) {
//   event.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible';
// }

onMounted(cargarReservaciones);
</script>

<style scoped>
/* Añade o ajusta estos estilos según sea necesario para que coincidan con HotelesView */
.carrito-container {
  min-height: 100vh;
}

.btn-volver {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out mb-6;
}

/* Estilos de la tarjeta de hotel (puedes copiarlos directamente de tu archivo CSS o style block de HotelesView) */
.hotel-card {
  height: 100%; /* Asegura que las tarjetas tengan la misma altura */
  border-radius: 8px; /* Ejemplo de borde redondeado */
  display: flex;
  flex-direction: column;
}

.hotel-card-title {
  background: rgba(0, 0, 0, 0.5); /* Fondo semitransparente para el título en la imagen */
  color: white;
  padding: 8px 16px;
  font-size: 1.25rem; /* Ajusta según tus preferencias */
  font-weight: bold;
}

.description {
  /* Estilos para la descripción, como limitar líneas si es necesario */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita a 3 líneas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

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