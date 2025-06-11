<template>
     <Menu />
  <v-container class="my-8">
   
    <h2 class="text-h4 text-center mb-6">Nuestros Hoteles Destacados</h2>
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
      <v-col
        v-for="hotel in hotels"
        :key="hotel.hotelID"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex"
      >
        <v-card class="hotel-card d-flex flex-column" elevation="5">
          <v-img
            :src="getHotelImage(hotel.hotelID)"
            class="white--text align-end"
            height="200px"
            cover
          >
            <v-card-title class="hotel-card-title">{{ hotel.nombreHotel }}</v-card-title>
          </v-img>

          <v-card-text class="flex-grow-1">
            <div class="text-subtitle-1 mb-2">
              <v-icon small left>mdi-map-marker</v-icon>
              {{ hotel.ciudad }}
            </div>
            <v-rating
              :value="hotel.calificacionEstrellas"
              color="amber"
              dense
              half-increments
              readonly
              size="20"
            ></v-rating>
            <p class="description mt-3">{{ hotel.descripcion }}</p>
            <div class="mt-3">
              <p class="font-weight-medium">Precio por Noche: ${{ hotel.precioPorNoche.toFixed(2) }}</p>
              <p class="font-weight-medium">Servicios Exclusivos: {{ hotel.serviciosExclusivos }}</p>
              <p class="font-weight-medium">Capacidad Máxima: {{ hotel.capacidadMaxima }} personas</p>
            </div>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn color="primary" text @click="reserveHotel(hotel.hotelID)">
              Reservar
              <v-icon right>mdi-check-circle</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import menu from '../components/menu.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Import your local images explicitly here
import hotel1Img from '../assets/hotel1.jpg';
import hotel2Img from '../assets/hotel2.jpg';
// Add more imports for each local image you have, e.g.:
// import hotel3Img from '../assets/hotel3.jpg';


export default {
  name: 'HotelesList',
  setup() {
    const hotels = ref([]);
    const loading = ref(true);
    const error = ref(false);

    // Map your hotel IDs to the imported image variables
    const localHotelImages = {
      1: hotel1Img, // Assign the imported image variable to hotelID 1
      2: hotel2Img, // Assign the imported image variable to hotelID 2
      // Continue for other hotel IDs:
      // 3: hotel3Img,
    };

    const getHotelImage = (id) => {
      // Return the imported image if it exists, otherwise a placeholder
      return localHotelImages[id] || 'https://via.placeholder.com/400x200/CCCCCC/000000?text=Imagen+No+Disponible';
    };

    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/hoteles');
        hotels.value = response.data;
      } catch (err) {
        console.error('Error fetching hotels:', err);
        error.value = true;
      } finally {
        loading.value = false;
      }
    };

    const reserveHotel = (id) => {
      console.log('Attempting to reserve hotel:', id);
      alert(`Has iniciado el proceso de reserva para el hotel ID: ${id}`);
    };

    onMounted(fetchHotels);

    return {
      hotels,
      loading,
      error,
      getHotelImage,
      reserveHotel,
    };
  },
};
</script>

<style scoped>
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
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
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