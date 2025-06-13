// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

// 1. Crea la instancia de Vuetify PRIMERO
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'dark', // Establece el tema oscuro por defecto
    themes: {
      dark: {
        colors: {
          background: '#242424',
          surface: '#182024',
          primary: '#2196F3',
        },
      },
    },
  },
});

// Función asíncrona para inicializar la aplicación
async function initApp() {
  // Asegúrate de que el store se inicialice ANTES de montar la aplicación
  // Esto es crucial para que el estado de autenticación esté listo
  await store.dispatch('initializeAuth'); // <-- ¡Esto es correcto y debe ser esperado!

  const app = createApp(App);

  // 2. Usa todos los plugins (store, router, vuetify) en la misma instancia de la aplicación
  app.use(store);
  app.use(router);
  app.use(vuetify); // Usa la instancia de Vuetify aquí

  // 3. Monta la aplicación UNA SOLA VEZ
  app.mount('#app');
}

// Llama a la función de inicialización
initApp();