import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index-new'
import App from './App.vue'
import './assets/styles/global.scss'

console.log('[Main] ===== NEW VERSION ===== App initializing...')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

console.log('[Main] Pinia and Router installed')

router.isReady().then(() => {
  console.log('[Main] Router ready, current route:', router.currentRoute.value.path)
  app.mount('#app')
  console.log('[Main] App mounted')
})
