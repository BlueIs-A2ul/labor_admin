import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_VUE_APP_BASE_API,
  timeout: 20 * 1000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['swpu_token'] = getToken()
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const userStore = useUserStore()

    if (response.config.responseType === 'blob') {
      return response
    }
    const res = response.data
    if (res.code && res.code !== 200) {
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        ElMessageBox.confirm('您已注销, 您可以选择继续留在此页面, 或者重新登录', '退出登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          userStore.resetToken().then(() => {
            location.reload()
          })
        })
      } else if (res.code == 100) {
        ElMessage.error('此次登录已过期, 请重新登录')
        router.push({ path: '/login?redirect=/login' })
      } else if (res.code == 403) {
        ElMessage({
          type: 'warning',
          message: '没有操作权限',
          duration: 2 * 1000,
        })
      } else if (res.code == 555) {
        ElMessage.error({
          message: '用户名或密码错误，请重新输入',
          type: 'error',
          duration: 2 * 1000,
        })
      } else if (
        res.code == 250 &&
        response.request.responseURL == import.meta.env.VUE_APP_BASE_API + '/user/student/excel'
      ) {
        ElMessage.error(res.message || '服务器异常')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error', // 注意这里小写的 'error'
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  },
)

export default service
