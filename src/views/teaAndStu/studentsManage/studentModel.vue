<template>
  <div class="container">
    <el-dialog title="学生信息" top="4vh" v-model="props.visible" width="50%" :close-on-click-modal="false"
      :close-on-press-escape="false" :before-close="close">
      <el-form :model="studentInfo" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学号">
              <el-input v-model="studentInfo.studentId" :readonly="isUpdate" show-word-limit style="width: 80%" />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="studentInfo.name" style="width: 80%" />
            </el-form-item>
            <el-form-item label="当前年级">
              <el-input-number v-model="studentInfo.currentGrade" :min="2020" style="width: 80%" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="sex" placeholder="请选择性别" style="width: 80%">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="学院">
              <el-select v-model="studentInfo.departmentId" placeholder="请选择学院" style="width: 80%"
                @change="loadMajorSelect" :disabled="checkRole">
                <el-option v-for="item in department" :key="item.id" :label="item.departmentName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="专业">
              <el-select v-model="studentInfo.majorId" style="width: 80%" collapse-tags filterable clearable
                placeholder="请选择专业">
                <el-option v-for="item in majorSelect" :key="item.id" :label="item.majorName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="校区">
              <el-select v-model="studentInfo.campus">
                <el-option label="成都校区" value="成都" />
                <el-option label="南充校区" value="南充" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="出生日期">
              <el-date-picker v-model="studentInfo.birth" type="date" placeholder="选择日期" format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="入学日期">
              <el-date-picker v-model="studentInfo.enrollmentYear" type="date" placeholder="选择日期" format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="studentInfo.contact['电话']" placeholder="请输入内容" style="width: 80%; margin-bottom: 10px">
                <template slot="prepend">电话 </template>
              </el-input>
              <el-input v-model="studentInfo.contact['邮箱']" placeholder="请输入内容" style="width: 80%; margin-bottom: 10px">
                <template slot="prepend">邮箱 </template>
              </el-input>
              <el-input v-model="studentInfo.contact['QQ']" placeholder="请输入内容" style="width: 80%; margin-bottom: 10px">
                <template slot="prepend">QQ </template>
              </el-input>
              <el-input v-model="studentInfo.contact['微信']" placeholder="请输入内容" style="width: 80%">
                <template slot="prepend">微信 </template>
              </el-input>
            </el-form-item>
            <el-form-item label="学籍状态">
              <el-switch v-model="studentInfo.state" :active-value="1" :inactive-value="0" active-text="正常"
                inactive-text="异常" inactive-color="red" />
            </el-form-item>
            <el-form-item label="重置密码" v-show="isUpdate">
              <el-input v-model="password" show-password style="width: 60%" />
              <el-button style="color: #f56c6c" type="text" icon="el-icon-refresh-left" :disabled="!isUpdate"
                @click="resetPwd()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button v-if="!isUpdate" type="primary" @click="handleCreate">提交</el-button>
        <el-button v-else type="primary" :disabled="updateDisabled" @click="handleUpdate">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useDepartmentStore } from '@/stores/department'
import { majorPage } from '@/apis/department/major'
import { resetPassword } from '@/apis/user'
import { ElMessage } from 'element-plus'
import { addStudent, updateStudent } from '@/apis/student'
import type { AddStudentParams, StudentParams, UpdateStudentParams } from '@/types/apis/student'
import type { MajorItem } from '@/types'

const props = defineProps<{
  isUpdate: boolean
  visible: boolean
  student: StudentParams
}>()

const emits = defineEmits(['handleClose', 'loadList'])

const userStore = useUserStore()
const departmentStore = useDepartmentStore()

const password = ref('')
const majorSelect = ref<MajorItem[]>([])
const studentInfo = ref({
  studentId: '',
  majorId: '',
  name: '',
  currentGrade: '',
  sex: 1,
  departmentId: '',
  enrollmentYear: {},
  birth: {},
  campus: 0,
  state: 1,
  contact: {
    电话: '',
    邮箱: '',
    QQ: '',
    微信: '',
  }
})
const departmentName = ref('')
const copy = ref<any>(null)
const sex = ref('')

const updateDisabled = computed(() => copy.value === JSON.stringify(studentInfo.value))
const department = computed(() => departmentStore.department)
const userDepartmentId = computed(() => userStore.departmentId)
const checkRole = computed(() => {
  if (userDepartmentId.value) {
    studentInfo.value.departmentId = userDepartmentId.value
    return true
  }
  return false
})

watch(props.student, async (newValue) => {
  const flag = Object.keys(newValue).length
  if (flag !== 0) {
    studentInfo.value = JSON.parse(JSON.stringify(newValue))
    props.student.sex === 1 ? sex.value = '男' : sex.value = '女'
    copy.value = JSON.stringify(newValue)
    const department = departmentStore.department.find(e => e.id === String(newValue.departmentId))
    departmentName.value = department ? department.departmentName : '暂无学院'
    await loadMajorSelect()
  } else {
    studentInfo.value = {
      studentId: '',
      name: "",
      sex: 1,
      birth: {},
      departmentId: '',
      enrollmentYear: {},
      state: 1,
      currentGrade: '',
      campus: 0,
      majorId: '',
      contact: {
        电话: "",
        邮箱: "",
        QQ: "",
        微信: "",
      },
    }
    departmentName.value = ''
    sex.value = ''
    copy.value = null
  }
})

watch(departmentName, async (newValue) => {
  if (!newValue) {
    return
  }
  if (newValue !== '暂无学院') {
    studentInfo.value.departmentId = departmentStore.department.find(e => e.departmentName === newValue)?.id || ''
  } else {
    studentInfo.value.departmentId = '1'
  }
})

watch(sex, async (newValue) => {
  if (!newValue) {
    return
  }
  newValue === '1' ? studentInfo.value.sex = 1 : studentInfo.value.sex = 0
}, {
  immediate: true
})

const loadMajorSelect = async () => {
  const res = await majorPage({
    pageNum: 1,
    pageSize: 100,
  }, {
    departmentList: [studentInfo.value.departmentId]
  })

  if (res.code === 200) {
    const { data } = res as unknown as { data: { list: MajorItem[] } }
    majorSelect.value = data.list
  }
}

const resetPwd = async () => {
  if (!password.value) {
    ElMessage.error('请输入密码')
    return
  }
  // TODO studentId这里原本写的uid，不知道要传什么
  try {
    await resetPassword(studentInfo.value.studentId, password.value)
    ElMessage.success('重置密码成功')
  }
  catch (_) {
    ElMessage.error('重置密码失败')
  }
}

const close = () => {
  emits('handleClose')
}

const handleCreate = async () => {
  // TODO 中间强制类型转换可能存在问题
  const res = await addStudent(studentInfo.value as unknown as AddStudentParams)
  if (res.code === 200) {
    ElMessage.success('添加成功')
    await close()
    emits('loadList')
  }
}

const handleUpdate = async () => {
  if (typeof studentInfo.value.sex === 'string') {
    studentInfo.value.sex = parseInt(studentInfo.value.sex)
  }
  const res = await updateStudent(studentInfo.value as unknown as UpdateStudentParams)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    await close()
    emits('loadList')
  }
}
</script>

<style scoped></style>
