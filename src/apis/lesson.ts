import request from '@/utils/request'
import { getTimeNow } from './common'
import type {
  AddCourseParams,
  DownloadStudentParams,
  LessonItem,
  OneRes,
  SelectCoursePageParams,
  UpdateCourseParams,
} from '@/types/apis/lesson'
import type { APIResponseType } from '@/types/apis/commonApi'
import type { ResponseData } from '@/types/apis/role'
const MODEL_BASE_URL = '/curriculum/course'
const API = {
  DETAIL: `${MODEL_BASE_URL}/detail`,
  STUDENT: `${MODEL_BASE_URL}/student`,
  PAGE: `${MODEL_BASE_URL}/page`,
  JOIN_BATCH: `${MODEL_BASE_URL}/join_batch`,
  BACK: `${MODEL_BASE_URL}/back`,
  WORD_CLOUD: `/curriculum/word/cloud`,
  // 特殊一点点
  SELF_EVALUATION: '/curriculum/selfEvaluation/',
  COURSE_EVALUATE: '/curriculum/courseEvaluate/',
}
export function checkStatus(lessons: LessonItem | LessonItem[]) {
  if (!Array.isArray(lessons)) {
    lessons = new Array(lessons)
  }
  const date = parseInt(getTimeNow().replace(/\D/g, ''))

  let status = ''
  lessons.forEach((item, index) => {
    if (date < parseInt(item.applicationStart.replace(/\D/g, ''))) {
      status = '筹备中'
    } else if (
      date >= parseInt(item.applicationStart.replace(/\D/g, '')) &&
      date < parseInt(item.hostingStart.replace(/\D/g, ''))
    ) {
      status = '报名中'
    } else if (date < parseInt(item.hostingEnd.replace(/\D/g, ''))) {
      status = '进行中'
    } else {
      status = '已结束'
    }
    lessons[index]['status'] = status
  })
  return lessons
}

export function addLesson(data: AddCourseParams) {
  return request({
    url: MODEL_BASE_URL,
    method: 'POST',
    data,
  })
}

export function delLesson(id: string): Promise<ResponseData> {
  return request({
    url: `${MODEL_BASE_URL}/${id}`,
    method: 'DELETE',
  })
}

export function updateLesson(data: UpdateCourseParams) {
  return request({
    url: MODEL_BASE_URL,
    method: 'PATCH',
    data,
  })
}

export function getLessonDetail(id: string): Promise<ResponseData> {
  return request({
    url: `${API.DETAIL}/${id}`,
    method: 'GET',
  })
}

/**
 * 报名者信息
 * passType:-1忽略此字段,0查询未通过的学生,1通过的;
 * evaluateType:-1忽略此字段(会过滤掉没有写自我评价的学生),-2,完全忽略此字段,0未考评,1考评通过
 * @returns
 * @param curriculumId
 * @param pageNum
 * @param pageSize
 * @param passType
 * @param evaluateType
 */
export function getStudentList(
  curriculumId: string,
  pageNum: string,
  pageSize: string,
  passType: string,
  evaluateType: string,
): Promise<APIResponseType> {
  return request({
    url: `${API.STUDENT}/${curriculumId}`,
    params: { pageNum, pageSize, passType, evaluateType },
    method: 'GET',
  })
}

export function getCommentsToUser(courseId: string, page: string, pageSize: string) {
  return request({
    url: API.SELF_EVALUATION,
    params: { courseId, page, pageSize },
    method: 'GET',
  })
}

/**
 * 根据id获取课程评价
 * @param {*} courseId
 * @param {*} page
 * @param {*} pageSize
 * @returns
 */
export function getCommentsToLessons(params: {
  courseId: string
  page: string
  pageSize: string
}): Promise<APIResponseType> {
  return request({
    url: API.COURSE_EVALUATE,
    params,
    method: 'GET',
  })
}

/**
 * 分页查询课程列表
 * @param {string} title
 * @param {string} category
 * @param {number} pageNum
 * @param {number} pageSize
 * @param {string} start         yyyy-mm-dd、yyyy、yyyy-mm
 * @param {string} end           yyyy-mm-dd、yyyy、yyyy-mm
 * @param {number} semesterId    学期Id
 * @param {number} state         0 全部状态， 1筹备中, 2报名中, 3进行中, 4已结束
 * @param {number} reviewed      0:默认查询全部; 1:已经审查, 2:未审查
 * @returns
 */
export function selectCoursePage({
  title,
  category,
  pageNum,
  pageSize,
  start,
  end,
  semesterId,
  departmentLimit,
  gradeLimit,
  state,
  reviewed = 0,
}: SelectCoursePageParams): Promise<APIResponseType> {
  title = title === '' ? undefined : title
  return request({
    url: API.PAGE,
    method: 'POST',
    data: {
      title,
      category,
      pageNum,
      pageSize,
      start,
      end,
      semesterId,
      state,
      reviewed,
      departmentLimit,
      gradeLimit,
    },
  })
}

/**
 * 表格批量导入成员
 * @param {string} curriculumId
 * @param {string} file
 * @returns
 */
export function uploadUserToCourse(courseId: number, file: string): Promise<APIResponseType> {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: `${API.JOIN_BATCH}/${courseId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
/**
 * 课程详情信息回显
 * @param {string} curriculumId
 * @returns
 */
export function backInfo(curriculumId: string): Promise<APIResponseType> {
  return request.get(`${API.BACK}/${curriculumId}`)
}

/**
 * 词云
 * @param {number} limit 条数
 * @returns {AxiosPromise<any>}
 */
export function wordCloud(limit: number): Promise<APIResponseType> {
  return request.get(`${API.WORD_CLOUD}`, { params: { limit } })
}
/**
 * 导出课程结果
 * @param {string} courseId
 * @param {array} data 分数对应参数
 * @param {number} data[].stage 分数段
 * @param {number} data[].score 对应实际分数
 * @returns
 */
export function downloadStudent(courseId: number, data: any): Promise<DownloadStudentParams> {
  return request({
    url: `/curriculum/course/download/${courseId}`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  })
}
