import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth-new'

console.log('[NEW ROUTER MODULE] Loading...')

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

console.log('[NEW ROUTER] Creating router...')

const router = createRouter({
  history: createWebHistory(),
  routes
})

console.log('[NEW ROUTER] Registering beforeEach guard...')

router.beforeEach((to, from, next) => {
  // 백엔드 없이 개발 중이므로 인증 체크 비활성화
  next()
  
  /* 백엔드 연동 시 주석 해제
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
  */
})

console.log('[NEW ROUTER] Exported')

export default router
