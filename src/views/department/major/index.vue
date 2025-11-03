<template>
  <div class="container">
    <!-- type="flex" justify="space-between" align="middle"   style="flex-direction: column; height: 100%"-->
    <el-row :gutter="24">
      <el-col :span="24" class="box toolbar">
        <div class="searchBar">
          <div>
            <div id="keyWords">
              <div style="width: 45%">关键词:&nbsp;</div>
              <el-input v-model="pagination.key" placeholder="查询你需要的专业" clearable />
              <div class="searchButtons">
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" :disabled="!pagination.key" @click="loadList()">搜索</el-button>
              </div>
            </div>
          </div>
          <div>
            <span style="color: #5a5e66">学院筛选:&nbsp;</span>
            <el-select v-model="pagination.departmentId" :multiple="false" collapse-tags filterable clearable
              placeholder="筛选学院" style="width: 380px" @change="loadList" :disabled="checkRole">
              <el-option v-for="item in departmentList" :key="item.id" :label="item.departmentName" :value="item.id" />
            </el-select>
          </div>
          <div>
            <el-button v-permission="['user.major', 'user.major.add']" type="primary" :icon="CirclePlus"
              @click="openModel('')">添加专业</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24" class="box mainArea">
        <div style="width: 100%; height: 90%; margin-top: 10px; overflow-y: scroll">
          <el-table v-loading="loading" :data="majorList" border height="100%" style="width: 100%"
            :row-style="{ minHeight: 50 + 'px', height: 'auto' }" :cell-style="{ padding: 5 + 'px' }">
            <el-table-column fixed align="center" prop="majorName" label="专业名" />
            <el-table-column prop="department" label="所属学院" width="350" align="center" column-key="department">
              <template #default="scope">
                <el-tag>{{ scope.row.department }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" width="180" />
            <el-table-column prop="gmtModified" label="更新时间" width="180" />
            <el-table-column v-permission="[
              'user.major',
              'user.major.update',
              'user.major.delete',
            ]" fixed="right" label="操作" width="150">
              <template #default="scope">
                <el-button v-permission="['user.major', 'user.major.update']" type="text" :icon="Edit"
                  @click=" openModel(scope.row.id, true)">编辑</el-button>
                <el-button v-permission="['user.major', 'user.major.delete']" type="text" style="color: #f56c6c"
                  :icon="Delete" @click="removeMajor(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display: flex; align-items: flex-start; height: 8%">
          <el-pagination :current-page="pagination.pageNum" :page-sizes="[10, 15, 20, 30]"
            :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handlePageChange" />
        </div>
      </el-col>
    </el-row>
    <MajorModel :major-id="currentMajorId" :is-update="isUpdate" :visible="majorModelVisible" @success="handleSuccess"
      @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { getDepartmentList } from '@/apis/department/department'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DepartmentListType } from '@/types/apis/department'
import { deleteMajor, majorPage } from '@/apis/department/major'
import { Edit, Delete, CirclePlus } from '@element-plus/icons-vue'
import MajorModel from './MajorModel.vue'

const userStore = useUserStore()

const majorModelVisible = ref(false)
const currentMajorId = ref('')
const isUpdate = ref(false)
const loading = ref(false)
const total = ref(0)
const departmentIdList = ref<string[]>([])
const majorList = ref<any[]>([])
const departmentList = ref(
  [{ id: '', departmentName: '全部' }]
)
const pagination = ref({
  key: '',
  pageNum: 1,
  pageSize: 10,
  departmentId: '',
})

const userDepartmentId = computed(() => userStore.departmentId)
const checkRole = computed(() => userDepartmentId.value ? true : false)

const openModel = (majorId: string, isUpdateNew = false) => {
  currentMajorId.value = majorId
  isUpdate.value = isUpdateNew
  majorModelVisible.value = true
}

const initializeFilter = async () => {
  try {
    const res = await getDepartmentList('', 1, 100)
    if (res.code === 200) {
      const { data } = res as unknown as {
        data: {
          list: DepartmentListType[]
          total: number
        }
      }
      data.list.forEach(e => { departmentList.value.push(e) })
    } else {
      ElMessage.error('网络错误请重试')
    }
  }
  catch (_) {
    ElMessage.error('网络错误请重试')
  }
}

const loadList = async () => {
  loading.value = true
  const res = await majorPage({ ...pagination.value }, { departmentList: [] })
  if (res.code === 200) {
    const { data } = res as unknown as {
      data: {
        list: MajorListType[]
        total: number
      }
    }
    console.log(data)
    majorList.value = data.list
    total.value = Number(data.total)
  }
  loading.value = false
}

const reset = async () => {
  pagination.value.pageNum = 1
  pagination.value.pageSize = 10
  pagination.value.departmentId = ''
  pagination.value.key = ''
  departmentIdList.value = []
  await loadList()
}

// TODO 传入要改一下 不知道原本在写什么东西
const removeMajor = async (majorId: string) => {
  const resElement = await ElMessageBox.confirm('确定要删除吗？', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  })

  if (resElement.action === 'confirm') {
    const res = await deleteMajor(majorId)
    if (res.code === 200) {
      ElMessage.success('删除成功')
    }
    else {
      ElMessage.error('删除失败')
    }
  }
  await loadList()
}

const handleSuccess = async () => {
  majorModelVisible.value = false
  await loadList()
}

const handleClose = () => {
  majorModelVisible.value = false
}

const handleSizeChange = async (newSize: number) => {
  pagination.value.pageSize = newSize
  await loadList()
}

const handlePageChange = async (newPage: number) => {
  pagination.value.pageNum = newPage
  await loadList()
}

onMounted(() => {
  initializeFilter()
  loadList()
})

interface MajorListType {
  id: string
  majorName: string
  departmentId: string
  departmentName: string
  isDeleted: number
}
</script>

<style lang="scss" scoped>
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
      height: 9%;

      .searchBar {
        height: 60px;
        padding: 5px 5% 5px 1%;
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
}
</style>
