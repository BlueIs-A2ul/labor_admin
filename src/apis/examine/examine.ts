import type { ResponseData } from '@/types/apis/role'
import request from '@/utils/request'

const MODEL_BASE_URL = '/curriculum/signUp'
const API = {
  PASS: `${MODEL_BASE_URL}/pass`,
  NOT_REVIEWED: `${MODEL_BASE_URL}/notReviewed`,
  CODE: `${MODEL_BASE_URL}/attendance/code`,
  EVALUATE: `${MODEL_BASE_URL}/evaluate`,
  PAGE: `${MODEL_BASE_URL}/log/page`,
}
/**
 * 批量审核
 * @param {*} courseId
 * @param {*} data 数组但不知道什么数组
 * @param {*} choice
 * @returns
 */
export async function examinePass(
  courseId: string,
  data: String[],
  choice: string,
): Promise<ResponseData> {
  return await request({
    // 这里有个问题，如果使用模板字符串拼接，会无法通过预检，baseURL拼不上
    url: API.PASS + '/' + courseId + '/' + choice,
    method: 'POST',
    data,
  })
}

/**
 * 获取待审核课程的列表
 * @returns
 */
export async function getExamineList(): Promise<ResponseData> {
  return await request({
    url: API.NOT_REVIEWED,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 考评
 * @param {object} params EvaluateDTO
 * @param {string} params.evaluate
 * @param {number} params.userId
 * @param {number} params.courseId
 * @param {number} params.score
 * @param {array} params.dimensionalityScore 维度得分
 * @todo 文档给的类型和实践类型不同
 * @returns
 */
export async function evaluate(params, data): Promise<ResponseData> {
  return await request({
    url: API.EVALUATE,
    method: 'POST',
    params,
    data,
  })
}

/**
 * 签到码
 * @param {*} courseId
 * @param {*} code
 * @param {*} time
 * @param {*} force 0不强制覆盖, 获取上次码的信息; 1强制覆盖上次的码
 * @returns res force=1才会重新生成,force=0,会拿到当前的签到码和过期时间,如果不存在,会返回time=-2
 */
export function sendSignCode(
  courseId: string,
  code?: string,
  time = 60 * 30,
  force = 0,
): Promise<ResponseData> {
  return request({
    url: `${API.CODE}/${courseId}/${code}/${time}/${force}`,
    method: 'POST',
  })
}

/**
 * 审核记录分页
 * @param {*} data
 * @returns
 */
export function signUpPage(params: { pageNum: string; pageSize: string; key: string }) {
  return request({
    url: API.PAGE,
    method: 'GET',
    params,
  })
}
