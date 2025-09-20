import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import '@/permissions'

const pinia = createPinia()
const app = createApp(App)
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

app.mount('#app')
