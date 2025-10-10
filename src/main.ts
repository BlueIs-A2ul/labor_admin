import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerSvgIcon from './icons/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'echarts-wordcloud'

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

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
