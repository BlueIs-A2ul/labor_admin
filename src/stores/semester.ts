import { getSemesterNow } from '@/apis/semesterAndObjectives/semester'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SemesterInfo } from '@/types/apis/semester'
export const useSemesterStore = defineStore('semester', () => {
  const id = ref<string | null>(null)
  const semesterName = ref<string | null>(null)
  const start = ref<string | null>(null)
  const end = ref<string | null>(null)

  const setSemester = (data: SemesterInfo) => {
    id.value = data.id as string
    semesterName.value = data.semesterName
    start.value = data.start
    end.value = data.end
  }

  const getSemesterInfo = async () => {
    try {
      const res = await getSemesterNow()
      if (res.code === 200) {
        const { data } = res
        setSemester(data)
      } else {
        throw new Error('获取学期信息失败')
      }
      return
    } catch (error) {
      console.log(error)
    }
  }
  return {
    id,
    semesterName,
    start,
    end,
    getSemesterInfo,
  }
})
