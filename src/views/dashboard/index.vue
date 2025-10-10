<template>
  <!-- TODO v-loading="globalLoad" -->
  <div id="pageContainer" class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="grid-content bg-purple baseInfoBox">
          <div v-for="(item, index) in baseInfoData" :id="item.className" :key="index" class="baseCard">
            <div class="icon">
              <div class="circle">
                <i :class="item.icon" />
              </div>
            </div>
            <div class="myStatistic">
              <el-statistic :title="item.key" :rate="10000" group-separator="," :value="item.value" />
            </div>
            <i class="iconBg" :class="item.bg" />
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple baseInfoBox semesterInfo" style="background-color: white">
          <div>当前学期: {{ semesterName }}</div>
          <div class="searchSemester">
            查看:
            <el-select v-model="chosenSemester" placeholder="选择学期查看数据" size="small" @change="chooseNewSemester">
              <el-option-group v-for="group in semesterList" :key="group.label" :label="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
              </el-option-group>
            </el-select>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col id="cdc" :span="18" class="chartContainer">
        <!--总课程发布量走势图-->
        <div class="title">
          <div>课程发布趋势</div>
          <div id="datePicker">
            选择范围:
            <el-date-picker v-model="CDCTimeRange" size="small" :disabled="CDCPickDisabled" type="daterange"
              align="right" unlink-panels :first-day-of-week="1" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" :shortcuts="shortcutsOptions"
              @change="handleCDCPickChange" />
          </div>
          <div id="interval">
            <el-switch v-model="isInterval" active-color="#13ce66" active-text="间隔一天查看" inactive-color="#ff4949"
              @change="initCourseData">
            </el-switch>
          </div>
          <button class="moreBtn" id="cdcBtn" @click="toCourseCount">
            更多>>
          </button>
        </div>
        <div ref="courseCountChart" v-loading="CCChartLoading" class="grid-content bg-purple card" />
      </el-col>

      <el-col id="rkc" :span="6" class="chartContainer">
        <div class="title" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          积分排行榜(前五)
          <svg id="toRankPage" t="1690213260873" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1591" width="35" height="35" @click="openRankList">
            <path
              d="M530.374089 9.664293l2.006019 273.998643c-31.234901 2.277422-62.387202 8.968086-93.456901 20.060193-6.608064-46.728451-8.732084-93.775504-6.372062-141.129361v-135.701309c-0.554605-5.038649 0.354003-9.440091 2.714027-13.216127 1.699216-2.832027 5.357252-4.554844 9.558092-4.484043l85.550825 0.472004z"
              fill="#5169CC" p-id="1592" />
            <path
              d="M530.374089 9.664293c27.140262-8.26008 48.026463-2.950028 62.658604 15.930154l-0.236002 89.798866v50.150484l-6.844066 138.651337c-20.142794 5.982658-37.996366-0.861408-53.572517-20.532198L530.374089 9.664293z"
              fill="#3351C5" p-id="1593" />
            <path
              d="M432.551145 26.892459v85.550825a1256.122114 1256.122114 0 0 0-177.237709 5.19205l-61.242591-2.714026 16.756162-4.248041c3.15063-0.778808 5.038649-4.094639 4.248041-7.434071-5.428052-23.045622-5.628654-45.229836-0.590006-66.552642a11.505111 11.505111 0 0 1 11.092107-8.968087l206.973996-0.826008zM745.726166 27.364464v87.556844l-152.929475 0.472005 0.236002-89.798866z"
              fill="#FC9743" p-id="1594" />
            <path
              d="M745.726166 27.364464l50.268484-0.472005c8.448881-0.0472 15.623351 6.372061 16.756162 14.986145 3.06803 21.865611 2.006019 44.097025-3.186031 66.670643a4.531244 4.531244 0 0 0 0.826008 3.941238 4.790846 4.790846 0 0 0 3.658036 1.840818c199.893928 3.540034 245.79637 242.846342 67.850654 310.814997-7.080068-26.042851-6.100659-51.601898 2.950028-76.70074 42.716412-35.718944 50.185884-78.706759 22.420217-128.975243-25.252244-45.784442-94.40091-35.754345-137.353325-36.816355l-0.590006-55.578536c-0.070801-4.18904-1.805417-7.799875-4.602044-9.558093-5.274651-3.386633-11.599512-4.248041-18.998183-2.596025v-87.556844z"
              fill="#FA7621" p-id="1595" />
            <path
              d="M432.551145 112.443284v50.150484l-173.107669-2.950028-4.13004-42.008406c58.764567-5.900057 117.847737-7.634674 177.237709-5.19205zM745.726166 114.921308c7.398671-1.652016 13.723532-0.790608 18.998183 2.596025 2.796627 1.758217 4.531244 5.369052 4.602044 9.558093l0.590006 55.578536-3.06803 153.991485-6.726064 91.096878c-40.356389 71.272687-97.43354 123.511791-171.219652 156.705512l-61.478593 9.322089-21.712209-8.732084c204.613973-67.142648 193.167863-230.574224 189.037823-415.600008a6.962067 6.962067 0 0 0-5.900057-6.726065c-32.804316-5.19205-64.818025-4.248041-96.052926 2.832028v-50.150484l152.929475-0.472005z"
              fill="#F8C52D" p-id="1596" />
            <path
              d="M194.070845 114.921308l61.242591 2.714026 4.13004 42.008406-3.894038 23.600227c-36.580353-0.118001-79.650768-6.018058-110.567066 11.446111-61.242591 34.574333-59.590575 121.541172 1.888018 159.183535l-2.950028 70.800683c-173.225671-61.124589-139.595346-296.418859 50.150483-309.752988z"
              fill="#FA7621" p-id="1597" />
            <path
              d="M259.443476 159.64374l173.107669 2.950028c-2.360023 47.353857-0.236002 94.40091 6.372062 141.129361-8.024077 15.021545-8.142079 30.916298-0.354004 47.67246a8.791085 8.791085 0 0 0 8.614083 4.956048c19.352187-1.805417 36.780955-9.558092 52.274505-23.246224a10.891505 10.891505 0 0 1 10.148097-2.596026 150.581252 150.581252 0 0 1 53.572517 26.786259c4.059239 3.13883 9.251289 4.425043 14.006735 3.469233 4.755446-0.944009 8.496082-4.035639 10.065497-8.30728 6.289461-16.520159 5.864657-32.603714-1.298012-48.262465l6.844066-138.651337c31.234901-7.080068 63.24861-8.024077 96.052926-2.832028a6.962067 6.962067 0 0 1 5.900057 6.726065c4.13004 185.025784 15.57615 348.457361-189.037823 415.600008-22.266815 6.053458-45.347837 4.873447-69.266668-3.540034-72.370098-29.110881-126.615221-78.435356-162.723569-147.973427l-14.278138-61.478593-3.894038-38.35037a659.095356 659.095356 0 0 0 0-150.451451l3.894038-23.600227z"
              fill="#FDDD44" p-id="1598" />
            <path
              d="M255.549438 183.243967a659.095356 659.095356 0 0 1 0 150.451451l-45.194436-3.776036-50.976491 4.366042c-3.976638 0.354003-7.198069 2.548825-8.142079 5.546053l-4.366042 14.042136c-61.478593-37.642363-63.130609-124.609202-1.888018-159.183535 30.916298-17.464168 73.986714-11.564112 110.567066-11.446111zM769.916399 182.653962c42.952414 1.06201 112.101081-8.968086 137.353325 36.816355 27.765668 50.268485 20.296196 93.256299-22.420217 128.975243-16.284157-18.089574-37.087758-23.83623-62.422602-17.228166l-55.578536 5.428053 3.06803-153.991485z"
              fill="#FFFFFF" p-id="1599" />
            <path
              d="M532.380108 283.662936c15.57615 19.67079 33.429722 26.514856 53.572517 20.532198 7.162669 15.658751 7.587473 31.742306 1.298012 48.262465-1.581215 4.271641-5.310051 7.351471-10.065497 8.30728a17.523169 17.523169 0 0 1-14.006735-3.469233 150.581252 150.581252 0 0 0-53.572517-26.786259 10.891505 10.891505 0 0 0-10.148097 2.596026c-15.493549 13.688132-32.922318 21.440807-52.274505 23.246224a8.791085 8.791085 0 0 1-8.614083-4.956048c-7.788075-16.756162-7.670074-32.650915 0.354004-47.67246 31.0697-11.092107 62.222-17.782771 93.456901-20.060193z"
              fill="#F8C52D" p-id="1600" />
            <path
              d="M210.355002 329.919382a1263.213983 1263.213983 0 0 0-4.956047 248.628398c-15.458149 1.06201-62.304601 55.932539-57.230552 0.118001 4.802646-51.684498 3.386633-103.014993-4.248041-153.991485l2.950028-70.800683 4.366042-14.042136c0.944009-2.997229 4.16544-5.19205 8.142079-5.546053l50.976491-4.366042z"
              fill="#5169CC" p-id="1601" />
            <path
              d="M210.355002 329.919382l45.194436 3.776036 3.894038 38.35037v59.000569l-0.236002 162.369566c0 18.018774-6.808666 21.74761-20.414197 11.210108l-33.394322-26.078251c-6.525463-82.836799-4.873447-165.708998 4.956047-248.628398z"
              fill="#3351C5" p-id="1602" />
            <path
              d="M822.426905 331.217394l0.354004 246.622379c-10.620102 4.012039-59.826577 49.914481-56.758548 5.664054 3.457433-50.032483 1.498614-101.952983-5.900056-155.761502l6.726064-91.096878 55.578536-5.428053z"
              fill="#5169CC" p-id="1603" />
            <path
              d="M822.426905 331.217394c25.334844-6.608064 46.138445-0.861408 62.422602 17.228166-9.050687 25.098842-10.030097 50.657889-2.950028 76.70074l-4.956048 165.319595c-0.153401 4.436843-1.522215 8.212879-3.776036 10.3841-14.632141 13.924134-37.878365-13.45213-50.386486-23.010222l-0.354004-246.622379z"
              fill="#3351C5" p-id="1604" />
            <path d="M259.443476 372.045788l14.278138 61.478593-14.278138-2.478024z" fill="#FB8628" p-id="1605" />
            <path
              d="M436.445183 581.497808c23.918831 8.413481 46.999853 9.593493 69.266668 3.540034l21.712209 8.732084a191.256245 191.256245 0 0 1-23.600227 75.756731l-32.450313-2.006019c-33.358922-16.838762-44.993834-45.513039-34.928337-86.02283z"
              fill="#FC9743" p-id="1606" />
            <path
              d="M588.902653 584.447837c9.829495 41.146997-2.796627 70.800683-37.878365 88.972858l-47.200455-3.894038a191.256245 191.256245 0 0 0 23.600227-75.756731l61.478593-9.322089z"
              fill="#FA7621" p-id="1607" />
            <path
              d="M471.37352 667.520638l32.450313 2.006019 47.200455 3.894038-0.472005 43.778422a186.335597 186.335597 0 0 1-75.75673-5.900057l-3.422033-43.778422z"
              fill="#F8C52D" p-id="1608" />
            <path
              d="M474.795553 711.29906c24.697638 7.162669 49.949882 9.121488 75.75673 5.900057l0.472005 61.478593-82.600797-2.950029 6.372062-64.428621z"
              fill="#FDE265" p-id="1609" />
            <path
              d="M676.105494 779.031713l-45.312437 7.19807c-2.997229 0.472005-5.510653 3.846837-6.136059 8.260079a658.823954 658.823954 0 0 0-2.832027 149.389441h-20.650199l-1.534015-86.494834c-0.059001-6.348461-4.484043-11.540511-10.148098-11.918115l-59.11857-3.894038-92.630894 2.242022c-7.28067 0.118001-13.145327 5.723055-13.216127 12.626122l-0.944009 87.202841-82.010791 0.236002 0.354003-149.389441c0.0472-8.30728 6.407462-15.080545 14.396139-15.340148l112.101081-3.422033 82.600797 2.950029c38.468371-4.248041 80.158173-4.13004 125.081206 0.354003z"
              fill="#7A6D79" p-id="1610" />
            <path
              d="M676.105494 779.031713a815.505865 815.505865 0 0 1 8.968087 157.885523 8.767485 8.767485 0 0 0 5.19205 8.142078c28.638876 13.841533 37.087758 36.344351 25.370244 67.496651a8.673084 8.673084 0 0 1-8.142078 5.546054l-44.368428-0.472005c-3.422033-35.990347-4.366042-67.37865-41.300398-73.750711-4.720046-49.949882-3.776036-99.746362 2.832027-149.389441 0.625406-4.413243 3.13883-7.788075 6.136059-8.260079l45.312437-7.19807z"
              fill="#685E67" p-id="1611" />
            <path
              d="M530.374089 841.572316a280.465105 280.465105 0 0 1 8.850085 105.257015l-115.641115-3.18603 0.944009-87.202841c0.070801-6.903067 5.935457-12.508121 13.216127-12.626122l92.630894-2.242022z"
              fill="#CBE5E6" p-id="1612" />
            <path
              d="M530.374089 841.572316l59.11857 3.894038c5.664055 0.377604 10.089097 5.569654 10.148098 11.918115l1.534015 86.494834-61.950598 2.950028c3.693436-35.872346 0.743407-70.954084-8.850085-105.257015z"
              fill="#A8D3D8" p-id="1613" />
            <path
              d="M423.583059 943.643301l115.641115 3.18603 61.950598-2.950028h20.650199c36.934356 6.372061 37.878365 37.760364 41.300398 73.750711l-339.725276 0.118001a17.169166 17.169166 0 0 1-16.402159-12.154117c-9.593493-30.361693 1.923419-50.941091 34.574334-61.714595l82.010791-0.236002z"
              fill="#918191" p-id="1614" />
          </svg>
          <!-- <button class="moreBtn" @click="toRankChart">更多>></button> -->
        </div>
        <div ref="rkc" v-loading="rankLoad" class="grid-content bg-purple card" />
      </el-col>
    </el-row>

    <el-row :gutter="20" type="flex">
      <el-col id="wc" :span="9" class="chartContainer">
        <div class="title">
          学生评价词云
          <button class="moreBtn" @click="toWordCloud">更多>></button>
        </div>
        <div id="wordCloud" ref="wordCloud" class="grid-content bg-purple card" />
      </el-col>

      <el-col id="cgc" :span="9" class="chartContainer">
        <div class="title">
          课程分类统计
          <button class="moreBtn" @click="toCategoryChart">更多>></button>
        </div>
        <div ref="categoryChartDOM" v-loading="categoryLoad" class="grid-content bg-purple card" />
      </el-col>
      <el-col id="uc" :span="6" class="chartContainer">
        <div class="title">
          参与人次
          <button class="moreBtn" @click="toUserCount">更多>></button>
        </div>
        <div ref="userCountChartDOM" v-loading="userCountLoad" class="grid-content bg-purple card" />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col id="sat" :span="8" class="chartContainer">
        <!-- 六个活动达标情况雷达图 -->
        <div class="title">
          <div>六个活动达标情况</div>
          <button class="moreBtn" @click="toSixStandardChart">更多>></button>
        </div>
        <div ref="sat" v-loading="sixStandardLoad" class="grid-content bg-purple card"></div>
      </el-col>

      <el-col id="tds" :span="16" class="chartContainer">
        <!-- 三个维度达标情况 -->
        <div class="title">
          <div>三个维度达标情况</div>
          <button class="moreBtn" @click="toThreeStandardChart">更多>></button>
        </div>
        <div ref="tds" v-loading="threeStandardLoad" class="grid-content bg-purple card"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import { useSemesterStore } from '@/stores/semester'
import { useDepartmentStore } from '@/stores/department'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { getAllSemesters } from '@/apis/semesterAndObjectives/semester'
import * as rqChart from '@/apis/chartsData/chartsData'
import type { DepartmentListType } from '@/types/apis/department'
import type { SimpleUserModel } from '@/types/apis/user'
import { guidePage } from './firstLogin'
import router from '@/router'
import { calculate } from '@/apis/common'
import { wordCloudCondition } from '@/apis/word/word'
import { use } from 'echarts/types/src/extension.js'
import { ca } from 'element-plus/es/locales.mjs'

const semesterStore = useSemesterStore()
const departmentStore = useDepartmentStore()
const userStore = useUserStore()

const semesterName = computed(() => semesterStore.semesterName)
const semesterId = computed(() => semesterStore.id)
const departmentId = computed(() => userStore.departmentId)
const chosenSemester = ref(semesterName.value)
const semesterList = ref<SemesterGroup[]>([])

const departmentList = ref<DepartmentListType[]>([])

const baseInfoData = reactive([
  {
    key: "学生",
    value: 0,
    className: "stuCard",
    icon: "el-icon-s-promotion",
    bg: "iconfont icon-xuesheng",
  },
  {
    key: "参加课程人次",
    value: 0,
    className: "userCountCard",
    icon: "el-icon-s-promotion",
    bg: "iconfont icon-xuesheng",
  },
  {
    key: "本学期课程",
    value: 0,
    className: "courseCard",
    icon: "el-icon-s-order",
    bg: "iconfont icon-maisui",
  },
  {
    key: "后台教师",
    value: 0,
    className: "userCard",
    icon: "el-icon-s-custom",
    bg: "iconfont icon-jiaoshi_dashuju",
  },
])

const loadList = async () => {
  if (!departmentList.value.length) {
    departmentList.value = await departmentStore.init() as DepartmentListType[]
  }
}

const getSemesterList = async () => {
  try {
    const res = await getAllSemesters()
    if (res.code === 200) {
      const { data } = res as unknown as { data: SemesterDataItem[] }
      const currentSemesterId = semesterId.value || ''
      const currentSemesterName = semesterName.value || ''
      semesterList.value.push({
        label: "当前学期",
        options: [{ value: currentSemesterId, label: currentSemesterName }],
      })
      const index = data.findIndex((item: {
        id: string
      }) => item.id === semesterId.value)
      data.splice(index, 1)

      if (data.length) {
        const others = data.map((item: {
          id: string
          semesterName: string
        }) => {
          return {
            value: item.id,
            label: item.semesterName,
          }
        })
        semesterList.value.push({
          label: "当前学期",
          options: others,
        })
      }
    } else {
      ElMessage.error('获取学期列表失败')
    }
  }
  catch (error) {
    ElMessage.error(error as string)
  }
}

const getBaseInfo = async () => {
  try {
    const res = await rqChart.getTotalData()
    if (res.code === 200) {
      const { data } = res
      Object.values(data).forEach((v, index) => {
        if (typeof v === 'string') {
          baseInfoData[index].value = Number(v)
        }
      })
    }
  }
  catch (error) {
    ElMessage.error(error as string)
  }
}

const chooseNewSemester = async (value: string) => {
  if (value !== semesterId.value) {
    semesterStore.id = value
    loadList()
  }
}

const CDCTimeRange = ref([])
const CDCPickDisabled = ref<boolean>(false)
const isInterval = ref<boolean>(false)
const CCChartLoading = ref<boolean>(false)
const courseDataChart = ref()
const courseCountChart = ref()
const courseRange = reactive({
  start: '',
  end: '',
  timeFormat: "yyyy-MM-dd",
})

const disabledDateFunction = (time: Date) => {
  // 禁用今天的日期之后的所有日期
  return time.getTime() > Date.now()
}

const shortcutsOptions = [
  {
    text: '默认',
    value: () => {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
      return [start, new Date()]
    }

  },
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

const initCourseData = async () => {
  CCChartLoading.value = true
  try {
    const res = await rqChart.getChartDailyCourse(
      courseRange.start,
      courseRange.end,
      null,
      courseRange.timeFormat,
      departmentId.value as unknown as number,
    )
    if (res.code === 200) {
      const { data } = res as unknown as { data: CourseData }
      let courseDataX = data.dataX
      let courseDataY = data.dataY

      if (!courseDataChart.value) {
        // 初始化图表实例
        courseDataChart.value = echarts.init(courseCountChart.value)
      }

      if (isInterval.value && courseRange.timeFormat === "yyyy-MM-dd") {
        courseDataX = courseDataX.filter((_, index) => {
          return index % 2 === 0
        })
        courseDataY = courseDataY.filter((_, index) => {
          return index % 2 === 0
        })
      } else if (isInterval.value && courseRange.timeFormat === "yyyy-MM") {
        ElMessage({
          message: "请选择月数据",
          type: 'error',
          duration: 3000,
        })
      }

      const CDChartOptions = getCDCOptions(courseDataX, courseDataY)
      courseDataChart.value.setOption(CDChartOptions)
    }
  }
  catch (error) {
    ElMessage.error(error as string)
  }
}

const handleCDCPickChange = async (timeRange: string[]) => {
  CDCPickDisabled.value = true
  courseRange.start = timeRange[0] === '' ? '' : timeRange[0]
  courseRange.end = timeRange[1] === '' ? '' : timeRange[1]
  const days = calculate(courseRange.start, courseRange.end)
  courseRange.timeFormat = days / 25 > 2 ? 'yyyy-MM' : 'yyyy-MM-dd'
}

const toCourseCount = () => {
  if (!departmentList.value.length) {
    loadList()
  }
  router.push({
    path: "/chartInfo/courseCount",
    query: {
      // TODO 获取部门列表
      departmentList: departmentList.value,
      departmentId: departmentId.value,
    }
  })
}

const wordList = ref<WordItem[]>([])
const wordCloudChart = ref()
const wordCloud = ref()
const wordCloudColor = ["#1890FF", "#2FC25B", "#41D9C7", "#FACC14", "#9AE65C"]

const toWordCloud = async () => {
  if (!departmentList.value.length) {
    await loadList()
  }
  const queryDepartmentList = toRaw(departmentList.value)
  console.log(JSON.stringify(queryDepartmentList))
  //encodeURI
  router.push({
    path: "/chartInfo/wordCloud",
    query: {
      departmentList: queryDepartmentList,
      departmentId: departmentId.value,
    }
  })
}

const toCategoryChart = async () => {
  if (!departmentList.value.length) {
    await loadList()
  }
  router.push({
    path: "/chartInfo/categoryChart",
    query: {
      departmentList: departmentList,
    }
  })
}

const toUserCount = async () => {
  if (!departmentList.value.length) {
    await loadList()
  }
  router.push({
    path: "/chartInfo/userCount",
    query: {
      departmentList: departmentList,
      departmentId: departmentId,
    }
  })
}

const openRankList = () => {

}

const getWordCloud = async () => {
  const res = await wordCloudCondition(
    null,
    null,
    departmentId.value
  )
  const { data } = res as unknown as { data: WordItem[] }
  wordList.value = data
  await initWordCloud()
}

const initWordCloud = async () => {
  if (!wordCloudChart.value) {
    wordCloudChart.value = echarts.init(wordCloud.value)
  }
  const maskImage = new Image()
  maskImage.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAwCAYAAABKfMccAAAAAXNSR0IArs4c6QAAA7dJREFUaEPlmlFu4jAQhj0QDrFv9A0p5mFP0OVxT7Fwi31re4O9QelJ2p6BROKtPUgSryayUWLGYew4ECBSpT7Yxv78ezwzHhADfIvFYp4kyVwI8SiE+KWUwv8PHwB8K6W+J5PJ52632w4whaAhIaiXo5OG8EcI8cwdF6EgHAB4uzSYKDA0hFdUARcC1U6D2WRZ9tFnnNC+vWEsl8u1UgpBxPyesyx7iTkgZ6xeMNI0fQWAdccP4Q7j36dlM+ZVVT129UWV5Hn+wFlErDbBMKSU7x3HgrWzeLxmsxkaWLQzR0fs3ECCYEgpnxxGkgWB2knXmAgE1QUA9Y1kDC6qLbZt8YYhpcQdRFW0PgDY9L0NUCnT6fTdLPyU/DWYbVEUb/v9HqH1+rxhpGn6ZU82BgizCl8gDbVs+xpdLxiUlGOCaAJJkuTLd5tRKWVZrkJV4gtDWRP8yLJs5TtpTnu8squqekKHTN9IdTf0ZrUySZ+mDxA2DIc/sYptxDigsE2XtxsKhA2DuEoHUwUXiIFCGd2Qa9kHhn1ELqYKG5YrHPC1ZywY1BEpiuIh1FD57Dy3LXUL+aojGEaWZay+3MXEaOfwgdgKZi2IuFJHYS8cnqwdJrDnyoJhB2RKqW2e55sYuxl7DFsdPkfl5mBoY2o7bKyjcnMwUGl2yMC9VTphuK6sMR8ThEGlF3DOZVm+dN2AJIxTucxrhMEJ6I5gcPKZ1wqjYazJG+YIhiuDZXIHQyRVYt8o5qkCM2iu1CK1oS0YjrOGafzeuYLYC+aOdyKga7kIBxhUcvfSqXvugjntXFn85k1zgCGlbAViPs4KZzJjaEP5IM111jAoVYwtEIsFk4pfjDpqGIQqRutux4Bi20ajDriG8DwGgOYYlDqqqvoJ1xSExYRiu+wkDHwc6ptyjznpocYijsoaldF6B+EGNUNN8lzj2jkaAPgHtvEUQrDC3XNNeqjfsW1lDYN4IbsLGIQy/qIy7DTZXdgM++IAABIGO2c4lITPMa59IpRSv1EZrVf10Neocywg1m9QvlVVVT/A4a/fpwdKxSa3FK3aauqqJKhjE1c01+d5P5akY45DueFHUasO1o5Kk27JfnRUJR5ciUM+Q79VYj1Eq3ovdqlQzJ3mjOVal+7bciNaab+uEiJTaIYlzvp/URRF7zoqzoJ82zRLtTsqEo9cCFd23Kvk2XeyI2hPOpZB7yYjWEzQFE7dkpwXtatXibF7p1ITrLdWU8mrS5znjSKzoB0aupOxafjE4fPO8x/Lmq0SmHlcDQAAAABJRU5ErkJggg==';
  const wcOptions = {
    series: [
      {
        type: "wordCloud",
        gridSize: 7,
        sizeRange: [20, 50],
        rotationRange: [0, 0],
        textStyle: {
          fontFamily: "sans-serif",
          //TODO 根据出现频次调整字体粗细
          fontWeight: "bold",
          color: () => {
            const r = Math.floor(
              Math.random() * wordCloudColor.length
            );
            return wordCloudColor[r];
          }
        },
        width: "90%",
        height: "90%",
        data: wordList.value
      },
      0
    ]
  }
  wordCloudChart.value.setOption(wcOptions)
}

const rankLoad = ref<boolean>(false)
const rankChart = ref()
const rkc = ref()

const getRankChart = async () => {
  rankLoad.value = true
  try {
    const res = await rqChart.getRankChart(
      0, 5, semesterId.value
    )
    if (res.code === 200) {
      const { list } = res.data as unknown as { list: SimpleUserModel[] }
      const cnt = list.length < 5 ? list.length : 5
      const rankList = list.splice(0, cnt)

      const dataX = rankList.map(item => item.name)
      const dataY = rankList.map(item => item.score)

      if (!rankChart.value) {
        rankChart.value = echarts.init(rkc.value)
      }

      const rankOptions = getRCOptions(dataX, dataY)
      rankChart.value.setOption(rankOptions)
    }
    rankLoad.value = false
  }
  catch (_) {
    ElMessage.error("网络异常，请稍后再试")
  }
}

const getRCOptions = (dataX: string[], dataY: string[]) => {
  return {
    backgroundColor: "#ffffff",
    tooltip: {
      trigger: "axis",
      show: true,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "line", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: "10%",
      right: "15%",
      bottom: "5%",
      containLabel: true,
    },
    xAxis: [
      {
        splitLine: {
          show: false,
        },
        type: "value",
        show: false,
      },
    ],
    yAxis: [
      {
        splitLine: {
          show: false,
        },
        axisLine: {
          // y轴
          show: false,
        },
        type: "category",
        axisTick: {
          show: false,
        },
        inverse: true,
        data: dataX,
        axisLabel: {
          color: "#303133",
          fontSize: 14,
        },
      },
    ],
    series: [
      {
        name: "二课积分",
        type: "bar",
        barWidth: 8, // 柱子宽度
        label: {
          show: true,
          position: "right", // 位置
          color: "#303133",
          fontSize: 14,
          distance: 15, // 距离
          formatter: "{c} 分", // 这里是数据展示的时候显示的数据
        }, // 柱子上方的数值
        itemStyle: {
          barBorderRadius: [0, 0, 0, 0], // 圆角（左上、右上、右下、左下）
          color: "#419fff",
        },
        data: dataY,
      },
    ],
  }
}

const categoryLoad = ref<boolean>(false)
const categoryChart = ref()
const categoryChartDOM = ref()

const getCategoryChart = async () => {
  categoryLoad.value = true
  try {
    const res = await rqChart.getChartCourseCategory(
      departmentId.value,
      semesterId.value
    )
    if (res.code === 200) {
      const { data } = res as unknown as { data: CategoryChartItem[] }
      if (!categoryChart.value) {
        categoryChart.value = echarts.init(categoryChartDOM.value)
      }
      const categoryOptions = getCGCOptions(data)
      categoryChart.value.setOption(categoryOptions)
    } else {
      ElMessage.error(res.message)
    }
    categoryLoad.value = false
  }
  catch (_) {
    ElMessage.error("网络异常，请稍后再试")
  }
}

const getCGCOptions = (data: any[]) => {
  return {
    legend: {
      top: "80%",
    },
    center: ["50%", "20%"],
    color: ["#369DFD", "#32C8CA", "#49C872", "#EE607A", "#3436C7"],
    toolbox: {
      show: true,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}个 ({d}%)",
    },
    series: [
      {
        name: "课程占比", // 课程占比
        type: "pie",
        radius: [25, 85],
        center: ["50%", "40%"],
        roseType: "area",
        itemStyle: {
          borderRadius: 4,
        },
        data: data,
      },
    ],
  };
}

const userCountLoad = ref<boolean>(false)
const userCountChart = ref()
const userCountChartDOM = ref()

const getUserCountChart = async () => {
  userCountLoad.value = true
  try {
    const res = await rqChart.getUserCountChart(
      null,
      null,
      semesterId.value,
      "yyyy-MM-dd",
      departmentId.value
    )
    if (res.code === 200) {
      const { data } = res as unknown as { data: CourseData }
      const time: string[] = data.dataX
      const numbers = data.dataY
      if (!userCountChart.value) {
        userCountChart.value = echarts.init(userCountChartDOM.value)
      }
      const userCountOptions = getUCCOptions(time, numbers)
      userCountChart.value.setOption(userCountOptions)
    } else {
      ElMessage.error(res.message)
    }
    userCountLoad.value = false
  }
  catch (e) {
    console.log(`获取异常${e}`)
    ElMessage.error(`获取异常${e}`)
  }
}

const sixStandardLoad = ref<boolean>(false)
const sat = ref()
const sixStandardChart = ref()

const getSixStandardChart = async () => {
  sixStandardLoad.value = true
  try {
    const res = await rqChart.getSixStandardStatics(
      departmentId.value,
      null,
      null,
      semesterId.value,
    )
    if (res.code === 200) {
      const { data } = res as unknown as { data: StandardStaticsItem[] }
      let arr: number[] = []
      data.forEach(e => arr.push(e.value))
      if (!sixStandardChart.value) {
        sixStandardChart.value = echarts.init(sat.value)
      }
      const sixStandardOPtions = getSSCOptions(arr)
      sixStandardChart.value.setOption(sixStandardOPtions)
    } else {
      ElMessage.error(res.message)
    }
    sixStandardLoad.value = false
  }
  catch (e) {
    console.log(`获取异常${e}`)
    ElMessage.error(`获取异常${e}`)
  }
}

const toSixStandardChart = () => {
  ElMessage.success("功能开发中")
}

const threeStandardLoad = ref<boolean>(false)
const tds = ref()
const threeStandardChart = ref()

const getThreeStandardChart = async () => {
  threeStandardLoad.value = true
  try {
    const res = await rqChart.getThreeStandardsStatics(
      departmentId.value,
      null,
      null,
      semesterId.value,
    )
    if (res.code === 200) {
      const { data } = res as unknown as { data: ThreeStandardsStaticsItem[] }
      console.log('data', data)
      const name = ['product']
      const methods = ['方法与技能']
      const emotion = ['道理与情感']
      const understand = ['价值观与认识']
      data.forEach(e => {
        name.push(e.name)
        methods.push(e.value[0].value)
        emotion.push(e.value[1].value)
        understand.push(e.value[2].value)
      })
      const barType: string[] = new Array(name.length - 1).fill({ type: 'bar' })
      if (!threeStandardChart.value) {
        threeStandardChart.value = echarts.init(tds.value)
      }
      const threeStandardOptions = getTDSOptions(name, methods, emotion, understand, barType)
      threeStandardChart.value.setOption(threeStandardOptions)
    }
    else {
      ElMessage.error(res.message)
    }
    threeStandardLoad.value = false
  }
  catch (e) {
    console.log(`获取异常${e}`)
    ElMessage.error(`获取异常${e}`)
  }
}

const toThreeStandardChart = () => {
  ElMessage.success("功能开发中")
}

const getEchartsData = async () => {
  try {
    await getRankChart()
    await getWordCloud()
    await getCategoryChart()
    await getUserCountChart()
    await getSixStandardChart()
    await getThreeStandardChart()
  }
  catch (e) {
    console.log(`获取异常${e}`)
    ElMessage.error(`获取异常${e}`)
  }
}

onMounted(async () => {
  await semesterStore.getSemesterInfo()
  await getSemesterList()
  await getBaseInfo()
  await initCourseData()
  await getEchartsData()
  await loadList()
  if (!localStorage.getItem("firstLogin")) {
    guidePage();
  }
})


interface SemesterOption {
  value: string;
  label: string;
}

interface SemesterGroup {
  label: string;
  options: SemesterOption[];
}

interface CourseData {
  dataX: string[]
  dataY: string[]
  total: string
}

interface WordItem {
  name: string
  value: number
}

interface SemesterDataItem {
  createBy: string;
  departmentId: number | null;
  end: string;
  gmtCreate: string;
  gmtModified: string;
  grade: number | null;
  id: string;
  isDeleted: number;
  semesterName: string;
  start: string;
  updateBy: string | null;
}

interface CategoryChartItem {
  name: string
  value: number
}

interface StandardStaticsItem {
  name: string
  value: number
}

interface ThreeStandardsStaticsItem {
  name: string
  value: { name: string; value: string }[]
}

const getCDCOptions = (dataX: string[], dataY: string[]) => {
  return {
    grid: {
      top: "25%",
      right: "5%",
      left: "5%",
      bottom: "10%",
    },
    center: ["50%", "50%"],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none", // none
      },
      extraCssText: "background:#ffffff;color:#666666",
      borderColor: "#7debc0",
      borderWidth: 1,
    },
    legend: {
      type: "scroll",
      right: "5%",
      top: "7%",
      data: ["当日发布课程数", "走势"], // ["当日发布课程数", "走势"]
      itemGap: 25,
      itemWidth: 16,
      itemHeight: 16,
      textStyle: {
        fontSize: "13",
        color: "#666666",
      },
    },
    xAxis: [
      {
        data: dataX,
        axisLabel: {
          interval: 0,
          margin: 10,
          color: "rgba(0,0,0,0.45)",
          textStyle: {
            fontSize: 12,
          },
        },
        axisLine: {
          lineStyle: {
            color: "#0FBA77",
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        name: "课程数", // 课程
        nameTextStyle: {
          color: "rgba(0,0,0,0.45)",
          fontSize: 13,
          padding: [20, 20, 0, 0],
        },
        axisLabel: {
          color: "rgba(0,0,0,0.45)",
          textStyle: {
            fontSize: 12,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#5A75FF",
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#0FBA77",
            opacity: 0.2,
          },
        },
      },
    ],
    animation: false,
    series: [
      {
        name: "当日发布课程数", // 课程数
        type: "bar",
        data: dataY,
        barWidth: "32px",
        itemStyle: {
          normal: {
            color: "#0FBA77",
            barBorderRadius: [100, 100, 0, 0],
          },
        },
      },
      {
        name: "走势",
        type: "line",
        data: dataY,
        symbolSize: 16,
        lineStyle: {
          normal: {
            width: 4,
            color: "rgba(247,150,0,1)",
            shadowColor: "rgba(247,150,0,0.38)",
            shadowBlur: 6,
            shadowOffsetY: 8,
          },
        },
        itemStyle: {
          normal: {
            color: "rgba(247,150,0,1)",
            borderColor: "rgba(247,150,0,1)",
            borderWidth: 4,
          },
        },
      },
    ],
  };
}

const getUCCOptions = (time: string[], numbers: string[]) => {
  return {
    color: "#14b1eb",
    title: {
      subtextStyle: {
        color: "rgba(0,0,0,1)",
        fontSize: 15,
        fontWeight: 300,
      },
      itemGap: 20,
      left: "center",
      bottom: "1%",
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "skyblue",
      axisPointer: {
        lineStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(126,199,255,0)", // 0% 处的颜色
              },
              {
                offset: 0.5,
                color: "rgba(126,199,255,1)", // 100% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(126,199,255,0)", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    },
    grid: {
      top: "18%",
      left: "15%",
      right: "5%",
      bottom: "25%",
      // containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#14b1eb",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#14b1eb",
            padding: 10,
            fontSize: 14,
          },
          formatter: function (data: string) {
            return data;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#192a4411",
          },
        },
        axisTick: {
          show: false,
        },
        data: time,
      },
    ],
    yAxis: [
      {
        name: "人次5",
        nameTextStyle: {
          color: "#14b1eb",
          fontSize: 12,
          padding: -5,
        },
        min: 0,
        splitLine: {
          show: true,
          lineStyle: {
            color: "#192a4411",
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#23365311",
          },
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: "#14b1eb",
            padding: 16,
          },
          // formatter: function (value) {
          //   if (value === 0) {
          //     return value;
          //   }
          //   return value;
          // },
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "人次",
        type: "line",
        smooth: true,
        // showSymbol: false,
        symbolSize: 8,
        zlevel: 3,
        lineStyle: {
          normal: {
            color: "#14b1eb",
            shadowBlur: 3,
            shadowColor: "#14b1eb66",
            shadowOffsetY: 8,
          },
        },
        markPoint: {
          label: {
            normal: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          data: [
            {
              type: "max",
              name: "最多",
            },
            {
              type: "min",
              name: "最少",
            },
          ],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "#14b1ebee",
              },
              {
                offset: 1,
                color: "#14b1eb00",
              },
            ],
            false
          ),
          shadowColor: "#14b1eb11",
          shadowBlur: 10,
        },
        data: numbers,
      },
    ],
  };
}

const getSSCOptions = (data: number[]) => {
  return {
    toolbox: {
      show: true,
    },
    tooltip: {
      trigger: "item",
      // formatter: "{a} <br/>{b} : {c}个 ({d}%)",
    },
    radar: {
      legend: {
        data: ["达标分数", "实际达标"],
      },
      axisLine: {
        lineStyle: {
          color: "gray",
        },
      },
      splitArea: {
        areaStyle: {
          color: ["rgba(145,204,117,0.2)", "rgba(210,219,238,0.2"],
        },
      },
      // shape: 'circle',
      indicator: [
        { name: "公益服务劳动", max: 100 },
        { name: "劳动理论劳动", max: 100 },
        { name: "日常生活学习", max: 100 },
        { name: "生产顶岗劳动", max: 100 },
        { name: "三下乡社会实践", max: 100 },
        { name: "其他方式劳动", max: 100 },
      ],
    },
    series: [
      {
        name: "达标 vs 实际",
        type: "radar",
        data: [
          {
            value: [60, 60, 60, 60, 60, 60],
            name: "达标分数",
          },
          {
            value: data,
            name: "实际达标",
          },
        ],
      },
    ],
    legend: {
      left: "right",
      backgroundColor: "rgba(0,0,0,0)",
    },
  };
}

const getTDSOptions = (name: string[], methods: string[], emotion: string[], understand: string[], barType: string[]) => {
  return {
    legend: {},
    tooltip: {},
    dataset: {
      source: [name, methods, emotion, understand],
    },
    xAxis: { type: "category" },
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: barType,
    color: ['#81a3ee']
  };
}
</script>

<style lang="scss" scoped>
:deep(.myStatistic) {
  flex: 1;

  .el-statistic {
    .el-statistic__head {
      margin-bottom: 13px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 2px;
    }

    .el-statistic__number {
      font-size: 21px;
      color: white;
      padding: 0 4px;
      font-weight: normal;
    }
  }
}

.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  /*     transition: all 0.2s ease-in;
    &:hover{
      box-shadow: 0 0 15px rgba(1,1,1,.2);
    } */
}

.grid-content {
  border-radius: 4px;
  min-height: 100px;
  max-height: 347.8px;
  height: 40vh;

  #wordCloud {
    width: 100%;
    height: 10vh;
    min-height: 220px;
    max-height: 310.8px;
    margin-top: 5px;
  }
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.dashboard-container {
  margin: 0;
  padding: 15px;
  background-color: #d6d6d640;
  overflow-y: auto;
  overflow-x: auto;
  min-width: 1322px;
  min-height: 892.15px;

  .card {
    background-color: white;
    padding-top: 5px;
    overflow: hidden;
  }

  .baseDiv {
    background: transparent;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  }

  .chartContainer {
    .title {
      width: 100%;
      height: 60px;
      padding: 20px;
      background-color: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.067);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      #toRankPage:hover {
        cursor: pointer;
      }

      .moreBtn {
        background-color: transparent;
        border: none;
        color: rgb(65, 159, 255);
        cursor: pointer;
      }
    }
  }

  .semesterInfo {
    display: flex;
    flex-direction: column !important;
    justify-content: space-around !important;
  }

  .baseInfoBox {
    height: 110px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .searchSemester {
      width: 75%;
      display: flex;
      align-items: center;

      .label {
        white-space: nowrap;
        margin-right: 10px;
      }

      :deep(.el-select) {
        flex: 1;
      }
    }

    .data {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly !important;
      align-items: flex-start !important;
      width: calc(100% - 90px);
      overflow: hidden;

      div {
        color: white;
      }

      .dataKey {
        font-size: 14px;
        font-weight: 200;
      }

      .dataValue {
        font-size: 30px;
      }
    }

    .baseCard {
      width: 23%;
      border-radius: 5px;
      overflow: hidden;
      height: -webkit-fill-available;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;

      .iconBg {
        position: absolute;
        font-size: 84px;
        color: white;
        opacity: 0.218;
        margin-left: 13%;
        top: 27%;
      }

      &>div {
        height: -webkit-fill-available;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .icon {
        .circle {
          width: 58%;
          height: 60%;
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        color: white;
        width: 100px;
        height: 100px;
        font-size: 30px;
      }
    }

    #userCountCard {
      background: linear-gradient(to right,
          rgb(96, 128, 223),
          rgb(41, 53, 228));
    }

    #userCard {
      background: linear-gradient(to right,
          rgb(18, 194, 233),
          rgb(196, 113, 237),
          rgb(246, 79, 89));
    }

    #stuCard {
      background: linear-gradient(to right,
          rgb(129, 167, 238),
          rgb(127, 65, 226));
    }

    #courseCard {
      background: linear-gradient(to right,
          rgb(231, 149, 82),
          rgb(255, 201, 85));
    }
  }
}
</style>
