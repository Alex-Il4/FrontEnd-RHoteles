<template>
  <v-app-bar :elevation="2" rounded>
    <template v-slot:prepend>
      <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                :value="i"
              >
                <v-list-item-title @click="item.onclick">{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
    </template>

    <v-app-bar-title>Menu</v-app-bar-title>

    <template v-slot:append>
      <v-btn @click="router.push('/Login')" icon="mdi-account-circle"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const items = [
  {
    title: 'Vista de Andrew',
    onclick: () => {
      router.push('/home'); // Redirige a la vista principal. Reecuerden cambiar nombre del item
    },
  },
  {
    title: 'Vista de David',
    onclick: () => {
      router.push('/carrito'); //Recuerden cambiar el path a sus componentes
    },
  },
  {
    title: 'Vista de Fidel',
    onclick: () => {
      router.push('/'); //Recuerden cambiar el path a sus componentes
    },
  },
];
</script>

<style scoped>
</style>