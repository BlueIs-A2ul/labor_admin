<template>
  <div class="index">
    <h1>index 页面</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import { useSemesterStore } from '@/stores/semester'
import { useUserStore } from '@/stores/user'
import { deepClone } from '@/utils'
import { delLesson, selectCoursePage } from '@/apis/lesson'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllSemesters } from '@/apis/semesterAndObjectives/semester'
import type { SemesterDataItem } from '@/types'
import { fa, id } from 'element-plus/es/locales.mjs'
import { useRouter } from 'vue-router'

const router = useRouter()
const semesterStore = useSemesterStore()
const userStore = useUserStore()
const departmentStore = useDepartmentStore()

const keyWords = ref('')
const loading = ref(false)
const attachmentList = ref([])
const semesterTime = ref('')
const whichSemester = ref('')
const dialogVisible = ref(false)
const temp = ref<any>([])
const chosenCourseState = ref<any[] | null>([])
const pageParams = ref({
  pageNum: 1,
  pageSize: 20,
})
const category = ref([
  '公益服务劳动',
  '劳动理论学习',
  '日常生活劳动',
  '生产顶岗劳动',
  '其他方式劳动',
  '“三下乡”社会实践',
])
const chosenCategory = ref('')
const showLessons = ref<CourseItem[]>([])
const lessonsTotal = ref(0)
const pageTable = ref([])
const isOpenAddLesson = ref(false)
const isOpenModify = ref(false)
const chosenState = ref(0)
const courseId = ref('')
const departmentLimit = ref<string[]>([])
const gardeLimit = ref([])
const chosenSemester = ref(null)
const semesterList = ref<SemesterListItem[]>([])

//表格数据
const courseForm = ref()

const semesterId = computed(() => semesterStore.id)
const userDepartmentId = computed(() => userStore.departmentId)
const userDepartmentName = computed(() => userStore.departmentName)
const userPermissions = computed(() => userStore.userPermissions)
const department = computed(() => departmentStore.department)
const selectDepartment = computed(() => {
  let res: { text: string, value: string }[] = []
  if (department.value.length > 0) {
    const departmentList = deepClone(department.value)
    res = departmentList.filter(e =>
      Number(e.id) > 1
    ).map(e => {
      return {
        text: e.departmentName,
        value: e.id
      }
    })
  }
  return res
})

watch(() => isOpenAddLesson.value, (newValue) => {
  if (!Boolean(newValue)) {
    setTimeout(() => {
      semesterTime.value = ''
      whichSemester.value = ''
    }, 400)
  }
})

const search = async () => {
  pageParams.value.pageNum = 1
  await loadList()
}

const reset = async () => {
  keyWords.value = ''
  departmentLimit.value = userDepartmentId.value ? [userDepartmentId.value] : []
  chosenCategory.value = ''
  chosenState.value = 0
  await search()
}

const clearForm = () => {
  // TODO this.$refs.courseForm.clearFormContext();
}

const filterChange = async (value) => {
  const type = Object.keys(value)[0]
  if (type === 'chosenCategory') {
    let tag = value['chosenCategory'][0]
    tag = typeof tag === 'undefined' ? null : tag
    if (chosenCategory.value !== tag) {
      chosenCategory.value = tag
    }
  } else if (type === 'status') {
    const tag = value['status'][0]
    if (chosenState.value !== tag) {
      chosenState.value = tag
    }
  }
  pageParams.value.pageNum = 1
  await loadList()
}

const handleAddLessonSuccess = async () => {
  await loadList()
  isOpenAddLesson.value = false
  isOpenModify.value = false
}

const handleFormClose = () => {
  isOpenAddLesson.value = false
  setTimeout(() => {
    isOpenModify.value = false
  }, 300)
}

const openUpdateLesson = <T extends { id: string, state: any }>(row: T) => {
  courseId.value = row.id
  chosenCourseState.value = row.state
  isOpenAddLesson.value = true
  isOpenModify.value = true
}

const deleteLesson = async (id: string) => {
  const resBox = await ElMessageBox.confirm('确定删除该课程？', '警告', {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
  if (resBox === 'confirm') {
    try {
      const res = await delLesson(id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        if (showLessons.value.length === 1 && pageParams.value.pageNum > 1) {
          pageParams.value.pageNum--
        }
        await loadList()
      }
    }
    catch (_) {
      ElMessage.error('删除失败请重试')
    }
  } else {
    ElMessage.info('已取消')
  }
}

const openAddLesson = () => {
  chosenCourseState.value = null
  isOpenAddLesson.value = true
  isOpenModify.value = false
}

const addLesson = () => {
  const semester = String(semesterTime.value) + String(whichSemester.value)
  let keys = Object.keys()
}

const seeDetail = (id: string, state: string) => {
  router.push({
    path: '/nested/lessonsManage/lessonDetail',
    query: { id: id, state: state }
  })
}

const examine = (id: string) => {
  router.push({
    path: '/nested/examine/examinePage',
    query: { id: id }
  })
}

const choosePermission = () => {
  // TODO this.isChoosePermission = !this.isChoosePermission;
}

const handleCurrentChange = (newPage: number) => {
  pageParams.value.pageNum = newPage
  loadList()
}

const handleSizeChange = (newSize: number) => {
  pageParams.value.pageSize = newSize
  loadList()
}

const handleChosenDepartmentChange = (val: string) => {
  if (val.includes('-1')) {
    departmentLimit.value = ['-1']
    loadList(true)
  }
}

const chooseNewSemester = (newId: string) => {
  if (newId !== semesterId.value) {
    semesterStore.setId(newId)
    loadList()
  }
}

const loadList = async (searchAll: boolean = false) => {
  loading.value = true
  try {
    const res = await selectCoursePage({
      title: keyWords.value,
      category: chosenCategory.value,
      pageNum: pageParams.value.pageNum,
      pageSize: pageParams.value.pageSize,
      start: null,
      end: null,
      semesterId: Number(semesterId.value),
      state: chosenState.value,
      reviewed: 0,
      //@ts-ignore 呃虽然和接口文档不一致，但是这么用是可以的
      departmentLimit: searchAll ? [] : departmentLimit.value,
      gradeLimit: gardeLimit.value,
    })
    if (res.code === 200) {
      console.log(res.data)
      const { list, total } = res.data as unknown as {
        list: CourseItem[];
        total: number;
      }
      list.forEach(e => {
        const { departmentLimit, gradeLimit } = e
        e.departmentLimit = [
          ...new Set(
            (departmentLimit || []).filter(item => item !== '暂无学院')
          )
        ]
        e.gradeLimit = [...new Set(gradeLimit)]
      })
      showLessons.value = list
      lessonsTotal.value = Number(total)
    } else {
      ElMessage.error('获取列表失败')
    }
  }
  catch (_) {
    ElMessage.error('获取列表失败')
  }
  finally {
    loading.value = false
  }
}

const getSemesterList = async () => {
  const res = await getAllSemesters()
  if (res.code === 200) {
    const { data } = res as unknown as { data: SemesterDataItem[] }
    const index = data.findIndex(e => e.id === semesterId.value)
    semesterList.value.push({
      label: '当前学期',
      options: [
        { value: semesterId.value || '', label: data[index].semesterName }
      ]
    })
    data.splice(index, 1)
    if (data.length > 0) {
      const others = data.map(e => {
        return {
          value: e.id,
          label: e.semesterName
        }
      })
      semesterList.value.push({
        label: '其他学期',
        options: others
      })
    }
  } else {
    ElMessage.error('获取学期列表失败')
  }
}

onMounted(async () => {
  await departmentStore.init()
  departmentLimit.value = userDepartmentId.value ? [userDepartmentId.value] : []
  await semesterStore.getSemesterInfo()
  await loadList()
  await getSemesterList()
})

interface CourseItem {
  state: number
  id: string
  cover: {
    url: string
    width: number
    height: number
  }
  title: string
  semester: null | string
  numberLimit: number
  courseManager: string
  courseLocation: string
  applicationStart: string
  applicationEnd: string
  hostingEnd: string
  hostingStart: string
  courseCategory: string
  score: number
  departmentLimit: string[]
  gradeLimit: string[]
  dimensionalityInfo: null | string
  pointsRules: string
  ruleContent: string
  scoringStandards: string
  organizer: string
  undertaker: string
  introduction: string
  contact: string
  attachment: string
  isEvaluate: number
  isSignUp: null | number
  signUpCount: null | number
  passCount: null | number
  selfEvaluationCount: null | number
  evaluationCount: null | number
  code: null | string
}

interface SemesterListItem {
  label: string
  options: {
    value: string
    label: string
  }[]
}
</script>

<style lang="scss" scoped>
:deep() {
  .el-input__inner {
    border-radius: 8px;
  }

  .el-input__suffix {
    display: flex;
    align-items: center;
  }

  .el-button {
    letter-spacing: 1px;
    padding: 10px 13px 10px 13px;
  }

  .el-input {
    input {
      height: 30px;
    }
  }

  #buttons {
    .el-button {
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
    }
  }

  .datePicker {
    font-size: 13px;

    .el-input input {
      padding-right: 5px;
    }
  }

  .el-dialog {
    min-width: 759.6px;
  }

  .el-dialog__body {
    padding-bottom: 10px;
  }

  .el-dialog {
    min-width: 1200px;
  }

  #popup {
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .el-col-11 {
    width: 40.833%;
  }

  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .uploadCover {
    .el-upload-list__item {
      transition: none;
      width: 100px;
      height: 100px;
    }
  }

  .uploadAttachment {
    .el-upload-list__item {
      width: auto !important;
      height: auto !important;
    }
  }
}

.app-container {
  .toolBar {
    height: 60px;
    padding: 5px 5% 5px 10%;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.25s ease-in;

    &:hover {
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
    }

    #searchBar {
      width: 300px;
      display: flex;
      flex-direction: row;

      #keyWords {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 90%;
        color: #838383;
        margin-left: -5rem;
      }
    }

    #buttons {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 12%;
      height: 30px;
    }
  }

  .searchBar:hover {
    box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
  }

  #main {
    margin-top: 10px;
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0.5% 20px 0.5%;
    background-color: #ffffff;
    transition: box-shadow 0.25s ease-in;

    div {
      margin-bottom: 10px;
    }

    #roleTable {
      width: 100%;
      height: 85%;

      .tools {
        width: 13vw;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    #pageChange {
      margin-top: 20px;
    }
  }

  #main:hover {
    box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
  }

  #rolePermission {
    padding: 2px 0px 2px 15px;
    height: auto;
    min-height: 35px;
    width: 36.5vw;
    min-width: 560.64px;
    border-radius: 8px;
    position: relative;
    margin-left: -120px !important;
    border: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    flex-direction: row;
    transition: border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    #chosenPermisssionsList {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 95%;
    }
  }

  #rolePermission:hover {
    border-color: #c0c4cc;
    cursor: pointer;
  }

  #triangle {
    position: relative;
    display: inline-block;
    width: 0px;
    height: 0px;
    top: 10px;
    right: 45%;
    z-index: 10;
    border-style: solid;
    border-width: 10px;
    border-color: transparent;
    box-shadow: 2px -2px 2px rgba(0, 0, 0, 0.07);
    transform: rotate(-45deg);
    background-color: white;
  }

  #isConfirm {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;

    i {
      margin-right: 20px;
      font-size: 1.5em;
      font-weight: 800;
    }

    i:hover {
      cursor: pointer;
    }

    .close-icon {
      color: #fd6e60;
    }

    .confirm-icon {
      color: #11d757;
    }
  }

  .chosenPermissionsList {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
  }
}

.detailTag:hover {
  cursor: pointer;
  color: #5b9eec;
}

.flex_center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
