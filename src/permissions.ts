import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { getToken } from './utils/auth'
import getPageTitle from './utils/getPageTitle'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useUserStore } from './stores/user'
import { usePermissionStore } from './stores/permission'
import { useSemesterStore } from './stores/semester'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login', '/404']

router.beforeEach(
  async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const permissionStore = usePermissionStore()
    const userStore = useUserStore()
    const semesterStore = useSemesterStore()
    NProgress.start()
    document.title = getPageTitle(to.meta.title as string)
    const token = getToken()
    if (token) {
      if (to.path === '/login') {
        next('/')
        NProgress.done()
      } else {
        const hasRoles: boolean = userStore.roles && userStore.roles.length > 0
        if (hasRoles) {
          if (to.path !== '/') {
            next()
          } else {
            next('/404')
          }

          // TODO 优化逻辑
          // 别删 不然用不了
          const roles = await userStore.fetchUserInfo()
          const accessRoutes = await permissionStore.generateRoutes(roles)
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          await semesterStore.getSemesterInfo()
        } else {
          try {
            const roles = await userStore.fetchUserInfo()
            const accessRoutes = await permissionStore.generateRoutes(roles)
            accessRoutes.forEach((route) => {
              router.addRoute(route)
            })
            await semesterStore.getSemesterInfo()

            next({ ...to, replace: true })
            return
          } catch (err) {
            await permissionStore.clearMap()
            await userStore.resetToken()
            ElMessage.error({
              message: err instanceof Error ? err.message : '登录失败',
              type: 'error',
              duration: 5 * 1000,
            })
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        await permissionStore.clearMap()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  },
)

router.afterEach(() => {
  NProgress.done()
})
