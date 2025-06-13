<template>
  <v-app>
    <Menu />

    <v-main>
      <div class="carrito-container bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
        <v-btn @click="volverHome" color="primary" class="mb-6 mx-auto d-block">
          Reservar más
          <v-icon right>mdi-plus</v-icon>
        </v-btn>

        <h1 class="text-h4 text-sm-h3 text-md-h2 font-bold text-gray-800 mb-8 text-center">Reservaciones</h1>

        <v-row v-if="loading" justify="center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4 text-gray-700">Cargando tus reservaciones...</p>
        </v-row>

        <v-row v-else-if="error" justify="center">
          <v-col cols="12" class="text-center">
            <v-alert type="error" prominent>
              Lo sentimos, no pudimos cargar tus reservaciones. Por favor, inténtalo de nuevo más tarde.
              <br>
              <span v-if="!userId" class="font-weight-bold">Asegúrate de haber iniciado sesión.</span>
              <br>
              <span v-if="errorMessage">{{ errorMessage }}</span>
            </v-alert>
          </v-col>
        </v-row>

        <div v-else-if="reservations.length === 0" class="text-center text-gray-700 text-lg">
          No hay reservaciones realizadas para el usuario actual (ID: {{ userId || 'no definido' }}).
          <div v-if="userId && !loading">
            <p>Es posible que no tengas reservas o que haya habido un problema al cargarlas.</p>
          </div>
        </div>

        <v-container fluid class="w-full max-w-7xl mx-auto">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" v-for="reservation in reservations" :key="reservation.id"
              class="mb-6 d-flex">
              <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column hotel-card">
                <v-img :src="getHotelImage(reservation.hotel?.hotelID)"
                  :alt="reservation.hotel?.nombreHotel" height="200px" cover>
                  <v-card-title class="hotel-card-title">{{ reservation.hotel?.nombreHotel
                    }}</v-card-title>
                </v-img>

                <v-card-text class="text-gray-700 text-base flex-grow">
                  <div class="text-subtitle-1 mb-2">
                    <v-icon small left>mdi-map-marker</v-icon>
                    {{ reservation.hotel?.ciudad }}
                  </div>
                  <v-rating :value="reservation.hotel?.calificacionEstrellas" color="amber" dense
                    half-increments readonly size="20"></v-rating>
                  <p class="description mt-3">{{ reservation.hotel?.descripcion }}</p>
                  <div class="mt-3">
                    <p class="font-weight-medium">Precio por Noche: ${{ reservation.hotel?.precioPorNoche ? reservation.hotel.precioPorNoche.toFixed(2) : 'N/A' }}
                    </p>
                    <p class="font-weight-medium">Servicios Exclusivos: {{ reservation.hotel?.serviciosExclusivos || 'No especificado' }}</p>
                    <p class="font-weight-medium">Capacidad Máxima: {{ reservation.hotel?.capacidadMaxima || 'N/A' }} personas</p>
                  </div>
                </v-card-text>

                <v-card-actions class="d-flex flex-column align-start pt-0">
                  <p class="text-lg font-bold text-blue-600 mb-4 ml-4">
                    Precio Total Reservación: ${{ reservation.precioTotal ? reservation.precioTotal.toFixed(2) : 'N/A'
                    }}
                  </p>
                  <v-btn color="red" dark block
                    class="rounded-md transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                    @click="confirmDeleteReservation(reservation.id)">
                    Eliminar reservación
                    <v-icon right>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import Menu from '../components/menu.vue';

// Importar imágenes locales. Asegúrate de que estas rutas son correctas.
import hotel1Img from '../assets/hotel1.jpg';
import hotel2Img from '../assets/hotel2.jpg';
// Si tienes más imágenes de hoteles, impórtalas aquí:
// import hotel3Img from '../assets/hotel3.jpg';

const router = useRouter();
const route = useRoute();
const store = useStore();

const reservations = ref([]);
const loading = ref(true);
const error = ref(false);
const errorMessage = ref(''); // Nuevo estado para mensajes de error específicos

const userId = computed(() => store.getters.getUserId);

const localHotelImages = {
  1: hotel1Img,
  2: hotel2Img,
};

const getHotelImage = (hotelId) => {
  // Ahora hotelId viene de reservation.hotel.hotelID
  return localHotelImages[hotelId] || 'https://via.placeholder.com/400x200/CCCCCC/000000?text=Imagen+No+Disponible';
};

const fetchReservationsAndHotels = async () => { // Renombrado de fetchReservationsAndHotels para reflejar que no carga hoteles por separado
  loading.value = true;
  error.value = false;
  errorMessage.value = ''; // Limpiar mensaje de error anterior

  if (!userId.value) {
    console.warn('fetchReservations: No hay un UserID disponible en el store. No se cargarán reservas.');
    loading.value = false;
    error.value = true;
    errorMessage.value = 'Necesitas iniciar sesión para ver tus reservaciones.';
    return;
  }

  try {
    // 2. Obtener las reservas para el usuario actual (ahora con detalles de hotel anidados)
    console.log(`fetchReservations: Intentando obtener reservas para userId: ${userId.value}...`);
    const reservationsResponse = await axios.get(`http://localhost:8081/api/reservations/user/${userId.value}`);
    reservations.value = reservationsResponse.data;
    console.log('fetchReservations: Reservas obtenidas:', reservations.value);

  } catch (err) {
    console.error('fetchReservations: Error al cargar reservaciones:', err);
    error.value = true;
    if (err.response) {
      errorMessage.value = `Error del servidor: ${err.response.status} - ${err.response.data.message || 'Error desconocido'}`;
      console.error('Detalles del error de respuesta:', err.response.data);
    } else if (err.request) {
      errorMessage.value = 'No se pudo conectar con el servidor. Asegúrate de que el backend esté en ejecución.';
      console.error('No se recibió respuesta del servidor:', err.request);
    } else {
      errorMessage.value = 'Error al configurar la solicitud. Por favor, revisa la consola.';
      console.error('Error de configuración de solicitud:', err.message);
    }
  } finally {
    loading.value = false;
  }
};

const createReservationFromQuery = async () => {
  const hotelIdFromQuery = route.query.hotelId;
  const precioPorNocheFromQuery = route.query.precioPorNoche;

  if (hotelIdFromQuery && precioPorNocheFromQuery && userId.value) {
    console.log(`createReservationFromQuery: Intentando crear reserva para HotelID: ${hotelIdFromQuery}, Precio: ${precioPorNocheFromQuery} para UserID: ${userId.value}`);
    try {
      const newReservation = {
        userId: userId.value,
        hotel: { hotelID: parseInt(hotelIdFromQuery) }, // Envía el ID del hotel dentro de un objeto hotel
        precioTotal: parseFloat(precioPorNocheFromQuery)
      };

      const response = await axios.post('http://localhost:8081/api/reservations', newReservation);
      console.log('createReservationFromQuery: Respuesta de creación de reserva:', response.data);
      alert('¡Hotel reservado con éxito!');

      router.replace({ query: null }); // Limpiar los parámetros de la URL

    } catch (err) {
      console.error('createReservationFromQuery: Error al crear la reserva desde la URL:', err);
      let alertMessage = 'Hubo un error al intentar reservar el hotel. Por favor, inténtalo de nuevo.';
      if (err.response) {
        alertMessage = `Error al reservar: ${err.response.data.message || 'Error desconocido del servidor.'}`;
      } else if (err.request) {
        alertMessage = 'No se pudo conectar con el servidor para reservar. Asegúrate de que el backend esté en ejecución.';
      }
      alert(alertMessage);
    }
  }
};

const confirmDeleteReservation = async (id) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la reservación ID: ${id}?`)) {
    try {
      console.log(`confirmDeleteReservation: Intentando eliminar reserva con ID: ${id}...`);
      await axios.delete(`http://localhost:8081/api/reservations/${id}`);
      console.log(`confirmDeleteReservation: Reserva ID ${id} eliminada.`);
      alert('Reservación eliminada con éxito.');
      await fetchReservationsAndHotels(); // Recargar las reservas

    } catch (err) {
      console.error('confirmDeleteReservation: Error al eliminar reservación:', err);
      let alertMessage = 'Hubo un error al eliminar la reservación. Por favor, inténtalo de nuevo.';
      if (err.response) {
        if (err.response.status === 404) {
          alertMessage = 'La reservación no fue encontrada. Posiblemente ya fue eliminada o no existe.';
        } else {
          alertMessage = `Error al eliminar: ${err.response.data.message || 'Error desconocido del servidor.'}`;
        }
      } else if (err.request) {
        alertMessage = 'No se pudo conectar con el servidor para eliminar. Asegúrate de que el backend esté en ejecución.';
      }
      alert(alertMessage);
    }
  }
};

function volverHome() {
  router.push('/hoteles');
}

watchEffect(() => {
  if (userId.value) {
    console.log(`watchEffect: UserID detectado: ${userId.value}.`);
    createReservationFromQuery();
    fetchReservationsAndHotels();
  } else {
    reservations.value = [];
    loading.value = false;
    error.value = true;
    errorMessage.value = 'Inicia sesión para ver tus reservas.';
    console.log("watchEffect: UserID es nulo, esperando a que se cargue para mostrar reservas.");
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.carrito-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

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
  color: white;
}

.description {
  color: #555;
  font-size: 0.95em;
}

.v-rating .v-icon {
  margin-right: 2px;
}

.text-sm-h3 {
  font-size: 2.5rem !important;
}

.text-md-h2 {
  font-size: 3rem !important;
}

.v-btn.mb-6.mx-auto.d-block {
  margin-bottom: 24px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>