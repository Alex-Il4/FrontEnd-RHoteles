// store/index.js (o dentro de un módulo, ej: store/modules/user.js)

import { createStore } from 'vuex'; // Si usas Vuex 4 con Vue 3
// import Vuex from 'vuex'; // Si usas Vuex 3 con Vue 2

// Si usas Vuex 3 con Vue 2, necesitarías:
// Vue.use(Vuex);

const store = createStore({ // O new Vuex.Store si es Vuex 3
  state: {
    // Aquí guardaremos el ID del usuario autenticado.
    // Inicialmente es null o 0, indicando que no hay usuario logueado.
    userId: null,
    isAuthenticated: false, // También útil para saber si hay sesión activa
    username: null,
    email: null,
    // Puedes añadir el token aquí si en el futuro decides usarlo
    // token: null,
  },
  mutations: {
    // Las mutaciones son la única forma de cambiar el estado de forma síncrona
    setUserData(state, userData) {
      state.userId = userData.userId;
      state.username = userData.username;
      state.email = userData.email;
      state.isAuthenticated = true;
      // state.token = userData.token; // Si usas tokens
    },
    clearUserData(state) {
      state.userId = null;
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
      // state.token = null;
    }
  },
  actions: {
    // Las acciones pueden contener lógica asíncrona y luego hacer commit de mutaciones
    login({ commit }, userData) {
      // Aquí podrías añadir lógica para guardar el token en localStorage si lo usaras.
      commit('setUserData', userData);
    },
    logout({ commit }) {
      // Aquí podrías añadir lógica para limpiar el token de localStorage.
      commit('clearUserData');
    }
  },
  getters: {
    // Los getters son como propiedades computadas para el store
    getUserId: (state) => state.userId,
    isAuthenticated: (state) => state.isAuthenticated,
    getUsername: (state) => state.username,
    getEmail: (state) => state.email,
  }
});

export default store;