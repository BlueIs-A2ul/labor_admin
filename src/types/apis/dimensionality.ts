export interface DimensionalityPageType {
  page: string
  pageSize: string
  key: string
  category: string
}

export interface Save_6Params {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  name?: string
  scale?: Record<string, unknown>
  category?: string
}

export interface Update_5Params {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  name?: string
  scale?: Record<string, unknown>
  category?: string
}

export interface GetDimensionalityTopicListParams {
  dimensionalityId: string
  pageNum: string
  pageSize: string
  state: string
}

export interface Bind_2Params {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  name?: string
  description?: string
  icon?: string
}

export interface BindParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  content?: string
  type?: number
  state?: number
}
