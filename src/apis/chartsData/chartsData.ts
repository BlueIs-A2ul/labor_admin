import request from '@/utils/request'
const CURRICULUM_STATISTICS = '/curriculum/statistics'

const API = {
  DAILY_COURSE: `${CURRICULUM_STATISTICS}/dailyCourse`,
  CLASSIFICATION: `${CURRICULUM_STATISTICS}/course/classification`,
  TOTAL: `${CURRICULUM_STATISTICS}/total`,
  DAILY_COURSE_USER_COUNT: `${CURRICULUM_STATISTICS}/dailyCourseUserCount`,
  STUDENT_RANK: `/user/student/rank`,
  COURSE_SCORE: `${CURRICULUM_STATISTICS}/course/score`,
  GRADE_CREDIT: `${CURRICULUM_STATISTICS}/grade/credit/statistics`,
  SIX_STANDARD: `${CURRICULUM_STATISTICS}/course/reaching/standard`,
  THREE_STANDARD: `${CURRICULUM_STATISTICS}/course/dimensionality/histogram`,
}

import type {
  TotalRes,
  DailyStatisticsOfCourseDataRes,
  CourseClassificationRes,
  DailyStatisticsOfCourseUserDataRes,
  GetRankRes,
  APIResponse,
} from '@/types/apis/chartData'

/**
 * 统计课程数量
 * @param {string} start 统计起始时间， 格式必须为: yyyy、mm、dd，如果为多个连接，则必须用-连接
 * @param {string} end 同start
 * @param {number} semesterId 学期id, 从vuex的charts模块去拿, 学期id和start、end二选一且必传
 * @param {string} dateFormat 返回的日期格式，格式必须为: yyyy、mm、dd，如果为多个连接，则必须用-连接
 * @param {int} departmentId 学院id
 * @param {int} majorId 专业id
 * @param {int} classId 班级id
 * @param {int} semesterId 学期id
 * @param {int} grade 年级
 * @returns echarts柱状图或折线图需要的dataX和dataY
 */
export function getChartDailyCourse(
  start: string,
  end: string,
  semesterId: number | null,
  dateFormat: string,
  departmentId: number,
  grade?: number,
): Promise<DailyStatisticsOfCourseDataRes> {
  return request({
    url: API.DAILY_COURSE,
    method: 'GET',
    params: {
      start,
      end,
      semesterId,
      dateFormat,
      departmentId,
      grade,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 *
 * @returns 课程分类饼状图数据
 */
export function getChartCourseCategory(
  departmentId: number,
  semesterId: number,
): Promise<CourseClassificationRes> {
  return request({
    url: API.CLASSIFICATION,
    method: 'GET',
    params: {
      departmentId,
      semesterId,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 系统展示数据汇总接口
 * @returns courseUserCount:当前学期学生参加活动人次;courseCount:当前学期课程总数; adminCount:管理员数量; studentCount:学生数量;
 */
export function getTotalData(): Promise<TotalRes> {
  return request({
    url: API.TOTAL,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function getUserCountChart(
  start: string,
  end: string,
  semesterId: number,
  dateFormat: string,
  departmentId: number,
  majorId: number,
  classId: number,
  grade: number,
  type: string,
): Promise<DailyStatisticsOfCourseUserDataRes> {
  return request({
    url: API.DAILY_COURSE_USER_COUNT,
    method: 'GET',
    params: {
      start,
      end,
      semesterId,
      dateFormat,
      departmentId,
      majorId,
      classId,
      grade,
      type,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 按照时间或者学期id获取学生积分排行榜
 * @param {*} start
 * @param {*} end
 * @requires semesterId 学期id
 * @param {*} semesterId
 * @param {*} departmentId
 * @returns
 */
export function getRankChart(
  start = null,
  end = null,
  semesterId: number,
  departmentId: number,
): Promise<GetRankRes> {
  return request({
    url: API.STUDENT_RANK,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      start,
      end,
      semesterId,
      departmentId,
    },
  })
}
/**
 * 单个课程数据汇总
 * @path {string|number} courseId
 * @path {number} type
 * @param {number} params interval 分段区间长度
 * @returns
 */
export function statisticalScore(courseId: number, type: number, params: { interval: number }) {
  //TODO 这里有修改
  //return request.get(`${API.COURSE_SCORE}/${courseId}/${type}`, { params })
  return request({
    url: `${API.COURSE_SCORE}/${courseId}/${type}`,
    method: 'GET',
    params: {
      interval: params.interval,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 年级学分统计
 * @returns
 */
export function gradeCreditStatistics() {
  return request.get(API.GRADE_CREDIT)
}

/**
 * 六个类型达标情况
 * @param {int} departmentId 学院id
 * @param {int} majorId 专业id
 * @param {int} classId 班级id
 * @param {int} semesterId 学期id
 * @param {int} grade 年级
 */
export function getSixStandardStatics(
  departmentId: number,
  majorId: number,
  classId: number,
  semesterId: number,
  grade: number,
): Promise<APIResponse> {
  return request({
    url: API.SIX_STANDARD,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: {
      departmentId,
      majorId,
      classId,
      semesterId,
      grade,
    },
  })
}
/**
 * 三个维度达标情况
 * @param {int} departmentId 学院id
 * @param {int} majorId 专业id
 * @param {int} classId 班级id
 * @param {int} semesterId 学期id
 * @param {int} grade 年级
 */
export function getThreeStandardsStatics(
  departmentId: number,
  majorId: number,
  classId: number,
  semesterId: number,
  grade: number,
): Promise<APIResponse> {
  return request({
    url: API.THREE_STANDARD,
    method: 'GET',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    params: {
      departmentId,
      majorId,
      classId,
      semesterId,
      grade,
    },
  })
}
