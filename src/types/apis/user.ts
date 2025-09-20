export interface LoginParams {
  username: string
  password: string
}

export interface PageParams {
  pageNum: number
  pageSize: number
  key?: string | null
  type?: string
  withRole?: boolean
}

export interface UserModel {
  gmtCreate: string | null
  gmtModified: string | null
  createBy: string | null
  updateBy: string | null
  isDeleted: number
  id: number
  password: string
  userName: string
  type: number
  nickname: string
  avatar: string
  roleNames: string[]
  roleIds: (number | string)[]
}
