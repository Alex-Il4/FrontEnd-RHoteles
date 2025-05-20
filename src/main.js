import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

// Configuración de la aplicación Vue

// Inicialización de Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: 'mdi',
  },
});

// Creación de la instancia de la aplicación Vue
const app = createApp(App);

// Instalación de plugins
app.use(router); // Habilitar el enrutamiento de la aplicación

// Descomentar y configurar cuando se requiera la gestión del estado global
// import { createStore } from 'vuex';
// const store = createStore({
//   state: {},
//   mutations: {},
//   actions: {},
//   getters: {},
// });
// app.use(store);

app.use(vuetify); // Habilitar Vuetify para el diseño de la interfaz de usuario

// Montaje de la aplicación en el DOM
app.mount('#app');
