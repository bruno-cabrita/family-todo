import { createApp } from 'vue'
import { useAuthStore } from './stores/index.ts'
import router from './router.ts'
import pinia from './pinia.ts'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

const auth = useAuthStore()
if (auth.user) {
  auth.setAuthenticatedUser()
    .then(async (res) => {
      if (!res) {
        await auth.logout()
        /* @ts-ignore */
        app.$router.replace({ name: 'auth' })
      }
    })
}
