/* 权限管理接口 */
import request from '@/utils/request'
import type {
  AddPermissionParams,
  PermissionIdParams,
  ParentIdParams,
} from '@/types/apis/permission'
import type { ResponseData } from '@/types/apis/role'
const MODEL_BASE_URL = '/user/permission/'
const API = {
  LAZY_LOAD: `${MODEL_BASE_URL}/lazyLoad`,
}

/**
 * 查询所有权限(树形权限,用于权限配置时选择)
 * @returns {AxiosPromise}
 */
export function getAllPermissions(): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'GET',
  })
}

export function addPermission(data: AddPermissionParams): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'POST',
    data,
  })
}

export function deletePermission(id: PermissionIdParams): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/${id}`,
    method: 'DELETE',
  })
}

export function getChildrenList(parentId: ParentIdParams): Promise<ResponseData> {
  return request({
    url: `${API.LAZY_LOAD}/${parentId}`,
    method: 'GET',
  })
}

export function updatePermission(data: AddPermissionParams): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'PUT',
    data,
  })
}

export function getPermissionById(id: PermissionIdParams): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}${id}`,
    method: 'GET',
  })
}

/** ********权限控制等页面的操作相关API ***********/

/**
 * 设置权限关键字并判断是否有子级权限, 使用递归完成，如果后续嵌套太深了，那么算法需要优化
 * @param arr 传入的需要处理的数组或对象
 * @return 传入对象返回对象，传入数组返回数组
 * */
export function getKeyName<T extends Record<string, any>>(arr: T | T[]): T | T[] {
  const res = Array.isArray(arr) ? arr : new Array(arr)
  res.forEach((item, index) => {
    ;(res[index] as any)['key'] = getKey(item.keyName)

    if (res[index].children && res[index].children.length) {
      return getKeyName(res[index].children)
    } else {
      return
    }
  })
  return Array.isArray(arr) ? res : res[0]
}

/**
 *
 * @param keyName 后台传来的keyName
 * @retrun 处理得到结果: add、 modify、 get、 del
 */
//TODO 这到底啥类型
function getKey(keyName: string | string[]) {
  keyName = keyName.split(/\./)

  return keyName[keyName.length - 1]
}
