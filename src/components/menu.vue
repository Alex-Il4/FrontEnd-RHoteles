<template>
  <v-app-bar :elevation="2" rounded>
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Menu</v-app-bar-title>

    <template v-slot:append>
      <v-btn icon="mdi-heart"></v-btn>
      <v-btn icon="mdi-magnify"></v-btn>
      <v-btn icon="mdi-account-circle"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup>
</script>

<style scoped>
</style>