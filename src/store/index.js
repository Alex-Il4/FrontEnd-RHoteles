// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    isAuthenticated: false,
    userId: null,
  },
  mutations: {
    // Cambiamos el nombre a setAuthData para mayor claridad
    // Esta mutación recibe tanto el estado de autenticación como el userId
    setAuthData(state, { isAuthenticated, userId }) {
      state.isAuthenticated = isAuthenticated;
      state.userId = userId;
    },
  },
  actions: {
    // La acción login ahora espera un 'userId' como argumento
    login({ commit }, userId) {
      return new Promise(resolve => {
        setTimeout(() => {
          // Llama a la mutación con el nuevo estado y el userId
          commit('setAuthData', { isAuthenticated: true, userId: userId });
          localStorage.setItem('userId', userId); // Guarda el userId en localStorage
          console.log('Usuario autenticado con ID:', userId);
          resolve(true);
        }, 1000);
      });
    },
    logout({ commit }) {
      // Al hacer logout, limpiamos tanto el estado de autenticación como el userId
      commit('setAuthData', { isAuthenticated: false, userId: null });
      localStorage.removeItem('userId'); // Elimina el userId de localStorage
      console.log('Usuario desautenticado!');
    },
    // Nueva acción para inicializar el estado de autenticación al cargar la app
    initializeAuth({ commit }) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        commit('setAuthData', { isAuthenticated: true, userId: storedUserId });
        console.log('Autenticación inicializada con userId:', storedUserId);
      } else {
        commit('setAuthData', { isAuthenticated: false, userId: null });
        console.log('No se encontró userId en localStorage. Sesión no autenticada.');
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUserId: (state) => state.userId,
  },
});

export default store;