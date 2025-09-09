import { createRouter, createWebHistory } from 'vue-router';
import TodoView from '../views/TodoView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodoView,
      meta: { title: 'Daily Planner', requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'default',
      component: TodoView,
      meta: { title: 'Daily Planner', requiresAuth: true }
    },
    {
      path: '/daily-planner',
      name: 'daily-planner',
      component: TodoView,
      meta: { title: 'Daily Planner', requiresAuth: true }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { title: 'Account', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/verify-email/:emailid',
      name: 'verify-email-login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/reset-password/:passwordid',
      name: 'reset-password-login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Login' }
    },
    {
      path: '/forecast',
      name: 'forecast',
      component: () => import('../views/ForecastView.vue'),
      meta: { title: 'Forecast' }
    }
  ],
})

router.beforeEach((to) => {
  const authenticated = localStorage.getItem('isAuthenticated');
  if(to.meta.requiresAuth && authenticated === null) {
    return '/login';
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? String(to.meta.title) : 'Daily Planner';
})

export default router
