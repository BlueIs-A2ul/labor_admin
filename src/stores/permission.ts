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

export const usePermissionStore = defineStore('permission', () => {
  const hasPermission = (roles: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.roles) {
      return roles.some((v) => route.meta.roles.indexOf(v) >= 0)
    }
    return true
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

  const flattenPermissions = () => {
    const pTree = JSON.parse(JSON.stringify(permissionsTree.value))
    permissionsFlat.value = flatten(pTree)
  }

  const generateRoutes = async (roles: []) => {
    let userRoutes = []
    if (roles.indexOf('router') >= 0) {
      userRoutes = asyncRouterMap
    } else {
      userRoutes = asyncRouterMap.filter((route) => {
        if (hasPermission(roles, route)) {
          if (route.children && route.children.length > 0) {
            route.children = route.children.filter((childRoute) => {
              return hasPermission(roles, childRoute)
            })
            return route
          } else {
            return route
          }
        }
        return false
      })
    }
    const accessRoutes = userRoutes
    addRoutes.value = accessRoutes
    routes.value = [...constantRouterMap, ...(routes.value as RouteRecordRaw[])]
    return accessRoutes
  }

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
      //TODO 这里类型有点诡异
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
})
