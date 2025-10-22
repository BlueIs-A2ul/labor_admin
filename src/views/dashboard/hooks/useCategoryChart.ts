import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import * as rqChart from '@/apis/chartsData/chartsData'
import 'echarts-wordcloud'
import { ref, type Ref } from 'vue'
import { ca } from 'element-plus/es/locales.mjs'
export const useCategoryChart = () => {
  const categoryLoad = ref(false)
  let categoryChart = ref()

  const getCategoryChart = async (
    categoryChartDOM: Ref<HTMLElement>,
    departmentId: Ref,
    semesterId: Ref,
  ) => {
    console.log('getCategoryChart', {
      categoryChartDOM,
      departmentId,
      semesterId,
    })
    categoryLoad.value = true
    try {
      const res = await rqChart.getChartCourseCategory(departmentId.value, semesterId.value)
      if (res.code === 200) {
        const { data } = res as unknown as { data: CategoryChartItem[] }
        console.log('getCategoryChart', {
          data,
        })
        if (!categoryChart.value) {
          categoryChart.value = echarts.init(categoryChartDOM.value)
        }
        const categoryOptions = getCGCOptions(data)
        categoryChart.value.setOption(categoryOptions)
      } else {
        ElMessage.error(res.message)
      }
      categoryLoad.value = false
    } catch (_) {
      ElMessage.error('网络异常，请稍后再试')
    }
  }

  return {
    getCategoryChart,
  }
}

interface CategoryChartItem {
  name: string
  value: number
}

const getCGCOptions = (data: any[]) => {
  return {
    legend: {
      top: '80%',
    },
    center: ['50%', '20%'],
    color: ['#369DFD', '#32C8CA', '#49C872', '#EE607A', '#3436C7'],
    toolbox: {
      show: true,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}个 ({d}%)',
    },
    series: [
      {
        name: '课程占比', // 课程占比
        type: 'pie',
        radius: [25, 85],
        center: ['50%', '40%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 4,
        },
        data: data,
      },
    ],
  }
}
