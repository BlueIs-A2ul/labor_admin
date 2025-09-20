/**
 * 权限模型接口定义
 */
export interface Permission {
  gmtCreate: string
  gmtModified: string
  createBy: string
  updateBy: string
  isDeleted: number
  id: number
  permissionName: string
  keyName: string
  path: string
  perms: string
  component: string
  parentId: number
  icon: string
  hasChildren: boolean
  children: Permission[]
}

export interface NodePermission {
  id: number
  type: string
  name: string
  key: string
}

/**
 * 添加权限参数接口
 */
export interface AddPermissionParams extends Omit<Permission, 'id'> {
  id?: number
}

/**
 * 权限ID参数接口
 */
export type PermissionIdParams = {
  id: number | string
}

/**
 * 父级ID参数接口
 */
export type ParentIdParams = {
  parentId: number | string
}
