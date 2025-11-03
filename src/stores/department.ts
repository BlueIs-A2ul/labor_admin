import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DepartmentListType } from '@/types/apis/department'
import { getDepartmentList } from '@/apis/department/department'

export const useDepartmentStore = defineStore('department', () => {
  const department = ref<DepartmentListType[]>([])

  const init = async () => {
    try {
      const res = await getDepartmentList('', 1, 100)
      if (res.code === 200) {
        const { list } = res.data as { list: DepartmentListType[] }

        let index = list.findIndex((item) => item.id === '1')
        list.splice(index, 1)
        department.value = list
        return list
      }
    } catch (error) {
      console.log(error)
    }
    return []
  }

  return {
    department,
    init,
  }
})
