import { defineStore } from 'pinia'
import { login, logout, getInfo } from '@/apis/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { computed, ref } from 'vue'
import type { LoginParams } from '@/types/apis/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken())
  const userId = ref(null)
  const name = ref('')
  const avatar = ref('')
  const departmentId = ref('')
  const departmentName = ref('')
  const roles = ref([])
  const userPermissions = ref([])
  const defaultAvatar = ref(
    'https://guli-fate.oss-cn-chengdu.aliyuncs.com/2023/08/15/3f176dd8-1d87-4707-9033-e557ef824430.png',
  )

  const hasRoles = computed(() => {
    return roles.value.length > 0
  })

  const resetState = () => {
    token.value = getToken()
    userId.value = null
    name.value = ''
    avatar.value = ''
    departmentId.value = ''
    departmentName.value = ''
    roles.value = []
    userPermissions.value = []
  }

  async function userLogin(userInfo: LoginParams) {
    const { username, password } = userInfo
    try {
      const response = await login({
        username: username.trim(),
        password: password,
      })
      const { data } = response
      token.value = data
      setToken(data)
    } catch (error) {
      throw error
    }
  }

  async function fetchUserInfo() {
    try {
      //TODO response.data 类型后端怎么不写
      const response = await getInfo(token.value as string)
      const { data } = response

      if (!data) {
        throw new Error('验证失败,请重新登录')
      }

      const { permissions, userInfo } = data

      if (!permissions || permissions.length <= 0) {
        throw new Error('getInfo:roles must be a non-null array!')
      }

      // 设置用户信息
      name.value = userInfo.nickname
      userId.value = userInfo.userId
      departmentId.value = userInfo.departmentId
      departmentName.value = userInfo.departmentName
      avatar.value = userInfo.avatar

      let auths = JSON.parse(JSON.stringify(permissions))
      auths = auths.filter((item: string) => !item.includes('router'))
      userPermissions.value = auths

      // 获取角色, 生成路由访问权限
      const roleList = permissions.filter((item: string) => item.includes('router'))
      roleList.forEach((p: string, index: number, self: string[]) => {
        if (p != 'router') {
          self[index] = p.split('router.')[1]
        }
      })
      roles.value = JSON.parse(JSON.stringify(roleList))
    } catch (error) {
      throw error
    }
  }

  async function userLogout() {
    try {
      await logout()
      removeToken()
      resetRouter()
      resetState()
    } catch (error) {
      throw error
    }
  }

  const resetToken = async () => {
    removeToken()
    resetState()
  }

  // 必须返回所有需要在组件中使用的状态、计算属性和方法
  return {
    // 状态
    token,
    userId,
    name,
    avatar,
    departmentId,
    departmentName,
    roles,
    userPermissions,
    defaultAvatar,
    // Getters
    hasRoles,
    // Actions
    resetState,
    userLogin,
    fetchUserInfo,
    userLogout,
    resetToken,
  }
})
