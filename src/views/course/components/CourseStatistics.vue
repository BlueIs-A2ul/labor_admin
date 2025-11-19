<template>
  <div :id="id" ref="courseStatisticsRef" :class="className" style="height: 100%; width: 100%" />
</template>

<script setup lang="ts">
import { statisticalScore } from '@/apis/chartsData/chartsData';
import { ElMessage } from 'element-plus';
import { computed, onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { debounce } from '@/utils/debounce';

const props = defineProps<{
  id?: string
  className?: string
  width?: string
  height?: string
  type: number
  courseId: string
  title: string
}>()

const chart = ref()
const courseData = ref<CourseDataItem[]>([])
const total = ref(0)
const watchChart = ref()
const courseStatisticsRef = ref<HTMLElement | null>(null)
const parentEl = ref<HTMLElement | null>(null)

const courseId = computed(() => props.courseId)

watch(() => courseId.value, (newVal) => {
  if (newVal) {
    if (chart.value) {

    }
  }
})

const loadData = async () => {
  try {
    const res = await statisticalScore(Number(courseId.value), props.type)
    if (res.code === 200) {
      courseData.value = res.data as unknown as CourseDataItem[]
      initChart()
    } else {
      ElMessage.error('获取数据失败')
    }
  } catch (_) {
    ElMessage.error('获取数据失败')
  }
}

const getOption = () => {
  return {
    title: {
      left: 'center',
      text: props.title,
      show: true // 是否显示标题组件
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}分: {c}人 ({d}%)'
    },
    graphic: {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: total.value > 0 ? '总计' + // 圆饼中心显示数据，这里是显示得总数
          '\n\n' +
          String(total.value).replace(
            /(\d)(?=(?:\d{6})+$)/g,
            '$1.'
          ) : '暂无数据',
        textAlign: 'center',
        fill: '#000',
        width: 30,
        height: 30,
        fontSize: 14,
        fontWeight: 600
      }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: {
              color: '#3c4858',
              fontSize: '14'
            },
            formatter: function (val: {
              name: string,
              percent: number
            }) {
              return val.name + ': ' + val.percent + '%'
            }
          },
          labelLine: {
            show: true,
            lineStyle: {
              color: '#3c4858'
            }
          }
        },
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          textColor: '#000'
        }
      },
      data: courseData.value.filter((e) => {
        return e.name
      }) // 数据
    }],
    color: ['#f18080', '#36cbcb', '#4dcb73', '#975fe4', '#3aa0ff'] // 颜
  }
}

const initChart = () => {
  const length = courseData.value.length
  if (length > 0) {
    total.value = 0
    courseData.value.map(e => {
      if (e.name) {
        total.value += Number(e.value)
      }
    })
  }
  chart.value = echarts.init(courseStatisticsRef.value)

  chart.value.setOption(getOption())

  watchChart.value = new ResizeObserver(() => {
    debounce(chart.value.resize(), 300)
  })

  // 这里因为只有侧边栏变化会触发，而侧边栏变化会引起右边container的变化，所以监听container和监听父div是等效的
  if (parentEl.value) {
    watchChart.value.observe(parentEl.value)
  }
}

onMounted(() => {
  parentEl.value = courseStatisticsRef.value?.parentElement ?? null

  loadData()
})

interface CourseDataItem {
  name: string
  value: number
}
</script>

<style scoped></style>
