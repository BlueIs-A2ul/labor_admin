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
