<template>

</template>

<script setup lang="ts">
import { useSemesterStore } from '@/stores/semester'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'

import { getAllSemesters } from '@/apis/semesterAndObjectives/semester'

const semesterStore = useSemesterStore()

const semesterName = computed(() => semesterStore.semesterName)
const semesterId = computed(() => semesterStore.id)
const chosenSemester = ref(semesterName.value)
const semesterList = ref<SemesterGroup[]>([])

const baseInfoData = [
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
]

const loadList = async () => {
}

const getSemesterList = async () => {
  try {
    const res = await getAllSemesters()
    if (res.code === 200) {
      const { data } = res
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

const chooseNewSemester = async (value: string) => {
  if (value !== semesterId.value) {
    semesterStore.id = value
    loadList()
  }
}

interface SemesterOption {
  value: string;
  label: string;
}

interface SemesterGroup {
  label: string;
  options: SemesterOption[];
}
</script>

<style lang="scss" scoped>
::v-deep {
  .myStatistic {
    flex: 1;

    .el-statistic {
      .head {
        margin-bottom: 13px;
        color: #ffffff;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .con .number {
        font-size: 21px;
        color: white;
        padding: 0 4px;
        font-weight: normal;
      }
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
