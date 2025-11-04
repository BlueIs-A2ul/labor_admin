import type { ResponseData } from '@/types/apis/role'
import request from '@/utils/request'
const MODEL_BASE_URL = '/user/major'

const API = {
  PAGE: `${MODEL_BASE_URL}/page`,
}
/**
 * 新增
 * @param {object} major Major
 * @param {number|string} major.departmentId
 * @param {string} major.majorName
 * @returns
 */
export function saveMajor(major: {
  departmentId: string
  majorName: string
}): Promise<ResponseData> {
  return request.post(`${MODEL_BASE_URL}`, major)
}
/**
 * 更新
 * @param {object} major Major
 * @param {number|string} major.id
 * @param {number|string} major.departmentId
 * @param {string} major.majorName
 * @returns
 */
export function updateMajor(major: {
  id: string
  departmentId: string
  majorName: string
}): Promise<ResponseData> {
  return request.put(`${MODEL_BASE_URL}`, major)
}
/**
 * id查询
 * @param {string} id 主键
 * @returns
 */
export function getMajor(id: string): Promise<ResponseData> {
  return request.get(`${MODEL_BASE_URL}/${id}`)
}
/**
 * 删除
 * @param {string} id 主键
 * @returns
 */
export function deleteMajor(id: string): Promise<ResponseData> {
  return request.delete(`${MODEL_BASE_URL}/${id}`)
}

/**
 * 分页查询
 * @returns
 * @param {object} params
 * @param data
 * @param {string|number} params.departmentId
 * @param {string} params.key
 * @param {number} params.page
 * @param {number} params.pageSize
 */
export function majorPage(
  params: {
    departmentId?: string | number
    key?: string
    pageNum: number | string
    pageSize: number | string
  },
  { departmentList = [] }: { departmentList: any[] },
): Promise<ResponseData> {
  return request.post(API.PAGE, [...departmentList], { params })
}
