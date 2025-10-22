import permission from './permission/index' // 权限验证
import debounce from './debounce/index' // 防抖
import outsideClick from './enhanceClick/index'
import type { App, Directive } from 'vue'

interface Directives {
  [key: string]: Directive
}

const myDirectives: Directives = {
  permission,
  debounce,
  outsideClick,
}

export default {
  install(app: App) {
    Object.keys(myDirectives).forEach((key) => {
      app.directive(key, myDirectives[key])
    })
  },
}
