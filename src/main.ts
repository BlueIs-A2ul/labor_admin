import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerSvgIcon from './icons/index'

import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import '@/permissions'

const pinia = createPinia()
const app = createApp(App)
registerSvgIcon(app)
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

app.mount('#app')
