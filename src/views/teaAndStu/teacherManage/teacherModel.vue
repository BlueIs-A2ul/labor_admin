<template>
  <div class="container">
    <el-dialog title="教师信息" :model-value="dialogTableVisible" width="30%" :close-on-click-modal="false"
      :before-close="close">
      <el-form :model="teacherInfo" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="teacherInfo.name" show-word-limit style="width: 80%" />
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="teacherInfo.title" show-word-limit style="width: 80%" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.电话" style="width: 80%; margin-bottom: 10px;">
            <template #prepend>电话 </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.邮箱" style="width: 80%; margin-bottom: 10px;">
            <template #prepend>邮箱 </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.QQ" style="width: 80%; margin-bottom: 10px;">
            <template #prepend>QQ </template>
          </el-input>
          <el-input placeholder="请输入内容" v-model="teacherInfo.contact.微信" style="width: 80%">
            <template #prepend>微信 </template>
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select placeholder="请选择性别" v-model="teacherInfo.sex"
            :value="teacherInfo.sex === '1' ? '男' : `${teacherInfo.sex === '0' ? '女' : ''}`" style="width: 80%;">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" v-if="!isUpdate" @click="handleCreate" :disabled="createDisabled">提交</el-button>
        <el-button type="primary" v-else @click="handleUpdate" :disabled="updateDisabled">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { addTeacher, updateTeacher } from '@/apis/teacher'
import { ElMessage } from 'element-plus'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  teacher: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isUpdate: {
    type: Boolean,
    default: false
  }
})

const teacherInfo = {
  name: '',
  title: '',
  sex: '',
  contact: {
    电话: '',
    邮箱: '',
    QQ: '',
    微信: ''
  }
}

const emit = defineEmits(['close', 'loadList'])

const copy = ref()
const dialogTableVisible = computed(() => props.visible)
const createDisabled = computed(() => {
  if (teacherInfo.sex !== '0' && teacherInfo.sex !== '1') {
    return true
  } else {
    let values = Object.values(teacherInfo.contact)
    if (values.every(item => !Boolean(item))) {
      return true
    } else {
      return Object.values(teacherInfo).some(item => !Boolean(item))
    }
  }
})

const updateDisabled = computed(() => copy.value === JSON.stringify(props.teacher))

const close = async () => {
  emit('close')
  emit('loadList')
}

const handleCreate = async () => {
  const res = await addTeacher(teacherInfo)
  if (res.code === 200) {
    ElMessage.success('添加成功')
    await close()
  } else {
    ElMessage.error(res.message)
  }
}

const handleUpdate = async () => {
  const res = await updateTeacher(teacherInfo)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    await close()
  } else {
    ElMessage.error(res.message)
  }
}

watch(
  () => props.teacher,
  (newTeacher, oldTeacher) => {
    const flag = Object.keys(newTeacher).length
    if (flag !== 0) {
      // 深拷贝 teacher 对象，避免直接引用
      teacherInfo.name = newTeacher.name
      teacherInfo.title = newTeacher.title
      teacherInfo.sex = newTeacher.sex
      teacherInfo.contact.电话 = newTeacher.contact?.电话 || ''
      teacherInfo.contact.邮箱 = newTeacher.contact?.邮箱 || ''
      teacherInfo.contact.QQ = newTeacher.contact?.QQ || ''
      teacherInfo.contact.微信 = newTeacher.contact?.微信 || ''
      copy.value = JSON.stringify(newTeacher)
    } else {
      // 重置为初始值
      teacherInfo.name = ''
      teacherInfo.title = ''
      teacherInfo.sex = ''
      teacherInfo.contact.电话 = ''
      teacherInfo.contact.邮箱 = ''
      teacherInfo.contact.QQ = ''
      teacherInfo.contact.微信 = ''
    }
  },
  { deep: true, immediate: true }
)

</script>

<style lang="scss" scoped>
:deep(.el-scrollbar__wrap) {
  overflow: auto;
}

:deep(.el-input-group__prepend) {
  padding: 0 15px;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  margin-left: 60%;
}
</style>
