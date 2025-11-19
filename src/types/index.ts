export interface MajorItem {
  classes: string
  departmentId: string
  department: string
  id: string
  isDeleted: boolean
  majorName: string
}

export interface SemesterItem {
  id: string
  departmentId: string
  end: string
  start: string
  grade: string
  isDeleted: boolean
  majorId: string
  semesterName: string
}

export interface SemesterDataItem {
  createBy: string
  departmentId: number | null
  end: string
  gmtCreate: string
  gmtModified: string
  grade: number | null
  id: string
  isDeleted: number
  semesterName: string
  start: string
  updateBy: string | null
}

export interface CommentItem {
  id: string
  courseId: string
  remarks: string | null
  score: number | null
  detailCommand: Array<{
    id: string
    text: string
    icon: string
    name: string
  }>
  evaluateText: string
  gmtCreate: string
  createBy: {
    avatar: string
    userId: string
    studentId: string
    name: string
    pass: string | null
    evaluate: string | null
    department: string
    major: string
    points: string | null
    campus: string
    currentGrade: string
    sex: number
    enrollmentYear: string
    contact: {
      QQ: string
      微信: string
      电话: string
      邮箱: string
    }
  }
}
