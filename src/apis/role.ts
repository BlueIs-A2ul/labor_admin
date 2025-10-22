import request from '@/utils/request'
import { asyncRouterMap, constantRouterMap } from '@/router'
import { deepClone } from '@/utils'
import type { AddRoleParams, ResponseData, UpdateRoleParams } from '@/types/apis/role'

const MODEL_BASE_URL = '/user/role/'
const API = {
  PAGE: `${MODEL_BASE_URL}/page`,
}

const routes = deepClone([...constantRouterMap, ...asyncRouterMap])

/* ------------------------------接口API-------------------------------*/
export function getRoutes() {
  return routes
}

export function getRoles(): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'get',
  })
}

export function addRole(data: AddRoleParams): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'post',
    data,
  })
}

export function updateRole(data: UpdateRoleParams): Promise<ResponseData> {
  return request({
    url: MODEL_BASE_URL,
    method: 'put',
    data,
  })
}

export function deleteRole(id: string): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}${id}`,
    method: 'DELETE',
  })
}

export const rolePageApi = (params: {
  pageNum: string
  pageSize: string
  key: string
}): Promise<ResponseData> => request.get(API.PAGE, { params })

export const permissionTreeApi = () => request.get('/user/permission/')

export const bindRoleApi = (userId: string, roleId: string): Promise<ResponseData> =>
  request.post(`/user/bind/${userId}/${roleId}`)

export const unbindRoleApi = (userId: string, roleId: string): Promise<ResponseData> =>
  request.delete(`/user/unbind/${userId}/${roleId}`)

/* --------------------------非接口API------------------------------*/

/**
 * 过滤权限id
 * @param pId 处理得到的父亲权限信息
 * @param checkedId el-tree返回的源数组
 * @return 过滤结果
 */
function checkAndFilter(pId, checkedId) {
  let cnt = 0
  let temp = []
  const copy = JSON.parse(JSON.stringify(checkedId))
  for (let i = 0; i < pId.length; i++) {
    if (!pId[i].children.length) {
      continue
    }

    copy.forEach((item) => {
      if (pId[i].children.includes(item)) {
        cnt++
        temp.push(item)
      }
    })
    if (!cnt) {
      continue
    } else if (cnt < pId[i].children.length) {
      checkedId.splice(checkedId.indexOf(pId[i].id), 1)
    } else {
      temp.forEach((t) => {
        checkedId.splice(checkedId.indexOf(t), 1)
      })
    }

    // 已经遍历过的数据移出数组
    cnt = 0
    if (temp != []) {
      temp.forEach((t) => {
        copy.splice(copy.indexOf(t), 1)
      })
      temp = []
    }
  }
  return checkedId
}

/**
 * 用于配置角色权限，根据接口要求，需要过滤掉el-tree返回的父级节点
 * 可以直接利用它的props让父子不严格关联，但是我不太想要那种情况下的表现效果
 * @param gottenNodes el-tree返回的被选择的节点数组， 这个数组是一维的
 * @param checkedId el-tree 返回的被选择的初始的id数组，这里面可能存在父子id都在的情况
 * @return 从nodes中提取出的parentId对象数组，每个parent对象含有: 父权限id和其children的id数组
 */
export function filterParentId(gottenNodes, checkedId) {
  let pId = []

  // 1、获取nodes中的所有的parentId和其children的id数组，加入集合
  let nodeKids = []
  for (let i = 0; i < gottenNodes.length; i++) {
    if (gottenNodes[i].hasChildren) {
      nodeKids = store.getters.permissionsFalt
        .find((p) => p.id == gottenNodes[i].id)
        .children.map((child) => {
          return child.id
        })
      pId.push({
        id: gottenNodes[i].id,
        children: nodeKids,
      })
    }

    nodeKids = []
  }
  pId = [...new Set(pId.map((p) => JSON.stringify(p)))].map((ever) => JSON.parse(ever))

  // 2、然后进行过滤，过滤的思想目前是这样:
  //    出于这样的业务需求: 选择了父权限，那么默认拥有其所有子权限
  //                       如果选择了子权限（无children），那么该子权限就是权限树一支的末端，不再传该子权限的父权限
  //    于是得到结论: 当某一父权限被选中，且checkedId中它的子权限数量少于它的children.length，那么舍弃父权限id
  //                                    如果等于children.length，那么舍弃全部子权限，保留父权限

  // 3、遍历pId和初始权限数组，开始过滤
  return checkAndFilter(pId, checkedId)
}
