import type { APIResponseType } from '@/types/apis/commonApi'
import type { PageWordParams, SaveWordParams, UpdateWordParams } from '@/types/apis/word'
import request from '@/utils/request'
const MODEL_BASE_URL = '/curriculum/word'

const API = {
  UPLOAD: `${MODEL_BASE_URL}/upload`,
  PAGE: `${MODEL_BASE_URL}/page`,
  DOWNLOAD: '/user/student/template/download',
  WORD_CLOUD: `${MODEL_BASE_URL}/cloud`,
  WORD_CLOUD_CONDITION: `${MODEL_BASE_URL}/frequency/condition`,
}
/**
 * 新增
 * @param {object} word Word
 * @param {string} word.word
 * @param {number} word.level
 * @param {number} word.typeId
 * @param {number} word.partOfSpeech 可用值:未知,名词,动词,形容词,副词
 * @returns
 */
export function saveWord(word: SaveWordParams): Promise<APIResponseType> {
  return request.post(MODEL_BASE_URL, word)
}
/**
 * 更新
 * @param {object} word Word
 * @param {string} word.word
 * @param {number} word.level
 * @param {number} word.typeId
 * @param {number} word.partOfSpeech 可用值:未知,名词,动词,形容词,副词
 * @returns
 */
export function updateWord(word: UpdateWordParams): Promise<APIResponseType> {
  return request.put(MODEL_BASE_URL, word)
}
/**
 * 词汇导入
 * @param {Blob} file
 * @returns
 */
export function uploadWord(file: string): Promise<APIResponseType> {
  const fd = new FormData()
  fd.append('file', file)
  return request({
    url: API.UPLOAD,
    method: 'POST',
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
/**
 * id查询
 * @param {string} id 主键
 * @returns
 */
export function getWord(id: string): Promise<APIResponseType> {
  return request.get(`${MODEL_BASE_URL}/${id}`)
}
/**
 * 词汇分页查询
 * @param {string}  params.page
 * @param {string}  params.pageSize
 * @param {string?}  params.level
 * @param {string?}  params.typeId
 * @param {string?}  params.partOfSpeech 表示词性(名词动词介词)参考:1名词,2动词,3形容词,4副词
 * @param {string?}  params.withDate 是否带上一些公共字段
 * @param {string?}  params.key
 * @returns
 */
export async function wordPage(params: PageWordParams): Promise<APIResponseType> {
  return await request({
    url: API.PAGE,
    method: 'GET',
    params,
  })
}
/**
 * 删除
 * @param {string} id 主键
 * @returns
 */
export function deleteWord(id: string): Promise<APIResponseType> {
  return request.delete(`${MODEL_BASE_URL}/${id}`)
}
/**
 * 导入模板获取
 * @returns
 */
export function downloadUploadTemplate(): Promise<APIResponseType> {
  return request({
    url: API.DOWNLOAD,
    method: 'GET',
    responseType: 'blob',
  })
}
/**
 * 词云
 * @param {number} limit 条数
 */
export function wordCloud(limit: string): Promise<APIResponseType> {
  return request.get(`${API.WORD_CLOUD}`, { params: { limit } })
}
/**
 * 条件查询词云
 * @param {string} origin
 * @param {string} semesterId
 * @param {string} departmentId
 * @param {string} majorId
 * @param {string} classId
 * @param {string} courseId
 * @param {string} limit
 * @returns
 */
export function wordCloudCondition(
  origin: string | null,
  semesterId: string | null,
  departmentId: string | null,
  majorId?: string | null,
  classId?: string | null,
  courseId?: string | null,
  limit?: string | null,
): Promise<APIResponseType> {
  return request({
    url: API.WORD_CLOUD_CONDITION,
    method: 'GET',
    params: {
      origin,
      semesterId,
      departmentId,
      majorId,
      classId,
      courseId,
      limit,
    },
  })
}
