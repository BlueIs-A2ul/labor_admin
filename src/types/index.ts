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
