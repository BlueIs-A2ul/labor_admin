import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  deepDeleteChild,
  deepInsertChild,
  deepSearchChild,
  deepUpdateChild,
  flatten,
} from '@/apis/common'
import { asyncRouterMap, constantRouterMap } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import type { Permission, NodePermission, AddPermissionParams } from '@/types/apis/permission'
import {
  deletePermission,
  getKeyName,
  addPermission as addPermissionApi,
  updatePermission,
  getAllPermissions,
} from '@/apis/permissionCtrl'
import { ElMessage } from 'element-plus'

export const usePermissionStore = defineStore(
  'permission',
  () => {
    const hasPermission = (roles: string[], route: RouteRecordRaw) => {
      if (!route.meta?.roles) return true
      return roles.some((role) => route.meta!.roles!.includes(role))
    }

    const routes = ref<RouteRecordRaw[]>([])
    const addRoutes = ref<RouteRecordRaw[]>([])
    const permissionsTree = ref<Permission[]>([])
    const newRootPermission = ref<NodePermission[]>([
      { id: 1, type: 'info', name: 'ALL', key: '*' },
      { id: 2, type: 'primary', name: '增加', key: 'add' },
      { id: 3, type: 'danger', name: '删除', key: 'del' },
      { id: 4, type: 'success', name: '查找', key: 'get' },
      { id: 5, type: 'warning', name: '修改', key: 'modify' },
    ])
    const permissionsFlat = ref<Permission[]>([])
    const permissionFnAllowMap = new Map<string, boolean>()

    const addPermissions = async (p: Permission) => {
      p = getKeyName(p)
      if (p.parentId === 0) {
        permissionsTree.value.push(p)
      } else {
        permissionsTree.value = deepInsertChild(permissionsTree.value, p, p.parentId)
      }
    }

    const initPermissions = async (permissions: Permission[]) => {
      permissions.forEach((el, index) => {
        permissions[index].hasChildren = el.children.length > 0
      })
      permissionsTree.value = permissions
    }

    const flattenPermissions = async () => {
      const pTree = JSON.parse(JSON.stringify(permissionsTree.value))
      permissionsFlat.value = flatten(pTree)
    }

    const generateRoutes = async (roles: string[]) => {
      let userRoutes = []

      // 检查是否是超级管理员（拥有所有权限）
      const isAdmin = roles.includes('admin') // 假设 admin 是超级管理员角色

      if (isAdmin) {
        // 超级管理员拥有所有路由权限
        userRoutes = deepCloneRoutes(asyncRouterMap) // 深拷贝避免修改原始数据
      } else {
        // 普通用户根据角色过滤路由
        userRoutes = filterAsyncRoutes(asyncRouterMap, roles)
      }

      const accessRoutes = userRoutes
      addRoutes.value = accessRoutes
      routes.value = [...constantRouterMap, ...userRoutes]
      return accessRoutes
    }

    // 深拷贝路由配置，避免修改原始数据
    function deepCloneRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
      return JSON.parse(JSON.stringify(routes))
    }

    function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
      const res: RouteRecordRaw[] = []

      routes.forEach((route) => {
        const tmp = { ...route }

        if (hasPermission(roles, tmp)) {
          if (tmp.children) {
            tmp.children = filterAsyncRoutes(tmp.children, roles)
          }
          res.push(tmp)
        }
      })

      return res
    }

    // const generateRoutes = async (roles: []) => {
    //   let userRoutes = []
    //   if ((roles as string[]).indexOf('router') >= 0) {
    //     userRoutes = asyncRouterMap
    //   } else {
    //     userRoutes = asyncRouterMap.filter((route) => {
    //       if (hasPermission(roles, route)) {
    //         if (route.children && route.children.length > 0) {
    //           route.children = route.children.filter((childRoute: RouteRecordRaw) => {
    //             return hasPermission(roles, childRoute)
    //           })
    //           return route
    //         } else {
    //           return route
    //         }
    //       }
    //       return false
    //     })
    //   }
    //   const accessRoutes = userRoutes
    //   addRoutes.value = accessRoutes
    //   //routes.value = [...constantRouterMap, ...(routes.value as RouteRecordRaw[])]
    //   routes.value = [...constantRouterMap, ...userRoutes]
    //   return accessRoutes
    // }

    //const generateRoutes = async (roles) => {}

    const deleteP = async (id: number | string) => {
      try {
        const res = await deletePermission({ id })
        if (res.code === 200) {
          permissionsTree.value = deepDeleteChild(permissionsTree.value, id)
          ElMessage.success({
            message: '删除权限成功',
            duration: 3000,
          })
        }
      } catch (e) {
        ElMessage.error({
          message: `删除权限失败=>${e}`,
          duration: 3000,
        })
      }
    }

    const addPermission = async (p: Permission) => {
      const flag = deepSearchChild(permissionsTree.value, p.parentId, p.permissionName, p.keyName)
      if (flag) {
        ElMessage.error({
          message: '权限已存在',
          duration: 3000,
        })
        return flag
      } else {
        const res = await addPermissionApi(p)
        if (!res) {
          console.log('添加权限失败', res)
        } else if (res.code === 200) {
          addPermissions(p)
          ElMessage.success({
            message: '添加权限成功',
            duration: 3000,
          })
          return true
        }
      }
    }

    const modifyPermission = async (modified: AddPermissionParams) => {
      try {
        const res = await updatePermission(modified)
        if (res.code === 200) {
          modified = getKeyName(modified) as AddPermissionParams
          permissionsTree.value = deepUpdateChild(permissionsTree.value, modified as Permission)
          return true
        }
      } catch (error) {
        console.log('修改权限失败', error)
      }
    }

    const initPermissionList = async () => {
      const res = await getAllPermissions()
      let { data } = res
      data = getKeyName(data)
      if (data.length) {
        await initPermissions(data)
        await flattenPermissions()
        return permissionsFlat.value
      }
      return []
    }

    const setMethodsAllowStatus = async (data: { fn: string; needExecute: boolean }) => {
      const { fn, needExecute } = data
      permissionFnAllowMap.set(fn, needExecute)
    }

    const getMethodsAllowStatus = async (fn: string) => {
      const res = permissionFnAllowMap.get(fn)
      return res === null ? false : res
    }

    const clearMap = async () => {
      permissionFnAllowMap.clear()
      return true
    }

    return {
      routes,
      newRootPermission,
      flattenPermissions,
      generateRoutes,
      deleteP,
      addPermission,
      modifyPermission,
      initPermissionList,
      setMethodsAllowStatus,
      getMethodsAllowStatus,
      clearMap,
    }
  },
  {
    persist: true,
  },
)

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}
