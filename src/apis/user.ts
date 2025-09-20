import request from '@/utils/request'

const MODEL_BASE_URL = 'user'
const API = {
  LOGIN: `${MODEL_BASE_URL}/login`,
  INFO: `${MODEL_BASE_URL}/info`,
  LOGOUT: `${MODEL_BASE_URL}/logout`,
  PAGE: `${MODEL_BASE_URL}/page`,
  BIND: `${MODEL_BASE_URL}/bind`,
  UNBIND: `${MODEL_BASE_URL}/unbind`,
  ADD: `${MODEL_BASE_URL}/teacher`,
}

import type { LoginParams, PageParams, UserModel } from '@/types/apis/user'
export function login(data: LoginParams) {
  return request({
    url: API.LOGIN,
    method: 'post',
    data,
  })
}

//TODO: 我也不知道类型
export function getInfo(token: string) {
  return request({
    url: API.INFO,
    method: 'get',
    params: { token },
  })
}

export function logout() {
  return request({
    url: API.LOGOUT,
    method: 'get',
  })
}

export function userPageApi({ pageNum, pageSize, key, type, withRole }: PageParams) {
  if (!key) {
    key = null
  }
  return request({
    url: API.PAGE,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      pageNum,
      pageSize,
      key,
      type,
      withRole,
    },
  })
}

export function addUser(data: UserModel) {
  return request({
    url: MODEL_BASE_URL,
    method: 'post',
    data,
  })
}

export function updateUser(data: UserModel) {
  return request({
    url: MODEL_BASE_URL,
    method: 'put',
    data,
  })
}

export function deleteUser(userId: string) {
  return request({
    url: `/${MODEL_BASE_URL}/${userId}`,
    method: 'delete',
  })
}
export function userList({ pageNum, pageSize, key, type }: PageParams) {
  return request({
    url: API.PAGE,
    method: 'get',
    params: {
      pageNum,
      pageSize,
      key,
      type,
    },
  })
}
//TODO: 我也不知道是number还是string 先写string
export const bindRoleApi = (userId: string, roleId: string) =>
  request.post(`${API.BIND}/${userId}/${roleId}`)

export const unbindRoleApi = (userId: string, roleId: string) =>
  request.delete(`${API.UNBIND}/${userId}/${roleId}`)

/**
 * 重置密码(后台)
 * @param {string} uid
 * @param {string} password
 * @returns
 */
export function resetPassword(uid: string, password: string) {
  return request.post(`/user/resetPassword`, null, {
    params: { uid, password },
  })
}
