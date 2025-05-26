import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';
import Carrito from '../views/CarritoView.vue';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: Carrito,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;