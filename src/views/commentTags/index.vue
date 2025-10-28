<template>
  <div class="container">
    <!-- flex-direction: column; -->
    <el-row :gutter="24" type="flex" align="middle" justify="space-between" style="height: 100%">
      <el-col :span="24" class="box toolbar">
        <div class="searchBar">
          <div>
            <div id="keyWords">
              <div style="width: 45%">关键词:&nbsp;</div>
              <el-input v-model.trim="pagination.state" placeholder="查询课程建议与建议主题" clearable />
              <div class="searchButtons">
                <el-button @click="resetPagination">重置</el-button>
                <el-button type="primary" :disabled="!pagination.state" @click="loadList()">搜索</el-button>
              </div>
            </div>
          </div>
          <div>
            <el-button v-permission="['user.major', 'user.major.add']" type="primary" :icon="CirclePlus"
              @click="openModel(null)">
              添加主题
            </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24" class="box mainArea">
        <div style="width: 100%; height: 90%; margin-top: 10px; overflow-y: scroll">
          <el-table v-loading="loading" :data="commentTagList" border height="100%" style="width: 100%"
            :row-style="{ minHeight: 50 + 'px', height: 'auto' }" :cell-style="{ padding: 5 + 'px' }">
            <el-table-column fixed align="center" prop="name" label="建议与建议主题" />
            <el-table-column fixed align="center" min-width="300" prop="description" label="提示语" />
            <el-table-column v-permission="[
              'user.major',
              'user.major.update',
              'user.major.delete',
            ]" fixed="right" label="操作" width="300">
              <template #default=scope>
                <el-button v-permission="['user.major', 'user.major.update']" type="text" :icon="Edit"
                  @click="openModel(scope.row.id, true)">编辑</el-button>
                <el-popconfirm class="popConfirm" v-permission="['user.major', 'user.major.delete']"
                  confirm-button-text="我已知晓风险, 确定删除" confirm-button-type="danger" cancel-button-text="放弃本次操作"
                  :icon="InfoFilled" icon-color="red" title="当前课程评价维度正在投入使用, 确定要删除吗？"
                  @confirm="removeDimension(scope.row)">
                  <template #reference>
                    <el-button :icon="Delete" type="text" style="color: #f56c6c; margin-left: 30px">
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination :current-page="pagination.page" :page-sizes="[10, 15, 20, 30]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>
      </el-col>
    </el-row>
    <!-- :department-list="departmentList" -->
    <FormModel :comment-tag-id="currentDimensionId" :is-update="isUpdate" :visible="modelVisible"
      @success="handleSuccess" @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
import { commentTagsListApi, deleteCommentTagApi } from '@/apis/commentTags'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { Edit, Delete, InfoFilled, CirclePlus } from '@element-plus/icons-vue'
import FormModel from './components/formModel.vue'

const pagination = ref({
  page: 1,
  pageSize: 10,
  state: '',
})
const loading = ref(false)
const isUpdate = ref(false)
const commentTagList = ref<commentTagListItem[]>([])
const total = ref(0)
const modelVisible = ref(false)
const currentDimensionId = ref<string>('')

const loadList = async () => {
  loading.value = true
  const { page, pageSize, state } = pagination.value
  const res = await commentTagsListApi({
    page: String(page),
    pageSize: String(pageSize),
    state: String(state)
  })
  if (res.code === 200) {
    const { total: totalData, list } = res.data
    total.value = Number(totalData)
    const typedList = list as commentTagListItem[]
    commentTagList.value = typedList
  }
  else {
    ElMessage.error(res.message)
  }
  loading.value = false
}

const removeDimension = async (commentTag: { id: string }) => {
  const { id } = commentTag
  const res = await deleteCommentTagApi(id)
  if (res.success) {
    if (commentTagList.value.length === 1 && pagination.value.page === 1) {
      pagination.value.page--
    }
    ElMessage.success('删除成功')
    await loadList()
  } else {
    ElMessage.error('删除失败请重试')
  }
}

const handleSizeChange = async (val: number) => {
  pagination.value.pageSize = val
  await loadList()
}

const handlePageChange = async (val: number) => {
  pagination.value.page = val
  await loadList()
}

const resetPagination = async () => {
  pagination.value = {
    page: 1,
    pageSize: 10,
    state: '',
  }
  await loadList()
}

const handleClose = () => {
  modelVisible.value = false
}

const handleSuccess = async () => {
  await loadList()
}

const openModel = (dimensionId: string | null, isUpdateParams: boolean = false) => {
  currentDimensionId.value = dimensionId ?? ''
  isUpdate.value = isUpdateParams
  modelVisible.value = true
  console.log(modelVisible.value)
}

onMounted(async () => {
  await loadList()
})

interface commentTagListItem {
  icon: string
  id: string
  isDeleted: number
  name: string
  description: string
}
</script>

<style scoped lang="scss">
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
      height: 70px;
      // calc(100vh - 70px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: white;
    }

    .toolbar {
      height: 70px;

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
