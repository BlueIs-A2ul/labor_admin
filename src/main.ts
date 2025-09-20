import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/index.scss'
import App from './App.vue'
import router from './router'

import '@/permissions'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
