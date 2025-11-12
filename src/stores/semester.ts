import { getSemesterNow } from '@/apis/semesterAndObjectives/semester'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useSemesterStore = defineStore('semester', () => {
  const id = ref<string | null>(null)
  const semesterName = ref<string | null>(null)
  const start = ref<string | null>(null)
  const end = ref<string | null>(null)

  const getSemesterInfo = async () => {
    try {
      const res = await getSemesterNow()
      if (res.code === 200) {
        const { data } = res as unknown as {
          data: {
            id: string
            semesterName: string
            start: string
            end: string
          }
        }
        id.value = data.id as string
        semesterName.value = data.semesterName
        start.value = data.start
        end.value = data.end
      } else {
        throw new Error('获取学期信息失败')
      }
      return
    } catch (error) {
      console.log(error)
    }
  }

  const setId = (newId: string) => {
    id.value = newId
  }
  return {
    setId,
    id,
    semesterName,
    start,
    end,
    getSemesterInfo,
  }
})
