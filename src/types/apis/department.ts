export interface CreateDepartmentParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  departmentName?: string
  departmentCover?: string
  alias?: Record<string, unknown>[]
}

export interface CreateDepartmentRes {
  success: boolean
  message: string
  code: number
  data: Record<string, unknown>
}

export interface PageDepartmentRes {
  success: boolean
  message: string
  code: number
  data: Record<string, unknown>
}

export interface UpdateDepartmentParams extends CreateDepartmentParams {}

export interface UpdateDepartmentRes extends CreateDepartmentRes {}

export interface DepartmentListType {
  alias: string | null
  createBy: string | null
  departmentCover: string | null
  departmentName: string
  gmtCreate: string
  gmtModified: string
  id: string
  isDeleted: number
  updateBy: string | null
}

export interface MajorItemParams {
  classes: string
  createBy: string
  departmentId: string
  department: string
  gmtCreate: string
  gmtModified: string
  id: string
  isDeleted: number
  majorName: string
  updateBy: string
}
