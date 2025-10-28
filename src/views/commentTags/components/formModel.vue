<template>
  <div v-permission="['user.major', 'user.major.add', 'user.major.update']">
    <el-dialog :title="`${isUpdate ? '更新' : '添加'}评价维度`" v-model="props.visible" width="30%" :before-close="handleClose"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <div v-loading="loading">
        <el-form ref="formRef" :model="commentTag" label-position="left" :rules="rules">
          <el-form-item label="建议维度" prop="name">
            <el-input v-model.trim="commentTag.name" autocomplete="off" style="width: 400px" placeholder="建议不超过五个字" />
          </el-form-item>
          <el-form-item label="提示用语" prop="description">
            <el-input v-model.trim="commentTag.description" :rows="5" type="textarea" autosize autocomplete="off"
              style="width: 400px" placeholder="帮助学生尽快了解该维度的意义" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer" style="text-align: right;">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSuccess" :loading="submitLoading">
            {{ isUpdate ? '更新' : '添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { createCommentTagApi, getCommentTagDetailApi, updateCommentTagApi } from '@/apis/commentTags'
import { ElMessage, type ElForm } from 'element-plus'
import { ref, watch } from 'vue'

const emit = defineEmits(['close', 'success'])

const props = defineProps({
  commentTagId: {
    type: String,
    default: null,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  isUpdate: {
    type: Boolean,
    default: false,
  },
})

const commentTag = ref({
  id: '',
  category: '',
  name: '',
  description: '',
})
const loading = ref(false)
const submitLoading = ref(false)
const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const rules = {
  name: [{ required: true, message: '请输入评价维度名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择维度适用范围', trigger: 'blur' }],
  description: [{ required: true, message: '请输入提示语', trigger: 'blur' }],
}
const categories = ref([
  '通用',
  '公益服务劳动',
  '劳动理论学习',
  '日常生活劳动',
  '生产顶岗劳动',
  '其他方式劳动',
  '“三下乡”社会实践',
])

watch(
  () => props.visible,
  async (newVal) => {
    if (props.isUpdate) {
      loading.value = true
      const res = await getCommentTagDetailApi(props.commentTagId)
      if (res.code === 200) {
        const { data } = res as unknown as {
          data: {
            id: string,
            category: string,
            name: string,
            description: string,
          }
        }
        console.log('RES.DATA', res.data)
        // TODO 没找到这个函数怎么触发，打印不出来找不到类型
        commentTag.value = {
          id: data.id,
          category: data.category,
          name: data.name,
          description: data.description,
        }
      }
      loading.value = false
    }
    if (!newVal) {
      setTimeout(() => {
        formRef.value?.resetFields()
      }, 250)
    }
  }, {
  immediate: true
}
)

const handleClose = () => {
  emit('close')
}

const handleSuccess = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      let data
      if (props.isUpdate) {
        data = {
          ...commentTag.value
        }
      } else {
        const { id, ...withoutId } = commentTag.value
        data = withoutId
      }
      submitLoading.value = true
      try {
        if (props.isUpdate) {
          await updateCommentTagApi(data)
        } else {
          await createCommentTagApi(data)
        }
        ElMessage.success(`${props.isUpdate ? '更新' : '添加'}成功`)
        handleClose()
        setTimeout(() => {
          formRef.value?.resetFields()
        }, 200)
        emit('success')
      }
      catch (error) {
        ElMessage.error(`${props.isUpdate ? '更新' : '添加'}失败`)
      }
      submitLoading.value = false
    }
  })
}

</script>

<style scoped lang="scss">
:deep(.el-select) {
  width: max-content;
  min-width: 400px;
}
</style>
