<template>
  <v-app-bar :elevation="2" rounded>
    <template v-slot:prepend>
      <!-- Menú principal de navegación (manteniendo tus vistas) -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-menu" variant="text" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in mainMenuItems"
            :key="i"
            :value="i"
            @click="item.onclick"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>

    <!-- Título de la barra de aplicación, puedes cambiarlo por el nombre de tu sitio -->
    <v-app-bar-title>Hoteles para Vacacionar</v-app-bar-title>

    <template v-slot:append>
      <!-- Icono de Carrito -->
      <v-btn
        icon="mdi-cart"
        title="Ir al Carrito de Compras"
        @click="goToPage('/carrito')"
      ></v-btn>

      <!-- Icono de Usuario/Perfil -->
      <v-btn
        icon="mdi-account-circle"
        title="Ver Perfil / Iniciar Sesión"
        @click="goToPage('/login')"
      ></v-btn>

      <!-- Menú expandible para Cerrar Sesión y otras opciones de usuario -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            title="Opciones de Usuario"
            v-bind="props"
          ></v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>
              <v-icon left>mdi-logout</v-icon>
              Cerrar Sesión
            </v-list-item-title>
          </v-list-item>
          <!-- Puedes añadir más opciones aquí si lo deseas -->
          <!-- <v-list-item @click="goToPage('/configuracion')">
            <v-list-item-title>
              <v-icon left>mdi-cog</v-icon>
              Configuración
            </v-list-item-title>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// Función genérica para navegar a una ruta
const goToPage = (path) => {
  router.push(path);
};

// Items para el menú principal (el que ya tenías)
const mainMenuItems = [
  {
    title: 'Inicio', // Nombre más genérico
    onclick: () => {
      goToPage('/');
    },
  }
];

// Función para cerrar sesión
const logout = () => {
  // Aquí implementarías la lógica real para cerrar la sesión del usuario:
  // 1. Eliminar el token de autenticación (localStorage, Vuex/Pinia store, cookies).
  // 2. Redirigir al usuario a la página de login o inicio.
  console.log('Cerrar Sesión iniciado.');
  // Ejemplo: Redirigir a la página de login
  goToPage('/Login');
  alert('Has cerrado sesión exitosamente.'); // Reemplazar con una notificación más elegante
};
</script>

<style scoped>
/* Puedes añadir estilos específicos si es necesario, pero Vuetify maneja la mayoría */
</style>