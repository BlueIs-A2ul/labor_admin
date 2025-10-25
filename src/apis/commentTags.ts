import type { Update_6Params } from '@/types/apis/commentTags'
import type { ResponseData } from '@/types/apis/role'
import request from '@/utils/request'
const MODEL_BASE_URL = '/curriculum/courseEvaluate/topic'
const API = {
  page: `${MODEL_BASE_URL}/`,
  detail: `${MODEL_BASE_URL}/`,
  create: `${MODEL_BASE_URL}`,
  delete: `${MODEL_BASE_URL}/`,
  update: `${MODEL_BASE_URL}`,
}

/**
 * 获取评价tag列表
 * @param {*} param0 分页参数
 * @returns
 */
export function commentTagsListApi({
  page,
  pageSize,
  state = '1',
}: {
  page: string
  pageSize: string
  state?: string
}): Promise<ResponseData> {
  return request.get('/curriculum/dimensionality/topic/complain', {
    params: { page, pageSize, state },
  })
}

/**
 * 创建评价tag
 * @param {*} param0
 * @returns
 */
export function createCommentTagApi({
  name,
  description,
}: {
  name: string
  description: string
}): Promise<ResponseData> {
  return request.post(API.create, { name, description })
}

/**
 * 更新评价tag
 * @param {*} param0
 * @returns
 */
export function updateCommentTagApi(data: Update_6Params): Promise<ResponseData> {
  return request.put(API.update, data)
}

/**
 * 删除评价tag
 * @param {*} id
 * @returns
 */
export function deleteCommentTagApi(id: string): Promise<ResponseData> {
  return request.delete(API.detail + id)
}

/**
 * 获取评价tag详情
 * @param {*} id
 * @returns
 */
export function getCommentTagDetailApi(id: string): Promise<ResponseData> {
  return request.get(API.detail + id)
}
