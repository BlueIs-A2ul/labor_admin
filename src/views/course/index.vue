<template>
  <div class="app-container">
    <div v-if="$route.meta.showFather">
      <div class="toolBar">
        <div id="searchBar">
          <div id="keyWords">
            <span style="width: 30%">课程名:&nbsp;</span>
            <el-input v-model="keyWords" style="
                margin-left: -0rem;
                width: 180px;
                display: flex;
                align-items: center;
              " placeholder="需要查询的课程" />
          </div>
        </div>

        <div v-if="userPermissions.includes('*')" style="width: 400px">
          <span style="color: #5a5e66; width: 30%">限制学院:&nbsp;</span>
          <el-select multiple :multiple-limit="5" v-model="departmentLimit" style="width: 80%" collapse-tags filterable
            clearable placeholder="选择学院" @change="handleChosenDepartmentChange">
            <el-option v-for="item in selectDepartment" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </div>
        <div v-permission="['user.student.get']" class="searchSemester">
          查看:
          <el-select v-model="chosenSemester" placeholder="选择学期查看数据" size="small" @change="chooseNewSemester">
            <el-option-group v-for="(group, index) in semesterList" :key="index" :label="group.label">
              <el-option v-for="(item, index) in group.options" :key="index" :label="item.label" :value="item.value" />
            </el-option-group>
          </el-select>
        </div>
        <div id="buttons">
          <el-button @click="reset">重置</el-button>
          <el-button v-debounce type="primary" @click="search">搜索</el-button>
        </div>
        <div class="guideButtons" style="display: flex; justify-content: space-around">
          <el-button v-permission="['curriculum.course.add']" v-debounce type="primary" :icon="CirclePlus"
            @click="openAddLesson">新增课程</el-button>
        </div>
      </div>

      <div id="main" v-loading="loading">
        <div id="roleTable">
          <el-table id="mainArea" :row-style="{ minHeight: 50 + 'px', height: 'auto' }"
            :cell-style="{ padding: 8 + 'px' }" :data="showLessons" stripe height="100%" style="width: 100%"
            @filter-change="filterChange">
            <el-table-column label="序号" min-width="40" align="center">
              <template #default="scope">
                <div>
                  {{ scope.$index + 1 }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="课程名称" min-width="120" align="center" />
            <el-table-column prop="courseCategory" label="分类" min-width="60" align="center" :filter-multiple="false"
              column-key="chosenCategory" :filters="[
                { text: '日常生活劳动', value: '日常生活劳动' },
                { text: '公益服务劳动', value: '公益服务劳动' },
                { text: '生产顶岗劳动', value: '生产顶岗劳动' },
                { text: '劳动理论学习', value: '劳动理论学习' },
                { text: '其他方式劳动', value: '其他方式劳动' },
              ]" />
            <el-table-column label="限制学院" width="100" align="center">
              <template #default="scope">
                <el-popover v-if="
                  scope.row.departmentLimit &&
                  scope.row.departmentLimit.length
                " placement="top-start" title="以下学院可参加课程" width="300" trigger="click"
                  :content="scope.row.departmentLimit.join('、')">
                  <template #reference>
                    <el-button>查看</el-button>
                  </template>
                </el-popover>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="限制年级" width="100" align="center">
              <template #default="scope">
                <el-popover v-if="scope.row.gradeLimit && scope.row.gradeLimit.length" placement="top-start"
                  title="以下年级可参加课程" width="300" trigger="click" :content="scope.row.gradeLimit.join('、')">
                  <template #reference>
                    <el-button>查看</el-button>
                  </template>
                </el-popover>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="40" column-key="status" :filter-multiple="false"
              :filters="[
                { text: '筹备中', value: 1 },
                { text: '报名中', value: 2 },
                { text: '审核中', value: 5 },
                { text: '进行中', value: 3 },
                { text: '已结束', value: 4 },
              ]">
              <template #default="scope">
                <el-tag v-if="scope.row.state == 1" type="warning">筹备中</el-tag>
                <el-tag v-else-if="scope.row.state == 2" type="primary">报名中</el-tag>
                <el-tag v-else-if="scope.row.state == 3" type="success">进行中</el-tag>
                <el-tag v-else-if="scope.row.state == 4" type="info">已结束</el-tag>
                <el-tag v-else-if="scope.row.state == 5" type="danger">审核中</el-tag>
                <el-tag v-else type="danger">未知状态</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="二课分数" prop="score" align="center" width="80" />
            <el-table-column label="主办单位" prop="organizer" align="center" />
            <el-table-column label="承办单位" prop="undertaker" align="center" />
            <el-table-column v-permission="[
              'curriculum.course',
              'curriculum.course.add',
              'curriculum.course.update',
              'curriculum.course.delete',
            ]" label="操作" prop="id" min-width="120" align="center">
              <!-- v-if权限 -->
              <template #default="scope">
                <div class="tools">
                  <template v-if="scope.row.state !== 4">
                    <el-button v-if="
                      scope.row.numberLimit > scope.row.passCount ||
                      scope.row.numberLimit == 0
                    " v-permission="[
                      'curriculum.signUp.get',
                      'curriculum.signUp.add',
                      'curriculum.signUp.update',
                      'curriculum.signUp.delete',
                    ]" :disabled="scope.row.state > 3" v-debounce type="text" style="color: #e6a23c"
                      @click="examine(scope.row.id)" icon="el-icon-s-check">
                      审核
                    </el-button>
                    <el-button v-else v-permission="[
                      'curriculum.signUp.get',
                      'curriculum.signUp.add',
                      'curriculum.signUp.update',
                      'curriculum.signUp.delete',
                    ]" v-debounce type="text" style="color: #ff2727" icon="el-icon-s-check" :disabled="true">
                      满员
                    </el-button>
                  </template>
                  <template v-if="scope.row.state <= 2">
                    <el-button v-permission="['curriculum.course.update']" v-debounce type="text" style="color: #409eff"
                      icon="el-icon-edit-outline" @click="openUpdateLesson(scope.row)">
                      编辑
                    </el-button>
                    <el-button v-permission="['curriculum.course.delete']" v-debounce :disabled="scope.row.state > 2"
                      style="color: #f56c6c" type="text" icon="el-icon-delete" @click="delLesson(scope.row.id)">
                      删除
                    </el-button>
                  </template>
                </div>
                <!-- <span v-else>只能操作当前账号创建的课程</span> -->
              </template>
            </el-table-column>

            <el-table-column label="详细信息" prop="id" width="120" align="center" v-permission="['router.coursesManage']">
              <template #default="scope">
                <el-icon class="detailTag" style="font-size: 21px" size="large"
                  @click="seeDetail(scope.row.id, scope.row.state)">
                  <Tickets />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div id="pageChange">
          <el-pagination :current-page.sync="pageParams.pageNum" :page-size="pageParams.pageSize"
            :page-sizes="[20, 30, 40]" background layout="total, sizes, prev, pager, next, jumper" :total="lessonsTotal"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
      <el-dialog id="popup" width="70%" v-permission="['curriculum.course.update', 'curriculum.course.add']"
        :visible.sync="isOpenAddLesson" :title="!isOpenModify ? '新建劳动课程' : '修改课程信息'" top="4vh" :show-close="false"
        @closed="clearForm" :close-on-click-modal="false" :close-on-press-escape="false">
        <course-form ref="courseForm" :is-visible="isOpenAddLesson" :is-update="isOpenModify" :lesson-id="courseId"
          :state="chosenCourseState" @successCourseFrom="handleAddLessonSuccess" @onClose="handleFormClose" />
      </el-dialog>
    </div>

    <router-view v-else :key="$route.fullPath" />
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
import { CirclePlus, Tickets } from '@element-plus/icons-vue'

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
const chosenCategory = ref<string | null>('')
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

const filterChange = async (value: {
  chosenCategory?: string[];
  status?: (number | string)[]
}) => {
  const type = Object.keys(value)[0]
  if (type === 'chosenCategory') {
    let tag = value['chosenCategory']?.[0]
    chosenCategory.value = tag ?? null
  } else if (type === 'status') {
    const tag = value['status']?.[0]
    if (chosenState.value !== tag) {
      chosenState.value = tag as number
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
// TODO 旧版本这个函数有问题的，不知道怎么能运行
// const addLessonFunc = () => {
//   const newLessons = ref({
//     semester: String(semesterTime.value) + String(whichSemester.value),
//   });

//   const keys = Object.keys(newLessons.value) as (keyof typeof newLessons.value)[];
//   const filteredKeys = keys.filter(
//     e => e !== 'attachment' && e !== 'cover' && e !== 'courseManager' && e !== 'ruleContent'
//   );
//   const flag = filteredKeys.some(e => !newLessons.value[e]);
// };

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
      category: chosenCategory.value ?? undefined,
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
