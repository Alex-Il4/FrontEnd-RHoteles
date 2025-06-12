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

async function initApp() {
  // Ensure the store is initialized before mounting the app
  await store.dispatch('initializeAuth'); // <-- Await this action!

  const app = createApp(App);
  app.use(store);
  app.use(router);
  app.mount('#app');
}

initApp();

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

const app = createApp(App);
app.use(router);
app.use(store);
app.use(vuetify);
app.mount('#app');