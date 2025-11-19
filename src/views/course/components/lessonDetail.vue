<template>
  <div>
    <div class="container" v-loading="detailLoading" v-if="!$route.meta.showEvaluate">
      <div class="mainInfo">
        <div class="cover rounded_rectangle">
          <el-image :src="detail.cover.url || defaultCover" alt="活动封面" style="width: 100%; height: inherit"
            fit="cover" />
          <div class="mask">
            <div class="baseInfo">
              <div class="name_and_provider">
                <ul style="margin: 0; padding: 0; list-style: none">
                  <li>{{ detail.title }}</li>
                  <li>活动联系方式: {{ detail.contact }}</li>
                  <li>
                    举办单位: &nbsp; {{ detail.organizer }}&nbsp;
                    <span style="margin-left: 20px">承办单位: {{ detail.undertaker }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="rightCard rounded_rectangle">
          <div class="">
            <ul>
              <li>
                <h3>二课分类:</h3>
              </li>
              <li>
                <span>{{ detail.courseCategory }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <ul>
              <li>
                <h3>名额限制:</h3>
              </li>
              <li>
                <span style="color: red">{{ detail.numberLimit }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <ul>
              <li>
                <h3>学期:</h3>
              </li>
              <li>
                <span>{{ detail.semester }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <ul>
              <li>
                <h3>报名时间:</h3>
              </li>
              <li>
                <span style="font-size: 0.6em">{{ detail.applicationStart }} ~
                  {{ detail.applicationEnd }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <ul>
              <li>
                <h3>活动时间:</h3>
              </li>
              <li>
                <span style="font-size: 0.6em">{{ detail.hostingStart }} ~ {{ detail.hostingEnd }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <ul>
              <li>
                <h3>操作:</h3>
              </li>
              <li>
                <span style="font-size: 0.5em">
                  <el-button v-permission="['evaluatePage']" v-debounce type="primary"
                    @click="openEvaluateDrawer">教师考评</el-button>
                  <!--            todo-->
                  <el-button v-permission="[
                    'curriculum.course.add',
                    'curriculum.course.update',
                  ]" v-debounce type="success" :disabled="detail.state > 3"
                    @click="dialogVisible = true">导入名单</el-button>
                  <!--  由于移动端扫码需要https而现在没有, 所以只能先把扫码功能搁置了, 后面https域名下来了再开启扫码功能
                        <el-button type="warning" :disabled="status<=2" @click="createQRCode">签到二维码</el-button>
                    -->
                  <el-button v-permission="[
                    'curriculum.signUp',
                    'curriculum.signUp.update',
                  ]" :disabled="detail.state < 2" type="warning" @click="createSignCode">签到指令码</el-button>
                  <el-button v-permission="[
                    'curriculum.course.student',
                    'curriculum.course.student.get',
                  ]" type="warning" v-if="detail.state > 3" @click="openEditStageForm">导出结果</el-button>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="detailInfo">
        <div class="rounded_rectangle card">
          <div style="font-weight: bolder; margin-left: 20px">详细信息</div>
          <el-tooltip class="item" effect="light" :disabled="toolTipDisabled" placement="top-start">
            <div slot="content" class="texts" style="width: 300px; height: auto">
              {{ detail.introduction }}
            </div>
            <div @mouseover="isEllipsis" @mouseleave="checkToolTip" style="padding: 10px 10px 10px 20px">
              <div ref="detailInfo" class="texts texts_ellipsis">
                {{ detail.introduction }}
              </div>
            </div>
          </el-tooltip>
        </div>

        <div class="rounded_rectangle card">
          <div style="font-weight: bolder; margin-left: 20px">课程进度</div>
          <div>
            <el-progress class="progress" type="circle" :stroke-width="15" :width="130" :percentage="percentage"
              :color="progressColor" :format="progressFormat">
            </el-progress>
          </div>
        </div>

        <div class="rounded_rectangle card">
          <div style="font-weight: bolder; margin-left: 20px">加分规则</div>
          <div style="padding: 10px 10px 10px 20px">
            <div class="texts">{{ detail.scoringStandards }}</div>
          </div>
        </div>
      </div>
      <div class="detailInfo">
        <div class="rounded_rectangle card" style="
            width: 32%;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
          <CourseStatistics :courseId="courseId || ''" :type="1" title="自我评价"></CourseStatistics>
        </div>
        <div class="rounded_rectangle card" style="
            width: 32%;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
          <CourseStatistics :courseId="courseId || ''" :type="0" title="课程评价"></CourseStatistics>
        </div>
        <div class="rounded_rectangle card" style="
            width: 32%;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
          <CourseStatistics :courseId="courseId || ''" :type="2" title="教师考评"></CourseStatistics>
        </div>
      </div>

      <div class="participantsInfo">
        <div class="comments rounded_rectangle" v-loading="commentsLoading">
          <div class="comments_guide">
            <div>课程评价</div>
          </div>
          <CommentList :id="courseId ?? ''" />
        </div>
        <div class="stuList rounded_rectangle" v-permission="['curriculum.course.student']">
          <div class="list_name">
            <i class="el-icon-user-solid" style="margin-right: 10px"></i>
            报名列表
          </div>
          <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              height: 100%;
            ">
            <el-table v-loading="stuTableLoad" :data="stuList" stripe height="100%" size="medium" style="width: 100%">
              <el-table-column prop="studentId" label="学号" align="center" min-width="160">
              </el-table-column>
              <el-table-column prop="name" label="姓名" align="center" min-width="175">
              </el-table-column>
            </el-table>
            <div style="height: 10%; display: flex; align-items: center">
              <el-pagination small @current-change="handleCurrentChange" :current-page.sync="page.currentPage"
                :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="stuTotal">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <el-dialog class="qrDialog" title="学生名单上传" :visible.sync="dialogVisible" :close-on-click-modal="false"
        :close-on-press-escape="false" width="30%" :before-close="handleClose" center>
        <div style="display: flex; flex-direction: column; align-items: center">
          <el-upload drag :action="uploadUrl" :before-upload="handleUpload" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" style="font-size: 15px" slot="tip">
              学生信息应包括: <strong>学号、学生姓名</strong>
            </div>
            <div class="el-upload__tip" style="color: red; margin-top: 10px" slot="tip">
              只能上传jpg/png文件, 且不超过500kb
            </div>
          </el-upload>
          <span slot="footer" class="dialog-footer" style="
              width: 150px;
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            ">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-debounce type="success" @click="dialogVisible = false">确定</el-button>
          </span>
        </div>
      </el-dialog>

      <el-dialog v-if="false" class="qrDialog" :append-to-body="true" title="签到二维码" :close-on-click-modal="false"
        :close-on-press-escape="false" width="25%" :visible.sync="QRDialogVisible">
        <div class="qrBox">
          <div class="qrInfo" v-loading="qrLoading">
            <vue-qr ref="qrCode" :text="qrText" :correctLevel="3" backgroundColor="white" colorLight="white"
              colorDark="black" :logoSrc="defaultQRLogo" :logoMargin="5" :size="200" />
            <div style="color: red">本次有效期30分钟, 请及时使用</div>
          </div>
          <div class="qrTools">
            <el-button v-debounce @click="downloadQr"> 下载二维码 </el-button>
            <el-button v-debounce @click="refreshQRCode" type="success">
              刷新二维码
            </el-button>
            <el-button type="danger" @click="QRDialogVisible = false">
              取消
            </el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog class="qrDialog" :append-to-body="true" title="签到指令码" v-loading="qrLoading" width="25%"
        :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="signCodeVisible">
        <div class="qrBox">
          <div class="qrInfo" v-loading="qrLoading">
            <div class="signCode">{{ signCode }}</div>
            <div style="color: red">
              本次有效期30分钟, 且15分钟内不可重复生成, 请及时使用
            </div>
            <el-statistic ref="statistic" format="mm:ss" :value="deadline" time-indices>
              <template slot="suffix">后签到码失效</template>
            </el-statistic>
          </div>
          <div class="qrTools">
            <el-button @click="refreshCode" :disabled="detail.state > 2 && codeChangeDisabled" type="success">
              刷新签到码
            </el-button>
            <el-button type="danger" @click="signCodeVisible = false">
              关闭
            </el-button>
          </div>
        </div>
      </el-dialog>
      <stage-form v-if="detail.state == 4" :is-open="isOpenEditStageForm" :course-id="courseId"
        :course-name="detail.title" @onClose="handleStageFormClose" />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { getRandomCode } from '@/apis/common'
import { sendSignCode } from '@/apis/examine/examine'
import { getLessonDetail, getStudentList, uploadUserToCourse } from '@/apis/lesson'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { uploadUrlInLessonDetail as uploadUrl } from '@/apis/common'
import CourseStatistics from './CourseStatistics.vue'
import CommentList from '@/components/comments/CommentList.vue'

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
  semester: '',
  cover: {
    url: '',
    height: 0,
    width: 0,
  },
  id: null,
  title: '',
  semesterId: null,
  numberLimit: null,
  courseManager: null,
  courseLocation: '',
  applicationStart: '',
  applicationEnd: '',
  hostingEnd: '',
  hostingStart: '',
  courseCategory: '',
  pointsRules: '',
  ruleContent: '',
  scoringStandards: '',
  organizer: '',
  undertaker: '',
  introduction: '',
  contact: '',
  attachment: '',
  state: -1,
  dimensionalityInfo: [],
  score: 0,
})

const stuList = ref<Student[]>([])
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
  catch (_) {
    ElMessage.error('')
  }
  qrTextCopy.courseId = courseId.value
  switch (status.value) {
    case 1:
      percentage.value = 25
      progressColor.value = '#69e7ee'
      state.value = '筹备中'
      progressStatus.value = null
      break
    case 2:
      percentage.value = 50
      progressColor.value = '#e6a23c'
      state.value = '报名中'
      progressStatus.value = 'warning'
      break
    case 3:
      percentage.value = 75
      progressColor.value = '#13ce66'
      state.value = '进行中'
      progressStatus.value = 'success'
      break
    default:
      percentage.value = 100
      progressColor.value = '#f56969'
      state.value = '已结束'
      progressStatus.value = 'exception'
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
      Object.assign(detail, res.data)
      if (detail.cover) {
        if (typeof detail.cover === 'string') {
          // 如果cover返回一个字符串
          try {
            detail.cover = JSON.parse(detail.cover)
          } catch (e) {
            ElMessage.error('解析失败')
            // 设置默认值
            detail.cover = {
              url: defaultCover.value,
              width: 0,
              height: 0
            }
          }
        }

        if (typeof detail.cover === 'object' && detail.cover !== null) {
          detail.cover = {
            url: detail.cover.url || defaultCover.value,
            width: detail.cover.width || 0,
            height: detail.cover.height || 0
          }
        }

        if (!detail.cover.url) {
          detail.cover.url = defaultCover.value
        }
      } else {
        detail.cover = {
          url: defaultCover.value,
          height: 0,
          width: 0
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
      const { list, total } = res.data as { list: Student[]; total: string }
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
      const res = await sendSignCode(String(route.query.id))
      const { data } = res as unknown as { data: { time: number, code?: string } }
      console.log('getSignCodeDisabledStatus', data)

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
      console.log('getSignCodeDisabledStatus', _)
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

interface Contact {
  QQ: string;
  微信: string;
  电话: string;
  邮箱: string;
}

interface Student {
  avatar: string;
  userId: string;
  studentId: string;
  name: string;
  pass: number;
  evaluate: number;
  department: string;
  major: string;
  points: string | null;
  campus: string;
  currentGrade: string;
  sex: number;
  enrollmentYear: string;
  contact: Contact;
}

interface StudentListResponse {
  selfEvaluateCount: string;
  total: string;
  evaluateCount: string;
  list: Student[];
  signUpCount: string;
  passCount: string;
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
  line-clamp: 9;
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

    :deep() {
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
