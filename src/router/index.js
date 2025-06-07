import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';
import Carrito from '../views/CarritoView.vue';
import NewAccount from '../views/NewAccountView.vue';

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
  },
  {
    path: '/new-account',
    name: 'new-account',
    component: NewAccount,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;