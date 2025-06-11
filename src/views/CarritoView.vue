<template>
  <div class="carrito-container bg-gray-100 font-sans py-8 px-4 sm:px-6 lg:px-8">
    <button @click="volverHome" class="btn-volver">Reservar más</button>

    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Tus Reservaciones</h1>
    
    <div v-if="hoteles.length === 0" class="text-center text-gray-700 text-lg">
      No hay reservaciones realizadas.
    </div>

    <v-container fluid class="w-full max-w-7xl mx-auto">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="(hotel, index) in hoteles"
          :key="hotel.id"
          class="mb-6"
        >
          <v-card class="rounded-lg shadow-lg overflow-hidden h-full d-flex flex-column">
            <v-img
              :src="hotel.imageUrl || 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible'"
              :alt="hotel.nombre"
              height="200px"
              cover
              @error="onImageError"
            />

            <v-card-title class="text-xl font-semibold text-gray-900 mb-2">
              {{ hotel.nombre }}
            </v-card-title>
            <v-card-subtitle class="text-gray-600 text-sm mb-2">
              {{ hotel.ubicacion }}
            </v-card-subtitle>
            <v-card-text class="text-gray-700 text-base flex-grow">
              {{ hotel.descripcion }}
            </v-card-text>

            <v-spacer></v-spacer>
            <v-card-actions class="d-flex flex-column align-start pt-0">
              <p class="text-lg font-bold text-blue-600 mb-4 ml-4">
                ${{ hotel.precio.toFixed(2) }} / noche
              </p>
              <v-btn
                color="red"
                dark
                block
                class="rounded-md transition duration-300 ease-in-out shadow-md hover:shadow-lg"
                @click="eliminarReservacion(index)"
              >
                Eliminar reservación
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hoteles = ref([])

onMounted(() => {
  const datos = localStorage.getItem('reservas')
  hoteles.value = datos ? JSON.parse(datos) : []
})

function volverHome() {
  router.push('/home')
}

function eliminarReservacion(index) {
  hoteles.value.splice(index, 1)
  localStorage.setItem('reservas', JSON.stringify(hoteles.value))
}

// Función para manejar errores de carga de imagen
function onImageError(event) {
  event.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Imagen+No+Disponible';
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.carrito-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

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

.btn-volver {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: fit-content;
}
</style>