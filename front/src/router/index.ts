import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth-new'

console.log('[Router Module] ===== LOADED =====', new Date().toISOString())

const routes: RouteRecordRaw[] = [
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

console.log('[Router] ===== REGISTERING beforeEach =====')

router.beforeEach((to, from, next) => {
  console.log('[Router beforeEach] ===== TRIGGERED =====')
  console.log('[Router beforeEach] From:', from.path, 'To:', to.path, 'Meta:', to.meta)
  const authStore = useAuthStore()
  console.log('[Router beforeEach] isAuthenticated:', authStore.isAuthenticated)
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router beforeEach] ===== REDIRECT TO LOGIN =====')
    next('/login')
    return
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('[Router beforeEach] ===== REDIRECT TO DASHBOARD =====')
    next('/')
    return
  }
  
  console.log('[Router beforeEach] ===== PROCEED =====')
  next()
})

router.afterEach((to, from) => {
  console.log('[Router afterEach] From:', from.path, 'To:', to.path)
})

console.log('[Router] ===== EXPORT =====')

export default router
