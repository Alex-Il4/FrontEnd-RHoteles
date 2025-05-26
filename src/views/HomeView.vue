<template>
  
    <Menu />

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
            class="mb-6"
          >
            <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column">
              <v-img
                :src="hotel.imageUrl"
                :alt="hotel.nombreHotel"
                height="200px"
                cover
                @error="onImageError"
              />

              <v-card-title class="text-xl font-semibold text-gray-900 mb-2">
                {{ hotel.nombreHotel }}
              </v-card-title>
              <v-card-subtitle class="text-gray-600 text-sm mb-2">
                {{ hotel.ciudad }}
              </v-card-subtitle>
              <v-card-text class="text-gray-700 text-base flex-grow">
                {{ hotel.descripcion }}
              </v-card-text>

              <v-spacer></v-spacer>
              <v-card-actions class="d-flex flex-column align-start pt-0">
                <p class="text-lg font-bold text-blue-600 mb-4 ml-4">
                  ${{ hotel.precioPorNoche.toFixed(2) }} / noche
                </p>
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
  
</template>

<script>
import Menu from '../components/menu.vue';

export default {
  name: 'HomeView',
  components: {
    Menu,
  },
  data() {
    return {
      hotels: [
        {
          id: 1,
          nombreHotel: 'Gran Hotel Central',
          descripcion: 'Un hotel de lujo en el corazón de la ciudad.',
          ciudad: 'San Salvador',
          precioPorNoche: 150.00,
          imageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 2,
          nombreHotel: 'Hotel Playa Sol',
          descripcion: 'Perfecto para unas vacaciones junto al mar.',
          ciudad: 'La Libertad',
          precioPorNoche: 120.50,
          imageUrl: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2e2d2?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 3,
          nombreHotel: 'Montaña Escondida Lodge',
          descripcion: 'Ideal para amantes de la naturaleza.',
          ciudad: 'Santa Ana',
          precioPorNoche: 95.00,
          imageUrl: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 4,
          nombreHotel: 'City View Suites',
          descripcion: 'Modernas suites con vistas panorámicas.',
          ciudad: 'San Salvador',
          precioPorNoche: 180.00,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 5,
          nombreHotel: 'Hostal Colonial',
          descripcion: 'Encantador hostal con arquitectura colonial.',
          ciudad: 'Suchitoto',
          precioPorNoche: 70.00,
          imageUrl: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 6,
          nombreHotel: 'Eco Hotel Verde',
          descripcion: 'Con enfoque ecológico, rodeado de naturaleza.',
          ciudad: 'Chalatenango',
          precioPorNoche: 110.00,
          imageUrl: 'https://images.unsplash.com/photo-1600585154207-2990a0873c6c?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 7,
          nombreHotel: 'Hotel Boutique Encanto',
          descripcion: 'Boutique moderno en el centro histórico.',
          ciudad: 'Santa Tecla',
          precioPorNoche: 130.00,
          imageUrl: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 8,
          nombreHotel: 'Resort Las Palmas',
          descripcion: 'Resort con piscina y todo incluido.',
          ciudad: 'La Unión',
          precioPorNoche: 200.00,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 9,
          nombreHotel: 'Villa del Lago',
          descripcion: 'Hermosa villa frente al lago.',
          ciudad: 'Coatepeque',
          precioPorNoche: 145.00,
          imageUrl: 'https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 10,
          nombreHotel: 'Cabañas del Bosque',
          descripcion: 'Cabañas rústicas en el bosque.',
          ciudad: 'Ahuachapán',
          precioPorNoche: 85.00,
          imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41c00817?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 11,
          nombreHotel: 'Sunset Paradise Hotel',
          descripcion: 'Vistas increíbles al atardecer.',
          ciudad: 'Sonsonate',
          precioPorNoche: 160.00,
          imageUrl: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800'
        },
        {
          id: 12,
          nombreHotel: 'Hotel El Mirador',
          descripcion: 'Panorámica espectacular desde la cima.',
          ciudad: 'Perquín',
          precioPorNoche: 100.00,
          imageUrl: 'https://images.unsplash.com/photo-1582719478189-c75f2a78e881?auto=format&fit=crop&w=800&q=80'
        }
      ],
      message: '',
      showMessage: false,
    };
  },
  methods: {
    reserveHotel(hotel) {
      const existingReservations = JSON.parse(localStorage.getItem('reservas') || '[]');

      // Crear un objeto de reservación con las propiedades que CarritoView espera
      // ¡Asegúrate de incluir la URL de la imagen aquí!
      const newReservation = {
        id: hotel.id,
        nombre: hotel.nombreHotel,
        ubicacion: hotel.ciudad,
        precio: hotel.precioPorNoche,
        descripcion: hotel.descripcion,
        imageUrl: hotel.imageUrl // <-- ¡Esta es la línea clave!
      };

      existingReservations.push(newReservation);
      localStorage.setItem('reservas', JSON.stringify(existingReservations));

      this.$router.push('/carrito');
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