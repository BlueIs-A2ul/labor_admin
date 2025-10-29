import request from '@/utils/request'

import type {
  CreateDepartmentParams,
  UpdateDepartmentParams,
  CreateDepartmentRes,
  UpdateDepartmentRes,
  PageDepartmentRes,
} from '@/types/apis/department'
import type { ResponseData } from '@/types/apis/role'

const MODEL_BASE_URL = '/user/department'
const API = {
  PAGE: `${MODEL_BASE_URL}/page`,
}
export default {
  /**
   * 创建学院
   * @param {Object} data, 新建学院的对象, 有以下属性: departmentName 学院名, departmentCover 封面图 url
   * @returns
   */
  async createDepartment(data: CreateDepartmentParams): Promise<CreateDepartmentRes> {
    return await request({
      url: MODEL_BASE_URL,
      method: 'POST',
      data,
    })
  },

  /**
   * 更新学院信息
   * @param {Object} data 学院更新信息, 有以下属性:  departmentName 学院名, departmentCover 封面图
   * @returns
   */
  async updateDepartment(data: UpdateDepartmentParams): Promise<UpdateDepartmentRes> {
    return await request({
      url: MODEL_BASE_URL,
      method: 'PUT',
      data,
    })
  },

  /**
   * 删除学院
   * @param {Number} id 被删除学院的id
   * @returns
   */
  async deleteDepartment(id: number): Promise<ResponseData> {
    return await request({
      url: `${MODEL_BASE_URL}/${id}`,
      method: 'DELETE',
    })
  },

  /**
   * 条件分页查询学院列表, 实际上没必要分页查询, 所以size给大点一次拿完就行了
   * @param {*} key
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns
   */
  async getDepartmentList(
    key: string,
    pageNum: number,
    pageSize: number = 1000,
  ): Promise<PageDepartmentRes> {
    return await request({
      url: API.PAGE,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        key,
        pageNum,
        pageSize,
      },
    })
  },
}
