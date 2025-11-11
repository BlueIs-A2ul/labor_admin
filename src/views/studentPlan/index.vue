<template>
  <div>
    <div v-if="$route.meta.showFather" class="container">
      <section class="header-bar">
        <div id="keyWords">
          <div style="width: 10%">关键词:&nbsp;</div>
          <el-input style="width: 25%" v-model="pageParams.key" placeholder="请输入内容" clearable />
          <div class="searchButtons">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="loadList()">搜索</el-button>
          </div>
        </div>
        <div class="department-label">{{ departmentName }}</div>
        <div>
          <el-button @click="openForm('create', {})">新建学期</el-button>
        </div>
      </section>
      <section class="table-area" v-loading="tableLoading">
        <el-table style="width: 100%" :data="tableData" stripe height="100%">
          <el-table-column label="序号" min-width="20" align="center">
            <template #default="scope">
              <div>
                {{ scope.$index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="semesterName" label="年级" min-width="80" align="center" />
          <el-table-column label="操作" min-width="40" align="center">
            <template #default="scope">
              <div class="table-column-actions">
                <el-button id="goalInfo" type="text" :icon="Tickets" @click="
                  toCategoryInfo(
                    scope.row.id,
                    scope.row.semesterName,
                  )
                  ">详情</el-button>
                <el-button type="text" style="color: #409eff" :icon="Edit"
                  @click="openForm('edit', scope.row)">编辑</el-button>
                <el-popconfirm confirm-button-text="我已知晓风险, 确定删除" confirm-button-type="danger"
                  cancel-button-text="放弃本次操作" icon="el-icon-info" icon-color="red"
                  title="确定要删除该学期吗, 若该目标正在使用, 删除后可能导致数据丢失" @confirm="handleDelete(scope.row)">
                  <template #reference>
                    <el-button :icon="Delete" type="text" style="color: #f56c6c; margin-left: 30px">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          v-model:currentPage="pageParams.page" :page-sizes="[20, 40, 80, 100]" :page-size="pageParams.size"
          layout="total, sizes, prev, pager, next, jumper" :total="total" background>
        </el-pagination>
      </section>
      <GardeForm :visible="isFormVisible" :form-data="formData" :type="formType" @onClose="closeForm"
        @onSuccess="loadList" />
    </div>
    <router-view v-else :key="$route.fullPath"></router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useDepartmentStore } from '@/stores/department'
import { deleteSemester, searchSemestersPage } from '@/apis/semesterAndObjectives/semester'
import { ElMessage } from 'element-plus'
import type { SemesterItem } from '@/types'
import { useRouter } from 'vue-router'
import GardeForm from './components/GardeForm.vue'
import { Edit, Tickets, Delete } from '@element-plus/icons-vue'

const userStore = useUserStore()
const departmentStore = useDepartmentStore()
const router = useRouter()

const departmentName = ref('')
const tableData = ref<SemesterItem[]>([])
const total = ref(0)
const isFormVisible = ref(false)
const tableLoading = ref(false)
const pageParams = ref({
  page: 1,
  size: 10,
  key: '',
})
const commonDimensionalityInfo = ref([])
const formData = ref({})
const formType = ref('create')

const userDepartmentId = computed(() => userStore.departmentId)
const userDepartmentName = computed(() => userStore.departmentName)
const userPermissions = computed(() => userStore.userPermissions)
const department = computed(() => departmentStore.department)

const reset = () => {
  pageParams.value.key = ''
  pageParams.value.page = 1
}

const loadList = async () => {
  tableLoading.value = true
  isFormVisible.value = false
  try {
    const res = await searchSemestersPage(pageParams.value.page, pageParams.value.size, pageParams.value.key)
    if (res.code === 200) {
      console.log(res.data)
      const { list, total: totalFormApi } = res.data as { list: SemesterItem[]; total: number }
      // TODO 其实根本就没有dimensionalityInfo这个属性 不知道是为什么写这个
      // tableData.value = list.map(e => {
      //   let { dimensionalityInfo } = e
      //   if (dimensionalityInfo) {
      //     dimensionalityInfo = dimensionalityInfo.map(dimension => ({
      //       ...dimension,
      //     }))
      //   }
      //   return {
      //     ...e,
      //     dimensionalityInfo,
      //   }
      // })
      tableData.value = list
      total.value += Number(totalFormApi)
    }
  }
  catch (_) {
    ElMessage.error('获取列表失败')
  }
  finally {
    tableLoading.value = false
  }
}

const handleSizeChange = (size: number) => {
  pageParams.value.size = size
  loadList()
}

const handleCurrentChange = (currentPage: number) => {
  pageParams.value.page = currentPage
  loadList()
}

const openForm = (type: string, data: {}) => {
  if (!userPermissions.value) {
    formType.value = type
    if (type === 'edit') {
      formData.value = data
    }
    isFormVisible.value = true
  } else {
    ElMessage.error('无权限')
  }
}

const closeForm = () => {
  isFormVisible.value = false
}

const handleDelete = async (data: { id: number | string }) => {
  const res = await deleteSemester(data.id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    loadList()
  } else {
    ElMessage.error('删除失败')
  }
}

const toCategoryInfo = (id: string, name: string) => {
  router.push({
    path: '/semester/semesterObjectives/categoryObjectives',
    query: {
      semesterId: id,
      semesterName: name,
    }
  })
}

onMounted(() => {
  departmentName.value = userDepartmentName.value
  loadList()
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #d6d6d640;
  padding: 10px;
  width: 100%;
  height: calc(100vh - 50px);

  section {
    transition: box-shadow 0.25s ease-in;
    background-color: #ffffff;
  }

  .header-bar {
    padding: 30px;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .guideFont {
      font-size: 1.6em;
      letter-spacing: 5px;
      font-weight: 700;
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

    .department-label {
      width: 200px;
    }
  }

  .table-area {
    width: 100%;
    height: calc(100vh - 10px);
    display: flex;
    align-items: center;
    flex-direction: column;

    .dimensionItem {
      display: flex;

      .scoreDetail {
        font-weight: bolder;
        width: 25%;
        margin-left: 5px;
      }
    }

    .table-column-actions {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
}

:deep(.el-slider__runway.disabled .el-slider__bar) {
  background-color: #7199e9;
}
</style>
