import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/LoginView.vue';
import Home from '../views/HomeView.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;