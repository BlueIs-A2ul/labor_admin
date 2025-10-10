<template>
  <div class="container">
    <h1>ssssss</h1>
    <el-card class="box-card">
      <div class="block">
        <span style="color: #409eff">请选择想要查看的范围</span>
        <el-cascader clearable v-model="selectedOptions" ref="cascader" :props="cascaderProps" style="margin-left: 20px"
          :options="options" />
        <el-button type="primary" plain style="margin-left: 10px" @click="checkBtn">查看</el-button>
      </div>
    </el-card>

    <el-card class="box-card" style="margin-top: 50px">
      <div slot="header" class="clearfix">
        <span>词云详情</span>
      </div>
      <div id="wordCloud" ref="wordCloud" class="grid-content bg-purple card"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { wordCloudCondition } from '@/apis/word/word'
import { useSemesterStore } from '@/stores/semester'

const route = useRoute()
const semesterStore = useSemesterStore()

const semesterId = computed(() => semesterStore.id)
const wordList = ref([])

const options = ref([])
const wordCloudChart = ref()
const wordCloud = ref()
const wordCloudColor = ["#1890FF", "#2FC25B", "#41D9C7", "#FACC14", "#9AE65C"]


const departmentId = ref(route.query.departmentId)

const initWordCloud = () => {
  wordCloudChart.value = echarts.init(wordCloud.value)
  const maskImage = new Image()
  maskImage.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAwCAYAAABKfMccAAAAAXNSR0IArs4c6QAAA7dJREFUaEPlmlFu4jAQhj0QDrFv9A0p5mFP0OVxT7Fwi31re4O9QelJ2p6BROKtPUgSryayUWLGYew4ECBSpT7Yxv78ezwzHhADfIvFYp4kyVwI8SiE+KWUwv8PHwB8K6W+J5PJ52632w4whaAhIaiXo5OG8EcI8cwdF6EgHAB4uzSYKDA0hFdUARcC1U6D2WRZ9tFnnNC+vWEsl8u1UgpBxPyesyx7iTkgZ6xeMNI0fQWAdccP4Q7j36dlM+ZVVT129UWV5Hn+wFlErDbBMKSU7x3HgrWzeLxmsxkaWLQzR0fs3ECCYEgpnxxGkgWB2knXmAgE1QUA9Y1kDC6qLbZt8YYhpcQdRFW0PgDY9L0NUCnT6fTdLPyU/DWYbVEUb/v9HqH1+rxhpGn6ZU82BgizCl8gDbVs+xpdLxiUlGOCaAJJkuTLd5tRKWVZrkJV4gtDWRP8yLJs5TtpTnu8squqekKHTN9IdTf0ZrUySZ+mDxA2DIc/sYptxDigsE2XtxsKhA2DuEoHUwUXiIFCGd2Qa9kHhn1ELqYKG5YrHPC1ZywY1BEpiuIh1FD57Dy3LXUL+aojGEaWZay+3MXEaOfwgdgKZi2IuFJHYS8cnqwdJrDnyoJhB2RKqW2e55sYuxl7DFsdPkfl5mBoY2o7bKyjcnMwUGl2yMC9VTphuK6sMR8ThEGlF3DOZVm+dN2AJIxTucxrhMEJ6I5gcPKZ1wqjYazJG+YIhiuDZXIHQyRVYt8o5qkCM2iu1CK1oS0YjrOGafzeuYLYC+aOdyKga7kIBxhUcvfSqXvugjntXFn85k1zgCGlbAViPs4KZzJjaEP5IM111jAoVYwtEIsFk4pfjDpqGIQqRutux4Bi20ajDriG8DwGgOYYlDqqqvoJ1xSExYRiu+wkDHwc6ptyjznpocYijsoaldF6B+EGNUNN8lzj2jkaAPgHtvEUQrDC3XNNeqjfsW1lDYN4IbsLGIQy/qIy7DTZXdgM++IAABIGO2c4lITPMa59IpRSv1EZrVf10Neocywg1m9QvlVVVT/A4a/fpwdKxSa3FK3aauqqJKhjE1c01+d5P5akY45DueFHUasO1o5Kk27JfnRUJR5ciUM+Q79VYj1Eq3ovdqlQzJ3mjOVal+7bciNaab+uEiJTaIYlzvp/URRF7zoqzoJ82zRLtTsqEo9cCFd23Kvk2XeyI2hPOpZB7yYjWEzQFE7dkpwXtatXibF7p1ITrLdWU8mrS5znjSKzoB0aupOxafjE4fPO8x/Lmq0SmHlcDQAAAABJRU5ErkJggg==";
  const wcOptions = {
    series: [
      {
        type: "wordCloud",
        gridSize: 7,
        sizeRange: [20, 50],
        rotationRange: [0, 0],
        textStyle: {
          fontFamily: "sans-serif",
          fontWeight: "bold",
          color: () => {
            const r = Math.floor(Math.random() * wordCloudColor.length)
            return wordCloudColor[r]
          },
        },
        width: "90%",
        height: "90%",
        data: wordList.value,
      },
      0,
    ],
  }
  wordCloudChart.value.setOption(wcOptions)
}

const loadWordCloudList = async (majorId = null, classId = null) => {
  const res = await wordCloudCondition(
    null,
    null,
    departmentId.value as string,
    majorId,
    classId
  )
  if (res.code === 200) {
    wordList.value = res.data
    console.log(wordList.value)
    if (wordList.value.length) {

    }
  }
}

onMounted(async () => {
  await loadWordCloudList();
}
)
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;

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

  .card {
    background-color: white;
    padding-top: 5px;
    overflow: hidden;
  }

  .bg-purple {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}
</style>
