import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/LoginView.vue';
import Carrito from '../views/CarritoView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/carrito',
    name: 'Carrito',
    component: () => import('../views/CarritoView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;