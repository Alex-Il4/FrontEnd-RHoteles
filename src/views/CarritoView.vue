<template>
  <v-app>
    <Menu />

    <v-main>
      <div class="carrito-container bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
        <v-btn @click="volverHome" color="primary" class="mb-6 mx-auto d-block">
          Reservar más
          <v-icon right>mdi-plus</v-icon>
        </v-btn>

        <h1 class="text-h4 text-sm-h3 text-md-h2 font-bold text-gray-800 mb-8 text-center">Tus Reservaciones</h1>

        <v-row v-if="loading" justify="center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <p class="mt-4 text-gray-700">Cargando tus reservaciones...</p>
        </v-row>

        <v-row v-else-if="error" justify="center">
          <v-col cols="12" class="text-center">
            <v-alert type="error" prominent>
              Lo sentimos, no pudimos cargar tus reservaciones. Por favor, inténtalo de nuevo más tarde.
              <br>
              <span v-if="!userId" class="font-weight-bold">Asegúrate de que se haya establecido un ID de
                usuario.</span>
            </v-alert>
          </v-col>
        </v-row>

        <div v-else-if="reservations.length === 0" class="text-center text-gray-700 text-lg">
          No hay reservaciones realizadas para el usuario actual (ID: {{ userId || 'no definido' }}).
        </div>

        <v-container fluid class="w-full max-w-7xl mx-auto">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="4" lg="3" v-for="reservation in reservations" :key="reservation.id"
              class="mb-6 d-flex">
              <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column hotel-card">
                <v-img :src="getHotelImage(reservation.hotelId)"
                  :alt="getHotelDetail(reservation.hotelId, 'nombreHotel')" height="200px" cover>
                  <v-card-title class="hotel-card-title">{{ getHotelDetail(reservation.hotelId, 'nombreHotel')
                    }}</v-card-title>
                </v-img>

                <v-card-text class="text-gray-700 text-base flex-grow">
                  <div class="text-subtitle-1 mb-2">
                    <v-icon small left>mdi-map-marker</v-icon>
                    {{ getHotelDetail(reservation.hotelId, 'ciudad') }}
                  </div>
                  <v-rating :value="getHotelDetail(reservation.hotelId, 'calificacionEstrellas')" color="amber" dense
                    half-increments readonly size="20"></v-rating>
                  <p class="description mt-3">{{ getHotelDetail(reservation.hotelId, 'descripcion') }}</p>
                  <div class="mt-3">
                    <p class="font-weight-medium">Precio por Noche: ${{ getHotelDetail(reservation.hotelId,
                      'precioPorNoche') ? getHotelDetail(reservation.hotelId, 'precioPorNoche').toFixed(2) : 'N/A' }}
                    </p>
                    <p class="font-weight-medium">Servicios Exclusivos: {{ getHotelDetail(reservation.hotelId,
                      'serviciosExclusivos') || 'No especificado' }}</p>
                    <p class="font-weight-medium">Capacidad Máxima: {{ getHotelDetail(reservation.hotelId,
                      'capacidadMaxima') || 'N/A' }} personas</p>
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
import { ref, onMounted, computed, watchEffect } from 'vue'; // Import watchEffect
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import Menu from '../components/menu.vue';

// Importar imágenes locales
import hotel1Img from '../assets/hotel1.jpg';
import hotel2Img from '../assets/hotel2.jpg';

const router = useRouter();
const store = useStore();
const reservations = ref([]);
const allHotels = ref([]);
const loading = ref(true);
const error = ref(false);

// Usa una propiedad computada para obtener userId del store de Vuex
const userId = computed(() => store.getters.getUserId); 

// Mapeo de IDs de hotel a sus imágenes locales
const localHotelImages = {
  1: hotel1Img,
  2: hotel2Img,
};

const getHotelImage = (hotelId) => {
  return localHotelImages[hotelId] || 'https://via.placeholder.com/400x200/CCCCCC/000000?text=Imagen+No+Disponible';
};

const getHotelDetail = (hotelId, property) => {
  const hotel = allHotels.value.find(h => h.hotelID === hotelId);
  return hotel ? hotel[property] : 'N/A';
};

const fetchReservationsAndHotels = async () => {
  loading.value = true;
  error.value = false;

  // Usa el userId de la propiedad computada
  if (!userId.value) {
    console.warn('No hay un UserID disponible en el store. No se cargarán reservas.');
    loading.value = false; // Importante para quitar el estado de carga
    return; // Salir si el userId no está presente
  }

  try {
    const hotelsResponse = await axios.get('http://localhost:8081/api/hoteles');
    allHotels.value = hotelsResponse.data;

    const reservationsResponse = await axios.get(`http://localhost:8081/api/reservations/user/${userId.value}`);
    reservations.value = reservationsResponse.data;

  } catch (err) {
    console.error('Error al cargar reservaciones o hoteles:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const confirmDeleteReservation = async (reservationId) => {
  if (confirm(`¿Estás seguro de que quieres eliminar la reservación ID: ${reservationId}?`)) {
    try {
      await axios.delete(`http://localhost:8081/api/reservations/${reservationId}`);
      await fetchReservationsAndHotels(); // Recargar después de eliminar
      alert('Reservación eliminada con éxito.');
    } catch (err) {
      console.error('Error al eliminar reservación:', err);
      if (err.response && err.response.status === 404) {
        alert('La reservación no fue encontrada. Posiblemente ya fue eliminada.');
      } else {
        alert('Hubo un error al eliminar la reservación. Por favor, inténtalo de nuevo.');
      }
    }
  }
};

function volverHome() {
  router.push('/hoteles');
}

// **CAMBIO CLAVE: Usa watchEffect para reaccionar al cambio de userId**
watchEffect(() => {
  // Solo intenta cargar las reservas si userId tiene un valor
  if (userId.value) {
    fetchReservationsAndHotels();
  } else {
    // Si userId es null, puedes limpiar las reservas o mostrar un mensaje
    reservations.value = [];
    loading.value = false;
    // console.log("UserID es nulo, esperando a que se cargue."); // Puedes dejar esto para depuración
  }
});

// onMounted ya no es estrictamente necesario para *iniciar* la carga,
// ya que watchEffect lo hará cuando userId esté disponible.
// Sin embargo, si tienes otras inicializaciones que deben ocurrir una sola vez
// al montar el componente, puedes mantener onMounted.
// onMounted(fetchReservationsAndHotels); // <-- Descomenta si necesitas más cosas aquí

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