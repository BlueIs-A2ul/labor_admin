<template>
  <div v-permission="['user.major', 'user.major.add', 'user.major.update']">
    <el-dialog :title="isUpdate ? '更新专业' : '添加专业'" v-model="props.visible" width="30%" :before-close="handleClose">
      <el-form :model="major" label-position="left">
        <el-form-item label="专业名称">
          <el-input v-model="major.majorName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="归属学院">
          <el-select v-model="major.departmentId" filterable placeholder="请选择活动区域" :disabled="checkRole">
            <el-option v-for="department in departmentList" :key="department.id" :label="department.departmentName"
              :value="department.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getDepartmentList } from '@/apis/department/department'
import { saveMajor, updateMajor } from '@/apis/department/major'

const userStore = useUserStore()

const props = defineProps({
  isUpdate: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'success'])

const departmentList = ref<DepartmentListItemType[]>([])
const major = ref({
  id: '',
  majorName: '',
  departmentId: '',
})

const userDepartmentId = computed(() => userStore.departmentId)
const checkRole = computed(() => {
  if (userDepartmentId.value) {
    major.value.departmentId = userDepartmentId.value
    return true
  }
  return false
})

const loadDepartmentSelect = async () => {
  const res = await getDepartmentList('', 1, 1000)
  const { data } = res as unknown as { data: { list: DepartmentListItemType[] } }
  departmentList.value = data.list.filter(e => e.id !== '1')
}

const handleClose = () => {
  emits('close')
}

const handleSuccess = async () => {
  if (props.isUpdate) {
    //major.value.id = majorId
    // TODO 这里原本上面一行是有的，但是majorId来源于一个watch，vue2的版本里watch也是注释掉的
    // 不清楚前辈们出于什么顾虑，先写todo
    await updateMajor(major.value)
  } else {
    await saveMajor(major.value)
  }
  emits('success')
}

onMounted(() => {
  loadDepartmentSelect()
})

interface DepartmentListItemType {
  departmentName: string
  id: string
}
</script>

<style scoped></style>
