import type { ResponseData } from '@/types/apis/role'
import type {
  AddTeacherParams,
  SelectTeacherPageParams,
  UpdateTeacherParams,
} from '@/types/apis/teacher'
import request from '@/utils/request'

const MODEL_BASE_URL = '/user/teacher'
const API = {
  PAGE: `${MODEL_BASE_URL}/page`,
  USER: `${MODEL_BASE_URL}/user`,
}
/**
 * 教师分页
 * @param data
 * @returns {*}
 */
export function teacherListApi(data: SelectTeacherPageParams): Promise<ResponseData> {
  return request({
    url: API.PAGE,
    params: data,
    method: 'get',
  })
}

/**
 * 教师详情
 * @param teacherName
 * @returns {*}
 */
export function getTeacher(teacherName: string): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/${teacherName}`,
    method: 'get',
  })
}

/**
 * 教师添加
 * @param teacher
 * @returns {*}
 */
export function addTeacher(data: AddTeacherParams): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/`,
    method: 'post',
    data,
  })
}

/**
 * 教师修改
 * @returns {*}
 * @param data
 */
export function updateTeacher(data: UpdateTeacherParams): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/`,
    method: 'put',
    data,
  })
}

/**
 * 教师删除
 * @param id
 * @returns {*}
 */
export function deleteTeacher(id: string): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/${id}`,
    method: 'delete',
  })
}
/**
 * 根据token获取信息
 * @returns {*}
 */
export function getTokenTeacher(): Promise<ResponseData> {
  return request({
    url: API.USER,
    method: 'get',
  })
}
