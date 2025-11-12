export interface LessonItem {
  applicationStart: string
  hostingStart: string
  hostingEnd: string
  status?: string
  [key: string]: any // 允许其他动态属性
}

export interface AddCourseParams {
  id?: number
  cover?: string
  title?: string
  semesterId?: number
  numberLimit?: number
  courseManager?: string
  courseLocation?: string
  applicationStart?: Record<string, unknown>
  applicationEnd?: Record<string, unknown>
  hostingEnd?: Record<string, unknown>
  hostingStart?: Record<string, unknown>
  courseCategory?: string
  score?: number
  departmentId?: number
  departmentLimit?: Record<string, unknown>[]
  gradeLimit?: Record<string, unknown>[]
  dimensionalityInfo?: {
    id?: Record<string, unknown>
    name?: string
    scale?: number
  }[]
  pointsRules?: string
  ruleContent?: string
  scoringStandards?: string
  organizer?: string
  undertaker?: string
  introduction?: string
  contact?: string
  attachment?: string
  auditPolicy?: number
  isOpen?: number
  isPatriarch?: number
  preliminaryWord?: Record<string, unknown>
}

export interface UpdateCourseParams {
  id?: number
  cover?: string
  title?: string
  semesterId?: number
  numberLimit?: number
  courseManager?: string
  courseLocation?: string
  applicationStart?: Record<string, unknown>
  applicationEnd?: Record<string, unknown>
  hostingEnd?: Record<string, unknown>
  hostingStart?: Record<string, unknown>
  courseCategory?: string
  score?: number
  departmentId?: number
  departmentLimit?: Record<string, unknown>[]
  gradeLimit?: Record<string, unknown>[]
  dimensionalityInfo?: {
    id?: Record<string, unknown>
    name?: string
    scale?: number
  }[]
  pointsRules?: string
  ruleContent?: string
  scoringStandards?: string
  organizer?: string
  undertaker?: string
  introduction?: string
  contact?: string
  attachment?: string
  auditPolicy?: number
  isOpen?: number
  isPatriarch?: number
  preliminaryWord?: Record<string, unknown>
}

export interface SelectCoursePageParams {
  userType?: number
  title?: string
  category?: string
  pageNum?: number
  pageSize?: number
  start?: string | null
  end?: string | null
  semesterId?: number
  passType?: number
  state?: number
  reviewed?: number
  departmentLimit?: Record<string, unknown>[]
  gradeLimit?: Record<string, unknown>[]
}

export interface OneRes {
  success: boolean
  message: string
  code: number
  data: Record<string, unknown>
}

export interface DownloadStudentParams {
  stage?: number
  score?: number
}
