export interface Semester {
  id?: number | string
  semesterName: string
  start: string
  end: string
  grade: string
  departmentId: number | string
  dimensionalityInfo: string
}

export interface SemesterInfo {
  id: number | string
  semesterName: string
  start: string
  end: string
}
