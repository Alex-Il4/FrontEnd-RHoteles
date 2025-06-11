// src/store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    isAuthenticated: false,
  },
  mutations: {
    setAuthenticated(state, status) {
      state.isAuthenticated = status;
    },
  },
  actions: {
    login({ commit }) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('setAuthenticated', true);
          console.log('Usuario autenticado!');
          resolve(true);
        }, 1000);
      });
    },
    logout({ commit }) {
      commit('setAuthenticated', false);
      console.log('Usuario desautenticado!');
    },
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
  },
});

export default store;