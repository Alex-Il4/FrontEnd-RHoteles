// src/store/index.js
import { createStore } from 'vuex';
import axios from 'axios'; // Importa axios aquí si vas a hacer llamadas API en las acciones

const API_BASE_URL = 'http://localhost:8081'; // Define la URL base de tu API aquí

const store = createStore({
  state: {
    isAuthenticated: false,
    userId: null, // <--- AÑADE ESTO: Propiedad para almacenar el ID del usuario
    // ... otras propiedades de estado
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
    setUserId(state, id) { // <--- AÑADE ESTA MUTACIÓN
      state.userId = id;
      // console.log('Mutación setUserId llamada con ID:', id); // Para depuración
    },
    clearAuthData(state) { // <--- Opcional: mutación para limpiar datos al cerrar sesión
      state.isAuthenticated = false;
      state.userId = null;
    }
  },
  actions: {
    // Esta acción manejará la lógica de login real con tu backend
    async login({ commit }, credentials) { // 'credentials' contendrá { email, password }
      try {
        const response = await axios.post(`/api/auth/login`, credentials);

        // ASUMIENDO que tu API de login devuelve un objeto de usuario
        // con el userId tras un login exitoso.
        // Si tu API devuelve un token JWT y el userId está dentro del token,
        // necesitarás decodificar el token para obtener el userId.
        // Por ahora, asumimos que response.data contiene el userId directamente
        // o dentro de un objeto como { userId: ..., token: ... }
        if (response.data && response.data.userId) { // Asegúrate que 'userId' sea la propiedad correcta de tu respuesta
          commit('setAuthenticated', true);
          commit('setUserId', response.data.userId); // Guarda el userId
          // Aquí también podrías guardar el token JWT si tu API lo devuelve
          // localStorage.setItem('userToken', response.data.token);
          console.log('Login exitoso en el store. ID:', response.data.userId);
          return true; // Indica que el login fue exitoso
        } else {
          // Esto puede ocurrir si el login es 200 OK pero no se recibe el userId esperado
          console.warn('Login exitoso, pero userId no se encontró en la respuesta del servidor.');
          // Aún así, podemos considerar autenticado si el status es 200
          commit('setAuthenticated', true);
          return true;
        }

      } catch (error) {
        console.error('Error durante la acción de login:', error.response ? error.response.data : error.message);
        commit('setAuthenticated', false); // Asegúrate de que no esté autenticado
        commit('setUserId', null); // Asegúrate de limpiar el userId
        throw error; // Propaga el error para que el componente pueda manejarlo
      }
    },
    logout({ commit }) {
      // Limpia cualquier token o dato de sesión del localStorage también
      // localStorage.removeItem('userToken');
      commit('clearAuthData()); // Llama a la nueva mutación para limpiar todo'); // Limpia el estado
      console.log('Usuario desautenticado!');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getUserId: state => state.userId, // <--- AÑADE ESTE GETTER para acceder al userId
  },
});

export default store;