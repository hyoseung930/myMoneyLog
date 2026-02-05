import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/year',
    name: 'Year',
    component: () => import('../views/YearView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/month',
    name: 'Month',
    component: () => import('../views/MonthView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/day',
    name: 'Day',
    component: () => import('../views/DayView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.path === '/login') {
    authStore.logout()
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
