export interface AddRoleParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  roleName?: string
  roleKey?: string
  permissions?: Record<string, unknown>[]
  permissionNames?: Record<string, unknown>[]
}

export interface UpdateRoleParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  roleName?: string
  roleKey?: string
  permissions?: Record<string, unknown>[]
  permissionNames?: Record<string, unknown>[]
}

// 响应接口
export interface ResponseData {
  success: boolean
  message: string
  code: number
  data: Record<string, unknown>
}
