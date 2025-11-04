export interface AddStudentParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  studentId?: string
  name?: string
  sex?: number
  birth?: Record<string, unknown>
  enrollmentYear?: Record<string, unknown>
  contact?: Record<string, unknown>
  uid?: number
  yiBanId?: string
  departmentId?: number
  majorId?: number
  campus?: string
  currentGrade?: string
  state?: number
  points?: number
  department?: string
  major?: string
}

export interface UpdateStudentParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  studentId?: string
  name?: string
  sex?: number
  birth?: Record<string, unknown>
  enrollmentYear?: Record<string, unknown>
  contact?: Record<string, unknown>
  uid?: number
  yiBanId?: string
  departmentId?: number
  majorId?: number
  campus?: string
  currentGrade?: string
  state?: number
  points?: number
  department?: string
  major?: string
}

export interface StudentParams {
  gmtCreate?: Record<string, unknown>
  gmtModified?: Record<string, unknown>
  createBy?: string
  updateBy?: string
  isDeleted?: number
  id?: number
  studentId?: string
  name?: string
  sex?: number
  birth?: Record<string, unknown>
  enrollmentYear?: Record<string, unknown>
  contact?: Record<string, unknown>
  uid?: number
  yiBanId?: string
  departmentId?: number
  majorId?: number
  campus?: string
  currentGrade?: string
  state?: number
  points?: number
  department?: string
  major?: string
}
