export interface SelectTeacherPageParams {
  pageNum?: string
  pageSize?: string
  key?: string
  departmentId?: string
}

export interface AddTeacherParams {
  name?: string
  title?: string
  contact?: Record<string, unknown>
  uid?: number
  sex?: number | string
  departmentId?: number
  password?: string
  userName?: string
  nickname?: string
  avatar?: string
}

export interface UpdateTeacherParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  name?: string
  title?: string
  contact?: Record<string, unknown>
  uid?: number
  sex?: number | string
  departmentId?: number
}
