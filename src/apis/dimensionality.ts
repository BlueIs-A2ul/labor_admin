import type {
  Bind_2Params,
  BindParams,
  DimensionalityPageType,
  Save_6Params,
  Update_5Params,
} from '@/types/apis/dimensionality'
import type { ResponseData } from '@/types/apis/role'
import request from '@/utils/request'
const MODEL_BASE_URL = '/curriculum/dimensionality'
const API = {
  page: `${MODEL_BASE_URL}/page`,
  detail: `${MODEL_BASE_URL}/`,
  create: `${MODEL_BASE_URL}`,
  delete: `${MODEL_BASE_URL}/`,
  update: `${MODEL_BASE_URL}`,
  topic: `${MODEL_BASE_URL}/topic`,
  topicCorpus: '/curriculum/topic/word',
  deleteCorpus: '/curriculum/topic/word/unbind',
}

/**
 * 获取维度列表
 * @param {*} param0 分页参数
 * @returns
 */
export function dimensionalityListApi({
  page,
  pageSize,
  key,
  category,
}: DimensionalityPageType): Promise<ResponseData> {
  return request.get(API.page, {
    params: { page, pageSize, key, category },
  })
}

/**
 * 创建维度
 * @param {*} param0
 * @returns
 */
export function createDimensionalityApi({
  name,
  scale,
  category,
}: Save_6Params): Promise<ResponseData> {
  return request.post(API.create, { name, scale, category })
}

/**
 * 更新维度
 * @param {*} param0
 * @returns
 */
export function updateDimensionalityApi(data: Update_5Params): Promise<ResponseData> {
  return request.put(API.update, data)
}

/**
 * 删除维度
 * @param {*} id
 * @returns
 */
export function deleteDimensionalityApi(id: string): Promise<ResponseData> {
  return request.delete(API.detail + id)
}

/**
 * 获取维度详情
 * @param {*} id
 * @returns
 */
export function getDimensionalityDetailApi(id: string): Promise<ResponseData> {
  return request.get(API.detail + id)
}

/**
 * -------------------------- 评价维度下的评价主题
 */

/**
 * 获取维度评价主题列表
 * @param {*} dimensionalityId
 * @param {*} param1
 * @returns
 */
export function getDimensionalityTopicList(
  dimensionalityId: string,
  {
    pageNum,
    pageSize,
    state,
  }: {
    pageNum: string
    pageSize: string
    state: string
  },
): Promise<ResponseData> {
  return request.get(API.topic + `/get/${dimensionalityId}`, {
    params: { pageNum, pageSize, state },
  })
}

/**
 * 创建维度评价主体并绑定
 * @param {*} dimensionalityId
 * @param {*} data
 * @returns
 */
export function createDimensionalityTopic(
  dimensionalityId: string,
  data: Bind_2Params,
): Promise<ResponseData> {
  return request.post(API.topic + '/bind', data, {
    params: { dimensionalityId },
  })
}

/**
 * 更改评价主题启用状态
 * @param {*} param0
 * @returns
 */
export function changeDimensionalityTopicState({
  dimensionalityId,
  topicId,
  state,
}: {
  dimensionalityId: string
  topicId: string
  state: string
}): Promise<ResponseData> {
  return request.patch(
    API.topic,
    {},
    {
      params: { dimensionalityId, topicId, state },
    },
  )
}

/**
 * @description 创建学生评级语料并绑定topic
 * @param {*} topicId
 * @param {*} data
 * @returns
 */
export function createTopicCorpus(
  topicId: string,
  { content, type, state }: BindParams,
): Promise<ResponseData> {
  return request.post(API.topicCorpus + '/bind', { content, type, state }, { params: { topicId } })
}

/**
 * @description 分页查询学生评价主题语料
 * @param {*} topicId
 * @param {*} param1
 * @returns
 */
export function getTopicCorpusPage(
  topicId: string,
  {
    pageNum,
    pageSize,
    state,
    type,
  }: {
    pageNum: string
    pageSize: string
    state: string
    type: string
  },
): Promise<ResponseData> {
  return request.get(API.topicCorpus + `/get/${topicId}`, {
    params: { pageNum, pageSize, state, type },
  })
}

/**
 * @description 修改学生语料启用状态
 * @param {*} param0
 * @returns
 */
export function changeTopicCorpusState({
  topicId,
  wordId,
  state,
}: {
  topicId: string
  wordId: string
  state: string
}): Promise<ResponseData> {
  return request.patch(
    API.topicCorpus,
    {},
    {
      params: { topicId, wordId, state },
    },
  )
}

/**
 * @description 解除绑定
 * @param {*} param0
 * @returns
 */
export function deleteTopicCorpusApi(topicId: string, wordId: string) {
  return request.get(API.deleteCorpus, { params: { topicId, wordId } })
}
