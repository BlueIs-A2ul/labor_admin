<template>
  <div class="lessonDetail">
    <h1>lessonDetail 页面</h1>
  </div>
</template>

<script setup lang="ts">
import { getRandomCode } from '@/apis/common'
import { sendSignCode } from '@/apis/examine/examine'
import { getLessonDetail, getStudentList, uploadUserToCourse } from '@/apis/lesson'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
// const uploadUrl = `${process.env.VUE_APP_BASE_API}/data/file/upload`
const deadline = ref<number | null>(null)
// TODO 改成具体路径
const defaultCover = ref('string')
const codeDisabledTimer = ref<number | null>(null)
const codeChangeDisabled = ref(false)
const codeTimer = ref<number | null>(null)
const signCode = ref<string | null>(null)
const signStamp = ref(null)
const signCodeVisible = ref(false)
const commentsLoading = ref(false) // 注意：原始代码中可能是 commentsLoading
const detailLoading = ref(true)
const dialogVisible = ref(false)
const qrLoading = ref(false)
const QRDialogVisible = ref(false)
const qrText = ref("")
const qrLogo = ref("")
const qrTimeRange = ref(null)
// TODO 改成具体路径
const defaultQRLogo = ref('string')
const courseId = ref<string | null>(null)
// const defaultCover = ref("https://img2.baidu.com/it/u=3287115334,1498982333&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281")

const qrTextCopy = reactive<{
  courseId: string | null;
  timestamp: string | null;
}>({
  courseId: null,
  timestamp: null,
})

const detail = reactive({
  cover: "",
  id: null,
  title: "",
  semesterId: null,
  numberLimit: null,
  courseManager: null,
  courseLocation: "",
  applicationStart: "",
  applicationEnd: "",
  hostingEnd: "",
  hostingStart: "",
  courseCategory: "",
  pointsRules: "",
  ruleContent: "",
  scoringStandards: "",
  organizer: "",
  undertaker: "",
  introduction: "",
  contact: "",
  attachment: "",
  state: -1,
  dimensionalityInfo: [],
  score: 0,
})

const stuList = ref([])
const stuTotal = ref(0)
const stuTableLoad = ref(false)
const state = ref<string | null>(null)
const progressStatus = ref<string | null>(null)
const percentage = ref(0)
const progressColor = ref("")
const toolTipDisabled = ref(false)

const page = reactive({
  currentPage: 1,
  pageSize: 25,
})

const commentsChoice = ref(0)
const createQRVisible = ref(false)
const isOpenEditStageForm = ref(false)

const status = computed(() => {
  return Number(route.query.status) === detail.state
    ? Number(route.query.status)
    : detail.state
})

const statusInit = async () => {
  try {
    courseId.value = String(route.query.id)
  }
  catch (error) {
    console.log(error)
  }
  qrTextCopy.courseId = courseId.value
  switch (status.value) {
    case 1:
      percentage.value = 25
      progressColor.value = "#69e7ee"
      state.value = '筹备中'
      progressStatus.value = null
      break
    case 2:
      percentage.value = 50
      progressColor.value = "#e6a23c"
      state.value = "报名中"
      progressStatus.value = "warning"
      break
    case 3:
      percentage.value = 75
      progressColor.value = "#13ce66"
      state.value = "进行中"
      progressStatus.value = "success"
      break
    default:
      percentage.value = 100
      progressColor.value = "#f56969"
      state.value = "已结束"
      progressStatus.value = "exception"
      break
  }
  if (courseId.value) {
    await loadLessonDetail()
    await loadStuList()
  }
}

const loadLessonDetail = async () => {
  detailLoading.value = true
  try {
    const res = await getLessonDetail(courseId.value ?? '')
    if (res.code === 200) {
      console.log(res.data)
      Object.assign(detail, res.data)
      if (detail.cover) {
        if (typeof detail.cover === 'string') {
          try {
            detail.cover = JSON.parse(detail.cover)
          } catch (e) {
            ElMessage.error('解析失败')
            detail.cover = {
              url: defaultCover.value
            }
          }
        }

        if (!detail.cover.url) {
          detail.cover.url = defaultCover.value
        }
      } else {
        detail.cover = {
          url: defaultCover.value
        }
      }
    } else {
      ElMessage.error('获取课程详情失败')
      router.back()
    }
  }
  finally {
    detailLoading.value = false
  }
}

const loadStuList = async () => {
  stuTableLoad.value = true
  try {
    const res = await getStudentList(courseId.value ?? '',
      String(page.currentPage),
      String(page.pageSize),
      '1',
      '-2',
    )
    if (res.code === 200) {
      console.log(res.data)
      const { list, total } = res.data
      stuList.value = list
      stuTotal.value = Number(total)
    } else {
      ElMessage.error('获取学生列表失败')
    }
  }
  finally {
    stuTableLoad.value = false
  }
}

const checkToolTip = () => {
  return !toolTipDisabled.value
}

const handleUpload = async (fileURL: string) => {
  try {
    await uploadUserToCourse(Number(courseId.value), fileURL)
    ElMessage.success('上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}

const handleClose = (action: Function) => {
  ElMessageBox.confirm('确认关闭？')
    .then(() => {
      action()
    })
    .catch(_ => {
      ElMessage.info('已取消')
    })
}

const openEvaluateDrawer = () => {
  const dimensionalityInfo = encodeURIComponent(JSON.stringify(detail.dimensionalityInfo))
  router.push({
    name: 'introduction',
    query: {
      id: courseId.value,
      status: detail.state,
      dimensionalityInfo,
      courseScore: detail.score,
    }
  })
  // this.$forceUpdate();
}

const isEllipsis = () => {
  // TODO ref指向具体dom
  // let pHeight = this.$refs.detailInfo.parentNode.offsetHeight;
  // let itsHeight = this.$refs.detailInfo.offsetHeight;
  // this.toolTipDisabled = pHeight > itsHeight;
}

const handleCurrentChange = async (value: number) => {
  page.currentPage = value
  await loadStuList()
}

const progressFormat = (percentage: number) => {
  const status = route.query.status as unknown as number
  switch (status) {
    case 1:
      return '筹备中'
    case 2:
      return '报名中'
    case 3:
      return '进行中'
    default:
      return '已结束'
  }
}

const downloadQr = () => {
  const QRcodeSrc = document.createElement('a')
  // TODO 有具体的指向
  //qrcodeSrc.href = this.$refs.qrCode.$el.src;
  QRcodeSrc.click()
}

const QR_CODE_EXPIRE_TIME = 1000 * 60 * 30 // 30分钟过期时间
const refreshQRCode = () => {
  try {
    qrLoading.value = true
    const timestampNow = new Date().getTime()
    qrTextCopy.timestamp = String(timestampNow + QR_CODE_EXPIRE_TIME)
    qrText.value = JSON.stringify(qrTextCopy)
    qrLoading.value = false
    ElMessage.success('签到二维码已更新')
  } catch (_) {
    qrLoading.value = false
    ElMessage.error('更新二维码失败')
  }
}

const createQRCode = () => {
  const timeTool = new Date()
  const timestampNow = timeTool.getTime()
  QRDialogVisible.value = true
  // 初次打开或者二维码过期 刷新二维码
  try {
    if (qrTextCopy.timestamp === null
      || timestampNow > Number(qrTextCopy.timestamp) * QR_CODE_EXPIRE_TIME) {
      refreshQRCode()
    }
  }
  catch (_) {
    ElMessage.error('更新二维码失败')
  }
}

const refreshCode = async () => {
  // 检查课程ID是否存在，不存在则直接返回
  if (!courseId.value) return

  // 清除已存在的定时器
  if (codeTimer.value !== null) {
    clearInterval(codeTimer.value)
  }
  if (codeDisabledTimer.value !== null) {
    clearInterval(codeDisabledTimer.value)
  }

  // 设置按钮禁用状态和加载状态
  codeChangeDisabled.value = true
  qrLoading.value = true

  // 签到码有效时间半小时
  const newCode = getRandomCode(6)
  const ID_SEND_CODE = route.query.id as string

  try {
    // 发送签到码到服务器
    const res = await sendSignCode(ID_SEND_CODE, newCode, 60 * 30, 1)
    if (res.code === 200) {
      // 更新签到码和截止时间
      signCode.value = newCode
      deadline.value = new Date().getTime() + QR_CODE_EXPIRE_TIME;

      // 设置签到码禁用状态
      setSignCodeDisabledStatus(
        true,
        deadline.value,
        newCode,
      )

      // 设置签到码刷新定时器（30分钟后重新生成）
      codeTimer.value = setInterval(() => {
        refreshCode()
      }, QR_CODE_EXPIRE_TIME)

      // 设置签到码更改禁用状态定时器（15分钟后允许更改）
      codeDisabledTimer.value = setInterval(() => {
        codeChangeDisabled.value = false
        setSignCodeDisabledStatus(
          false,
          new Date().getTime() + QR_CODE_EXPIRE_TIME / 2,
          newCode
        );
      }, QR_CODE_EXPIRE_TIME / 2)

      ElMessage.success('签到码更新成功')
    } else {
      ElMessage.error('更新签到码失败')
    }
  } catch (_) {
    // 处理网络异常情况
    ElMessage.error('网络异常, 签到码同步更新失败, 请稍后重试')
  } finally {
    // 关闭加载状态
    qrLoading.value = false
  }
}

const createSignCode = () => {
  signCodeVisible.value = true
  if (!codeTimer.value) {
    refreshCode()
  }
}

const getSignCodeDisabledStatus = async () => {
  // 尝试从本地存储中读取指定课程ID对应的签到码信息
  const t = localStorage.getItem(`signCode?courseid=${route.query.id}`)

  if (typeof t === 'string') {
    // 解析本地存储中的数据
    const res = JSON.parse(t)
    const now = new Date().getTime()

    // 判断签到码是否已过期且课程状态大于3，则清除该缓存项
    if (
      route.query.status !== null &&
      Number(route.query.status) > 3 &&
      now > res.expireTime * QR_CODE_EXPIRE_TIME
    ) {
      localStorage.removeItem(`signCode?courseid=${route.query.id}`)
      return
    }

    // 若当前时间未超过签到码的有效期，则使用缓存的数据进行初始化
    if (now < res.expireTime) {
      signCode.value = res.code
      deadline.value = res.expireTime

      // 设置定时器以刷新签到码
      if (!codeTimer.value) {
        codeTimer.value = setInterval(() => {
          refreshCode()
        }, res.expireTime - now)
      }

      // 设置定时器以更新签到码的启用/禁用状态
      if (!codeDisabledTimer.value) {
        codeDisabledTimer.value = setInterval(() => {
          setSignCodeDisabledStatus(
            false,
            new Date().getTime() + res.expireTime - now
          )
        }, res.expireTime - now)
      }
    }

    // 根据剩余有效时间决定是否禁用签到码变更按钮
    codeChangeDisabled.value = res.expireTime - now > QR_CODE_EXPIRE_TIME / 2
  } else {
    // 没有找到本地存储记录，尝试向服务器发送请求创建新的签到码
    try {
      // 发送签到码请求，并传递课程ID和空字符串作为参数
      const res = await sendSignCode(String(route.query.id), '')
      const { data } = res
      console.log(data)

      // 如果返回的时间大于0，则处理签到码相关信息
      if (data.time > 0) {
        const objT = {
          code: data.code,
          courseId: route.query.id,
          isDisabled: data.time <= 1500,
          expireTime: new Date().getTime() + data.time,
        }

        // 将新获取的签到码信息保存至本地存储
        localStorage.setItem(
          `signCode?courseid=${route.query.id}`,
          JSON.stringify(objT)
        )

        codeChangeDisabled.value = objT.isDisabled

        // 启动定时器刷新签到码
        codeTimer.value = setInterval(() => {
          refreshCode()
        }, 1000 * data.time)

        // 如果签到码初始即被标记为禁用，则设置延时任务恢复可用性
        if (codeChangeDisabled.value) {
          setInterval(() => {
            setSignCodeDisabledStatus(
              false,
              new Date().getTime() + 1000 * (data.time - 1500),
              signCode.value
            )
          }, 1000 * (data.time - 1500))
        }

        signCode.value = (data.code as string) ?? null
      } else {
        // 时间无效时设为不禁用状态
        codeChangeDisabled.value = false
      }
    } catch (_) {
      // 请求失败提示错误消息
      ElMessage.error('创建签到码失败')
    }
  }
}

const openEditStageForm = () => {
  isOpenEditStageForm.value = true
}

const handleStageFormClose = () => {
  isOpenEditStageForm.value = false
}

onMounted(() => {
  // TODO vue2版本这里有一个判断  if (!this.$route.meta.showExam)
  statusInit()
  getSignCodeDisabledStatus()
})

onBeforeUnmount(() => {
  if (codeTimer.value != null) {
    clearInterval(codeTimer.value)
  }
  if (codeDisabledTimer.value != null) {
    clearInterval(codeDisabledTimer.value)
  }
})

const setSignCodeDisabledStatus = (status: boolean, deadline: number, code: string | null = null) => {
  codeChangeDisabled.value = status
  const obj = {
    code,
    courseId: route.query.id,
    isDisabled: status,
    expireTime: deadline,
  }
  localStorage.setItem(
    `signCode?courseid=${route.query.id}`,
    JSON.stringify(obj),
  )
}
</script>

<style lang="scss" scoped>
:deep() {
  .qrDialog {
    .el-dialog {
      min-width: 240px !important;
    }
  }
}

.el-dialog__wrapper {
  min-width: 100px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.texts_ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 250px;
  -webkit-line-clamp: 9;
  text-overflow: ellipsis;
}

.texts {
  font-size: 0.7em;
  color: rgba(70, 69, 69, 0.719);
  line-height: normal;
  word-break: break-all;
  letter-spacing: 1px;
}

.container {
  width: 100%;
  height: 100%;
  min-width: 686.66px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  padding: 30px 50px;
  margin: 0;

  .mainInfo {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .cover {
      width: 66%;
      height: 80vh;
      min-height: 400px;

      .mask {
        position: relative;
        width: 100%;
        height: 80vh;
        min-height: 400px;
        top: -103%;
        background: linear-gradient(to top, #00000098, transparent);

        .status {
          position: absolute;
          left: 80%;
          top: 3%;
          min-height: 130px;
          min-width: 130px;

          div {
            position: relative;
            color: white;
            font-size: 25px;
            font-weight: bold;
            letter-spacing: 2px;
            left: 18%;
            bottom: 67px;
            transform: rotate(27deg);
          }
        }

        .baseInfo {
          color: white;
          position: relative;
          top: 70%;
          left: 5%;

          .name_and_provider {
            ul>li:first-child {
              font-size: 36px;
              font-weight: 700;
              letter-spacing: 1px;
              margin-bottom: 14px;
              line-height: normal;
              word-break: break-all;
            }

            ul>li:nth-child(2) {
              font-size: 18px;
              font-weight: 500;
            }

            ul>li:last-child {
              font-size: 18px;
              font-weight: 600;
              margin-top: 8px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }

    .rightCard {
      width: 32%;
      height: 80vh;
      min-height: 580px;
      display: flex;
      flex-direction: column;
      cursor: default;

      // &::-webkit-scrollbar {
      //   width: 6px;
      //   height: 6px;
      // }
      // &::-webkit-scrollbar-thumb {
      //   border-radius: 3px;
      //   background-color: #1a1818;
      // }
      // &::-webkit-scrollbar-track-piece {
      //   background-color: #ccc;
      // }
      div {
        width: 100%;
        height: 15%;
        padding: 5px;
        // overflow: hidden;

        h3 {
          margin-left: 10%;
          position: relative;
          top: -8px;
        }

        ul>li:nth-child(2) {
          font-size: 1.5em;
          font-weight: 700;
          position: relative;
          top: -12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .detailInfo {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 20px;
    width: 100%;
    height: auto;

    .card {
      width: 32%;
      height: 30vh;
      min-height: 200px;
      max-height: 290px;
      padding: 20px;

      .progress {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 25px;
      }
    }
  }

  .participantsInfo {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;

    .list_name {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 30px;
      margin-top: 15px;
      width: 100%;
      height: 50px;
      font-size: 20px;
      font-weight: 700;
    }

    .stuList {
      width: 32%;
      height: 620px;
      display: flex;
      flex-direction: column;
    }

    .comments {
      width: 66%;
      height: auto;
      min-height: 400px;
      padding-bottom: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .comments_guide {
        display: flex;
        flex-direction: row;
        padding-left: 40px;
        padding-top: 30px;

        div {
          margin-right: 10px;
          font-size: 20px;
          font-weight: bold;
          transition: all 0.15s ease-in;
          cursor: pointer;
        }
      }
    }
  }
}

.qrBox {
  display: flex;
  flex-direction: column;

  .qrInfo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .signCode {
      font-size: 60px;
      margin-bottom: 20px;
      letter-spacing: 5px;
    }

    ::v-deep {
      .el-statistic .con {
        font-size: 20px;
        display: flex;
        align-items: center;
        margin-top: 30px;

        .number {
          font-size: 30px;
        }
      }
    }
  }

  .qrTools {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.rounded_rectangle {
  border-radius: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.01), 0 0 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: solid 4px transparent;
  transition: all 0.2s ease-in;

  &:hover {
    border-color: #d1d7fff2;
  }
}
</style>
