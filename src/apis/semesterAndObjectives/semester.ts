import type { Semester } from '@/types/apis/semester'
import request from '@/utils/request'

const MODEL_BASE_URL = '/curriculum/semester'
const API = {
  NOW: `${MODEL_BASE_URL}/now`,
  PAGE: `${MODEL_BASE_URL}/page`,
  ALL: `${MODEL_BASE_URL}/all`,
}

export function addSemester({
  semesterName,
  start,
  end,
  grade,
  departmentId,
  dimensionalityInfo,
}: Semester) {
  return request({
    url: MODEL_BASE_URL,
    method: 'POST',
    data: { semesterName, start, end, grade, departmentId, dimensionalityInfo },
  })
}

export function modifySemester({
  id,
  semesterName,
  start,
  end,
  grade,
  departmentId,
  dimensionalityInfo,
}: Semester) {
  return request({
    url: MODEL_BASE_URL,
    method: 'PUT',
    data: {
      id,
      semesterName,
      start,
      end,
      grade,
      departmentId,
      dimensionalityInfo,
    },
  })
}

/**
 * 此接口极不安全,完全不建议使用
 * @deprecated 请不要使用此接口
 * @returns {AxiosPromise}
 */
export function getAllSemesters() {
  return request({
    url: API.ALL,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * @param pageNum
 * @param pageSize
 * @param {Array} departmentLimits
 * @returns 条件分页查询的学期的结果
 */
export function searchSemestersPage(pageNum: number, pageSize: number, key: string) {
  return request({
    url: API.PAGE,
    method: 'POST',
    params: { pageNum, pageSize, key },
    data: [],
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
/**
 * 获取学期信息
 * @returns 学期信息
 */
export async function getSemesterNow() {
  return await request({
    url: API.NOW,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function searchSingleSemester(id: number | string) {
  return request({
    url: `${MODEL_BASE_URL}/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function deleteSemester(id: number | string) {
  return request({
    url: `${MODEL_BASE_URL}/${id}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}
