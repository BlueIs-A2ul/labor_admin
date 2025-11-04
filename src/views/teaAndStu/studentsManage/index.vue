<template>
  <div class="app-container">
    <div class="searchBar">
      <div>
        <div id="keyWords">
          <div style="width: 45%">关键词:&nbsp;</div>
          <el-input v-model="keyWords" placeholder="请输入内容" clearable />
          <div class="searchButtons">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" :disabled="searchDisabled" @click="loadList()">搜索</el-button>
          </div>
        </div>
      </div>
      <div>
        <el-row>
          <el-col :span="13">
            <span style="color: #5a5e66; width: 30%">学院:&nbsp;</span>
            <el-select v-model="departmentId" style="width: 70%" collapse-tags filterable clearable placeholder="选择学院"
              :disabled="checkRole" @change="loadMajorSelect(); loadList();">
              <el-option v-for="item in selectDepartment" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="11">
            <span style="color: #5a5e66; width: 30%">专业:&nbsp;</span>
            <el-select v-model="majorId" :disabled="!departmentId" style="width: 70%" collapse-tags filterable clearable
              placeholder="请选择专业" @change="loadList">
              <el-option v-for="item in majorSelect" :key="item.id" :label="item.majorName" :value="item.id" />
            </el-select></el-col>
        </el-row>
      </div>
      <div class="buttons">
        <el-button v-permission="['user.student.add']" type="primary" icon="el-icon-circle-plus-outline"
          @click="handleCreate">添加学生</el-button>
        <el-button v-permission="['user.student.add']" type="success" icon="el-icon-s-grid"
          @click="uploadDialogVisible = true">导入学生Excel</el-button>
      </div>
    </div>

    <div v-loading="loading" class="students-list">
      <el-table :data="studentList" stripe border height="100%" style="width: 100%"
        :row-style="{ minHeight: 50 + 'px', height: 'auto' }" :cell-style="{ padding: 5 + 'px' }">
        <el-table-column label="序号" width="50" align="center">
          <template #default="scope">
            <div>
              {{ scope.$index + 1 }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="60" align="center" />
        <el-table-column prop="studentId" label="学号" min-width="50" align="center" />
        <el-table-column prop="major" label="专业" align="center" />
        <el-table-column prop="department" min-width="80" label="学院" align="center">
          <el-tag #default="scope">{{ scope.row.department }}</el-tag>
        </el-table-column>
        <el-table-column prop="sex" label="性别" min-width="50" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.sex == 1" size="medium">男</el-tag>
            <el-tag v-else-if="scope.row.sex == 0" size="medium" type="danger">女</el-tag>
            <span v-else>未设置</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentGrade" label="当前年级" sortable="custom" min-width="60" align="center">
          <template #default="scope">
            {{
              scope.row.currentGrade ? scope.row.currentGrade + "级" : "暂无"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="campus" label="校区" min-width="30" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.campus === '南充'" color="success">{{
              scope.row.campus
              }}</el-tag>
            <el-tag v-else>{{ scope.row.campus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" min-width="50" align="center">
          <template #default="scope">
            <div>
              <el-popover placement="right" width="350" title="联系方式" trigger="click">
                <div style="display: flex; flex-direction: column">
                  <div v-for="(value, key, index) in scope.row.contact" :key="index" style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      width: 100%;
                      margin-top: 10px;
                      font-weight: bold;
                    ">
                    <div style="
                        width: 30%;
                        border-left: 4px solid #409eff;
                        padding-left: 8px;
                      ">
                      {{ key }}
                    </div>
                    <div style="width: 70%">
                      {{ value == "" ? "暂无" : value }}
                    </div>
                  </div>
                </div>
                <el-button slot="reference" type="text">查看</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column v-if="
          ['user.student.update', 'user.student.delete'].some((p) =>
            userPermissions.includes(p)
          )
        " label="操作" min-width="80" align="center">
          <template #default="scope">
            <div class="buttons">
              <el-button v-permission="['user.student.update']" type="text" style="color: #409eff"
                icon="el-icon-edit-outline" @click="handleUpdate(scope.row)">修改</el-button>
              <el-popconfirm confirm-button-text="确定删除" cancel-button-text="取消" confirm-button-type="danger"
                icon="el-icon-info" icon-color="red" :title="`确认删除学生${scope.row.name}吗?`"
                @confirm="handleDel(scope.row.id)">
                <el-button slot="reference" v-permission="['user.student.delete']" style="color: #f56c6c" type="text"
                  icon="el-icon-delete">删除</el-button>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination :page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="page"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>

    <el-dialog v-permission="['user.student.add']" title="学生信息导入" :visible.sync="uploadDialogVisible" width="30%"
      :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" center accept="xlsx">
      <div style="display: flex; flex-direction: column; align-items: center">
        <el-upload drag :action="uploadUrl" :show-file-list="false" :http-request="handelUpload" multiple>
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处自动上传, 或<em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip" style="color: red; margin-top: 10px">
            只能上传xlsx文件, 上传过程不可逆
          </div>
        </el-upload>
        <span slot="footer" class="dialog-footer" style="
            width: 150px;
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          ">
          <el-button @click="handleClose">关闭</el-button>
          <el-button @click="downLoad">下载导入模板</el-button>
          <el-button v-debounce type="success" @click="handleUpdateOver">完成上传</el-button>
        </span>
      </div>
    </el-dialog>

    <StudentModal v-permission="['user.student.add', 'user.student.update']" :dialog-table-visible="dialogTableVisible"
      :student="currentStudent" :is-update="isUpdate" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useDepartmentStore } from '@/stores/department'
import { deepClone } from '@/utils'
import { majorPage } from '@/apis/department/major'
import { deleteStudent, downloadModuleApi, studentListAPI, uploadStu } from '@/apis/student'
import { ElMessage } from 'element-plus'
import type { StudentParams } from '@/types/apis/student'
import type { MajorItemParams } from '@/types/apis/department'
import { handleDownload } from '@/utils/file'
import { uploadUrl } from '@/apis/student'

const userStore = useUserStore()
const departmentStore = useDepartmentStore()

const studentList = ref<StudentParams[]>([])
const uploadDialogVisible = ref(false)
const keyWords = ref('')
const total = ref(1)
const page = ref(1)
const pageSize = ref(10)
const departmentId = ref('')
const majorId = ref<string | null>('')
const currentStudent = ref({})
const dialogTableVisible = ref(false)
const isUpdate = ref(false)
const loading = ref(false)
const majorSelect = ref([
  {
    id: '',
    majorName: '全部'
  }
])

const searchDisabled = computed(() => keyWords.value === '')
const department = computed(() => departmentStore.department)
const userPermissions = computed(() => userStore.userPermissions)
const userDepartmentId = computed(() => userStore.departmentId)
const selectDepartment = computed(() => {
  let res = []
  if (department.value) {
    const departmentList = deepClone(department.value)
    res = departmentList.filter(e => Number(e.id) > 1).map(e => {
      return {
        value: e.id,
        text: e.departmentName
      }
    })
    res.unshift({
      value: '',
      text: '全部'
    })
  }
  console.log(res)
  return res
})
const checkRole = computed(() => {
  if (userDepartmentId.value) {
    departmentId.value = userDepartmentId.value
    return true
  }
  return false
})

watch(() => departmentId.value, async (newVal) => {
  majorId.value = null
  await loadMajorSelect()
  await loadList()
}, {
  immediate: false
})

const loadMajorSelect = async () => {
  majorId.value = null
  const res = await majorPage({
    pageNum: 1,
    pageSize: 1000,
  }, {
    departmentList: departmentId.value ? [departmentId.value] : [],
    // majorList: majorId.value ? [majorId.value] : []
    // 上面一行参数在原版有，但实际这个api没有接收这个参数，这里注释掉
  })
  const { data } = res as unknown as { data: { list: MajorItemParams[] } }
  majorSelect.value = data.list
  majorSelect.value.unshift({
    id: '',
    majorName: '全部'
  })
}

const loadList = async () => {
  loading.value = true
  const res = await studentListAPI({
    key: keyWords.value,
    pageNum: String(page.value),
    pageSize: String(pageSize.value),
    departmentId: departmentId.value,
    majorId: majorId.value ?? ''
  })
  if (res.code === 200) {
    const { data } = res as unknown as { data: { list: StudentParams[], total: number } }
    data.list.forEach((e, index) => {
      if (e.contact === null) {
        data.list[index].contact = {
          电话: '',
          邮箱: '',
          QQ: '',
          微信: '',
        }
      }
    })
    studentList.value = data.list
    total.value = Number(data.total)
  }
}

const handleCreate = () => {
  dialogTableVisible.value = true
  isUpdate.value = false
  currentStudent.value = {}
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  loadList()
}

const handleCurrentChange = (newPage: number) => {
  page.value = newPage
  loadList()
}

const handleUpdate = (row) => {
  isUpdate.value = true
  currentStudent.value = row
  dialogTableVisible.value = true
}

const handleClose = () => {
  dialogTableVisible.value = false
}

const handleDel = async (row) => {
  const res = await deleteStudent(row)
  if (res.code === 200) {
    if (page.value > 1 && studentList.value.length === 1) {
      page.value--
    }
    ElMessage.success('删除成功')
    await loadList()
  } else {
    ElMessage.error('服务器异常，删除失败')
  }
}

const reset = () => {
  keyWords.value = ''
  page.value = 1
  departmentId.value = ''
  majorId.value = null
  loadList()
}

const handelUpload = async (params) => {
  const res = await uploadStu(params.file)
  if (res.code === 200) {
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('服务器异常，上传失败')
  }
}

const handleUpdateOver = async () => {
  uploadDialogVisible.value = false
  await loadList()
}

const filterChange = async (val) => {
  departmentId.value = typeof val === 'undefined' ? null : val.chosenDepartment[0]
  page.value = 1
  await loadList()
}

const downLoad = async () => {
  try {
    const res = await downloadModuleApi()
    if (!res) {
      ElMessage.error('服务器异常，下载失败')
      return
    }
    handleDownload('学生信息导入模板.xlsx', res.data)
  }
  catch (e) {
    ElMessage.error('处理文件发生错误')
  }
}

onMounted(() => {
  loadList()
  loadMajorSelect()
})
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  letter-spacing: 1px;
  padding: 10px 13px 10px 13px;
}

:deep(.el-popconfirm__action) {
  display: flex;
  margin-left: 10px;
}

.app-container {
  background-color: #d6d6d640;
  height: calc(100vh - 50px);
  overflow-y: auto;
  overflow-x: hidden;

  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }

  .searchBar {
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

    #keyWords {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      color: #838383;
    }

    .searchButtons {
      display: flex;
      flex-direction: row;
      margin-left: 15px;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 30px;
  }

  .students-list {
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

    &:hover {
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.405);
    }
  }
}
</style>
