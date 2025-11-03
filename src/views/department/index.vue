<template>
  <div class="container">
    <!-- style="flex-direction: column; height: 100%" -->
    <!-- justify="space-between" -->
    <el-row :gutter="24" type="flex" align="middle">
      <el-col :span="24" class="box toolbar">
        <div class="searchBar">
          <div>
            <div id="keyWords">
              <div style="width: 45%">关键词:&nbsp;</div>
              <el-input v-model="key" placeholder="查找学院" clearable />
              <div class="searchButtons">
                <el-button :disabled="key == ''" @click="key = ''">重置</el-button>
                <el-button type="primary" :disabled="key == ''" @click="search">搜索</el-button>
              </div>
            </div>
          </div>
          <el-button v-permission="['user.department.add']" type="primary" :icon="CirclePlus"
            @click="create">添加学院</el-button>
        </div>
      </el-col>

      <el-col v-loading="loading" :span="24" class="box mainArea">
        <div style="width: 100%; height: 90%; overflow-y: scroll">
          <el-table
            :data="list.slice((pageParam.pageNum - 1) * pageParam.pageSize, pageParam.pageNum * pageParam.pageSize)"
            height="100%" border style="width: 100%">
            <el-table-column label="学院Logo" width="200">
              <template #default="scope">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">
                  <el-image style="height: 60px" :src="scope.row.departmentCover || defaultCover" lazy fit="cover">
                    <template #error style="text-align: center">
                      <i class="el-icon-picture-outline"></i><br />
                      <span>仅在校园网环境下可访问</span>
                    </template>
                  </el-image>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" label="学院名称" min-width="200" />
            <el-table-column label="学院别名" min-width="300">
              <template #default="scope">
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                  ">
                  {{ (scope.row.alias || []).join("、") }}
                </div>
              </template>
            </el-table-column>
            <el-table-column v-permission="[
              'user.department.delete',
              'user.department.update',
            ]" label="操作" min-width="80">
              <template #default="scope">
                <div>
                  <el-button v-permission="['user.department.update']" type="text" :icon="Edit"
                    @click="edit(scope.row)">编辑</el-button>
                  <el-button v-permission="['user.department.delete']" style="color: red" type="text" :icon="Delete"
                    @click="del(scope.row.id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div style="display: flex; align-items: flex-start; height: 8%">
          <el-pagination :current-page="pageParam.pageNum" :page-sizes="[10, 15, 20, 30]"
            :page-size.sync="pageParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
      </el-col>
    </el-row>

    <el-dialog v-loading="dialogLoading" :title="isUpdate ? '修改信息' : '新增学期'" v-model="dialogVisible"
      :close-on-click-modal="false" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="ruleForm">
        <el-form-item label="学院名称" prop="departmentName" class="departmentName">
          <el-input v-model="form.departmentName" />
        </el-form-item>

        <el-form-item label="学院Logo" prop="departmentCover">
          <el-upload ref="uploadFile" class="uploadCover" :action="uploadUrl" list-type="picture-card"
            accept="image/jpeg,image/jpg,image/png" :limit="1" :on-remove="handleRemove" :on-change="handleChange"
            :on-success="handleSuccess">
            <img v-if="form.departmentCover && form.departmentCover !== ''" :src="form.departmentCover"
              style="width: 112px; height: 112px" />
            <div v-else>
              <i>
                <Plus style="color:gray; width: 24px; height: 24px;" />
              </i>
            </div>
          </el-upload>
          <div style="color: red; font-size: 13px">
            上传图片, 建议.jpg格式, 大小20M以内
          </div>
        </el-form-item>

        <el-form-item v-for="(alias, index) in form.alias" :key="index" :label="'学院别名' + `${index + 1}`"
          :prop="'alias'">
          <div style="
              width: 90%;
              display: flex;
              align-items: center;
              justify-content: space-around;
            ">
            <el-input v-model="alias.value" size="medium" />
            <el-button v-if="!index" type="success" style="margin-left: 20px; padding: 10px; letter-spacing: 2px"
              @click.prevent="addAlias">新增</el-button>
            <el-button v-if="index" type="danger" style="margin-left: 20px; padding: 10px; letter-spacing: 2px"
              @click.prevent="removeAlias(alias)">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="submit">{{
          isUpdate ? "修改" : "创建"
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { isArrEqual } from '@/apis/common'
import { computed, onMounted, ref } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import type { DepartmentListType } from '@/types/apis/department'
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus'
import { Edit, Delete, CirclePlus, Plus } from '@element-plus/icons-vue'
import { uploadUrl } from '@/apis/common'
import logo from '@/assets/swpu_LOGO/logo_blue.jpg'
import { createDepartment, deleteDepartment, updateDepartment } from '@/apis/department/department'

const departmentStore = useDepartmentStore()
const list = ref<DepartmentListType[]>([])
const total = ref(0)
const loading = ref(false)
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const isUpdate = ref(false)
const choseId = ref('')
const key = ref('')
const fileList = ref([])
const defaultCover = ref(logo)
const hasCover = ref(false)
const pageParam = ref({
  pageNum: 1,
  pageSize: 10
})
const form = ref({
  departmentName: '',
  departmentCover: '',
  alias: [
    { value: '' }
  ]
})
type FormType = typeof form.value
const formCopy = ref<FormType>({
  departmentName: '',
  departmentCover: '',
  alias: [{ value: '' }]
})
const rules = {
  name: [
    { required: true, message: '请输入学院名称', trigger: 'blur' }
  ],
  cover: [
    { required: true, message: '请上传学院封面', trigger: 'change' }
  ]
}

const submitDisabled = computed(() => Object.values(form.value).every(e => e === '') && isArrEqual(Object.values(form.value), Object.values(formCopy.value)))

const loadList = async () => {
  loading.value = true
  try {
    const listFromApi = await departmentStore.init()
    list.value = listFromApi
    total.value = listFromApi.length
  }
  catch (e) {
    ElMessage.error('获取学院列表失败')
  }
  loading.value = false
}

const del = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      "该操作存在巨大风险, 若已有学生绑定该学院, 删除学院后将导致学生无法登录, 请确保没有学生绑定该学院后再进行删除?\n",
      '警告',
      {
        confirmButtonText: "我已知晓风险并确保无学生绑定该学院, 确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    )

    const res = await deleteDepartment(Number(id))
    if (res.code === 200) {
      if (pageParam.value.pageNum > 1 && list.value.length === 1) {
        pageParam.value.pageNum--
      }
      ElMessage.success("学院删除成功")
      dialogVisible.value = false
      if (key.value !== '') {
        key.value = '' // 触发watcher
      } else {
        await loadList()
      }
    }
  } catch (error) {
    dialogVisible.value = false
  }
}

const create = async () => {
  formCopy.value = JSON.parse(JSON.stringify(form.value)) as FormType
  formCopy.value.alias = formCopy.value.alias.map(e => {
    return { value: e.value }
  })
  dialogVisible.value = true
}

const edit = async (info: FormType & { id: string }) => {
  choseId.value = info.id
  form.value.departmentName = info.departmentName
  form.value.departmentCover = info.departmentCover
  form.value.alias = (info.alias || []).map(e => {
    return { value: e.value }
  })
  formCopy.value = JSON.parse(JSON.stringify(form.value)) as FormType
  isUpdate.value = true
  dialogVisible.value = true
}

const submit = async () => {
  if (!form.value.departmentName || !form.value.departmentCover) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (!/^[\u4e00-\u9fa5]+$/.test(form.value.departmentName)) {
    ElMessage.error('学院名称只能为中文')
    return
  }

  dialogVisible.value = true
  // TODO 函数测试
  const submitForm = {
    ...form.value,
    alias: form.value.alias.map(e => ({ value: e.value }))
  }
  if (!isUpdate.value) {
    try {
      const res = await createDepartment(submitForm)
      if (res.code === 200) {
        ElMessage.success('学院创建成功')
        dialogVisible.value = false
        if (key.value !== '') {
          key.value = '' // 触发watcher
        } else {
          await loadList()
        }
      }
    }
    catch (e) {
      ElMessage.error('学院创建失败')
    }
  }
  else {
    const submitForm = JSON.parse(JSON.stringify(form.value))
    submitForm.id = choseId.value
    const res = await updateDepartment(submitForm)
    if (res.code === 200) {
      ElMessage.success('学院修改成功')
      dialogVisible.value = false
      if (key.value !== '') {
        key.value = ''
      } else {
        await loadList()
      }
    }
  }
  dialogLoading.value = false
}

const search = async () => {
  pageParam.value.pageNum = 1
  list.value = list.value.filter(e => e.departmentName.includes(key.value))
}

const handleSizeChange = async (newSize: number) => {
  pageParam.value.pageSize = newSize
}

const handlePageChange = async (newPage: number) => {
  pageParam.value.pageNum = newPage
}

const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  hasCover.value = false
  form.value.departmentCover = ''
}

const handleChange = (file: UploadFile, fileList: UploadFile[]) => {
  hasCover.value = fileList.length > 0
}

const handleSuccess = (res: any, file: UploadFile) => {
  if (res.code === 200) {
    form.value.departmentCover = res.data
    hasCover.value = true
    ElMessage.success('上传成功')
  } else if (res.message === '系统异常=>Maximum upload size exceeded') {
    ElMessage.error('上传失败, 文件过大, 不得超过20M')
  }
}

const removeAlias = (alias: { value: string }) => {
  const index = form.value.alias.indexOf(alias)
  if (index !== -1) {
    form.value.alias.splice(index, 1)
  }
}

const addAlias = () => {
  form.value.alias.push({ value: '' })
}

onMounted(async () => {
  await loadList()
})
</script>

<style lang="scss" scoped>
:deep(.el-upload--picture-card) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  height: calc(100vh - 50px);
  min-width: 1326px;
  min-height: 665.2px;
  padding: 10px;
  display: flex;
  justify-content: center;

  .el-row {
    width: calc(100%);

    .el-col {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .box {
      padding-left: 10px;
      border-radius: 4px;
      height: calc(100vh - 70px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .toolbar {
      height: 8%;

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
    }

    .mainArea {
      height: 90.5%;
      justify-content: space-between;
    }
  }

  el-dialog {
    .ruleForm {
      .departmentName {
        margin-bottom: 30px;
        background-color: #ff0000;
      }
    }
  }
}
</style>
