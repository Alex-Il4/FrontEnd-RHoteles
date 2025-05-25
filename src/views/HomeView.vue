<template>
  <v-app>
    <menu />

    <v-main class="bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <v-container fluid>
        <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Catálogo de Hoteles</h1>

        <v-row justify="center" class="w-full max-w-7xl mx-auto">
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            v-for="hotel in hotels"
            :key="hotel.id"
          >
            <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column">
              <v-img
                :src="hotel.imageUrl"
                :alt="hotel.nombreHotel"
                height="200px"
                class="object-cover"
                @error="onImageError"
              ></v-img>

              <v-card-title class="text-xl font-semibold text-gray-900 mb-2">{{ hotel.nombreHotel }}</v-card-title>
              <v-card-subtitle class="text-gray-600 text-sm mb-2">{{ hotel.ciudad }}</v-card-subtitle>
              <v-card-text class="text-gray-700 text-base flex-grow">
                {{ hotel.descripcion }}
              </v-card-text>

              <v-spacer></v-spacer> <v-card-actions class="d-flex flex-column align-start pt-0">
                <p class="text-lg font-bold text-blue-600 mb-4 ml-4">${{ hotel.precioPorNoche.toFixed(2) }} / noche</p>
                <v-btn
                  color="blue"
                  dark
                  block
                  class="rounded-md transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                  @click="reserveHotel(hotel)"
                >
                  Reservar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="showMessage"
      :timeout="3000"
      color="success"
      bottom
      right
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="showMessage = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import menu from '../components/menu.vue';
export default {
  name: 'HomeView',
  components: {
    menu // Asegúrate de que el nombre aquí coincide con el que usarás en el template
  },
  data() {
    return {
      // Simulación de datos de hoteles de una api de la db
      hotels: [
        {
          id: 1,
          nombreHotel: 'Gran Hotel Central',
          descripcion: 'Un hotel de lujo en el corazón de la ciudad, ideal para negocios y turismo.',
          ciudad: 'San Salvador',
          precioPorNoche: 150.00,
          imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=Hotel+Central'
        },
        {
          id: 2,
          nombreHotel: 'Hotel Playa Sol',
          descripcion: 'Perfecto para unas vacaciones relajantes junto al mar, con acceso directo a la playa.',
          ciudad: 'La Libertad',
          precioPorNoche: 120.50,
          imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=Hotel+Playa'
        },
        {
          id: 3,
          nombreHotel: 'Montaña Escondida Lodge',
          descripcion: 'Acogedor lodge en las montañas, ideal para amantes de la naturaleza y el senderismo.',
          ciudad: 'Santa Ana',
          precioPorNoche: 95.00,
          imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=Hotel+Montana'
        },
        {
          id: 4,
          nombreHotel: 'City View Suites',
          descripcion: 'Modernas suites con vistas panorámicas de la ciudad, cerca de las principales atracciones.',
          ciudad: 'San Salvador',
          precioPorNoche: 180.00,
          imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=City+View'
        },
        {
          id: 5,
          nombreHotel: 'Hostal Colonial',
          descripcion: 'Encantador hostal con arquitectura colonial, ambiente tranquilo y familiar.',
          ciudad: 'Suchitoto',
          precioPorNoche: 70.00,
          imageUrl: 'https://placehold.co/600x400/000000/FFFFFF?text=Hostal+Colonial'
        }
      ],
      message: '',
      showMessage: false,
    };
  },
  methods: {
    reserveHotel(hotel) {
      this.message = `¡Hotel "${hotel.nombreHotel}" reservado con éxito!`;
      this.showMessage = true;
    },
    onImageError(event) {
      event.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible';
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.v-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.v-card-text.flex-grow {
  flex-grow: 1;
}
</style>
