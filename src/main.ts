import { createApp } from 'vue'
import { createPinia } from 'pinia'
import registerSvgIcon from './icons/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'echarts-wordcloud'

import '@/styles/index.scss'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import globalDirectives from '@/globalOrder/index'

import '@/permissions'

const pinia = createPinia()
const app = createApp(App)
app.use(globalDirectives)
app.use(ElementPlus, { locale: zhCn })
registerSvgIcon(app)
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

router.isReady().then(() => {
  app.mount('#app')
})
