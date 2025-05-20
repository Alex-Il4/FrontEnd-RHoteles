import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import Login from '../views/LoginView.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;