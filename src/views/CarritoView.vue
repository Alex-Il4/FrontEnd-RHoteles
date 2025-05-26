<template>
  <div class="carrito-container">
    <button @click="volverHome" class="btn-volver">Regresar al catálogo</button>

    <h1>Reservaciones</h1>
    <div v-if="hoteles.length === 0">
      No hay reservaciones realizadas.
    </div>

    <div v-for="(hotel, index) in hoteles" :key="hotel.id" class="card">
      <h2>{{ hotel.nombre }}</h2>
      <p><strong>Ubicación:</strong> {{ hotel.ubicacion }}</p>
      <p><strong>Precio:</strong> {{ hotel.precio }}</p>
      <p><strong>Descripción:</strong> {{ hotel.descripcion }}</p>

      <button @click="eliminarReservacion(index)" class="btn-eliminar">
        Eliminar reservación
      </button>
    </div>
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
</script>

<style scoped>
.carrito-container {
  padding: 2rem;
}

.card {
  border: 1px solid #ccc;
  border-radius: 12px;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.btn-volver {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 8px;
}

.btn-eliminar {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 8px;
}
</style>
