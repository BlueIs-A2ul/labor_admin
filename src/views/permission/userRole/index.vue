<template>
  <div v-loading="loading" class="page">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="item">
            <div class="label">用户名：</div>
            <el-input v-model="keyWords" placeholder="请输入角色名" clearable size="small" />
          </div>
        </el-col>
        <el-col :span="4">
          <el-button size="small" @click="handleReset">重置</el-button>
          <el-button type="primary" size="small" :disabled="!keyWords" @click="queryTableData">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table :data="tableData" border stripe height="calc(100% - 104px)" :row-style="{ height: 50 + 'px' }"
      :cell-style="{ padding: 0 + 'px' }">
      <el-table-column prop="userName" align="center" label="用户名" />
      <el-table-column prop="roleNames" align="center" label="角色">
        <template v-slot="scope">
          {{
            scope.row.roleNames && scope.row.roleNames.length
              ? scope.row.roleNames.join("、")
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column v-if="['user.user.update', 'user.user.delete'].some((p) => userPermissions.includes(p))"
        align="center" label="操作" width="200">
        <template v-slot="scope">
          <!-- TODO placement配置 -->
          <el-button v-if="scope.row.id != 1" type="text" :icon="Edit" @click="handleRole(scope.row)">修改角色</el-button>
          <el-popconfirm confirm-button-text="我已知晓风险, 确定删除" confirm-button-type="danger" cancel-button-text="放弃本次操作"
            :icon="InfoFilled" icon-color="red" title="确定要删除该用户吗" @confirm="removeUser(scope.row.id)">
            <template #reference>
              <el-button :icon="Delete" slot="reference" type="text" style="color: #f56c6c; margin-left: 30px">
                删除
              </el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 15, 20, 30]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>
    <el-dialog v-permission="['user.user.add', 'user.user.update', 'user.user.delete']" title="选择角色"
      v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" top="25vh" width="30%">
      <el-select v-model="selectedRolesCopy" style="width: 100%" multiple placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
      </el-select>
      <template #footer class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="submitDisabled" @click="handleChange">修 改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Edit, Delete, InfoFilled } from '@element-plus/icons-vue'
import {
  bindRoleApi,
  unbindRoleApi,
  userPageApi,
  deleteUser,
} from '@/apis/user.ts'
import { useUserStore } from '@/stores/user'
import { getRoles } from '@/apis/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isArrEqual } from '@/apis/common'
import type { UserModel } from '@/types/apis/user'

const userStore = useUserStore()
const loading = ref(false)
const keyWords = ref<string | null>('')

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  key: '',
})

const tableData = ref<UserModel[]>([])
const total = ref(0)
const roleList = ref<any[]>([])
const dialogVisible = ref(false)

const userPermissions = computed(() => userStore.userPermissions as string[])

watch(keyWords, (newVal) => {
  if (!newVal) {
    queryRoleList()
    console.log(1)

  }
})

watch(dialogVisible, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      userId.value = null
      selectRoles.value = []
      selectedRolesCopy.value = []
    }, 480)
  }
})

watch(queryParams, () => {
  queryTableData()
}, { deep: true })


const queryTableData = async () => {
  loading.value = true
  try {
    const res = await userPageApi({
      pageNum: queryParams.value.pageNum,
      pageSize: queryParams.value.pageSize,
      key: keyWords.value,
      type: '1',
      withRole: '1',
    })
    tableData.value = res.data.list ?? []
    total.value = Number(res.data.total ?? 0)
  }
  catch (error) {
    console.log(error)
  }
  loading.value = false
}

const queryRoleList = async () => {
  const res = await getRoles()
  if (res.code === 200) {
    roleList.value = res.data as unknown as any[]
  }
}

const userId = ref<string | null>('')
const selectRoles = ref<any[]>([])
const selectedRolesCopy = ref<any[]>([])
const handleRole = async (row: any) => {
  userId.value = row.id
  selectRoles.value = row.roleIds
  selectedRolesCopy.value = JSON.parse(JSON.stringify(row.roleIds))
  console.log('selectRoles', selectRoles.value)
  dialogVisible.value = true
}

const submitDisabled = computed(() => isArrEqual(selectRoles.value, selectedRolesCopy.value))

const handlePageChange = (newPage: number) => {
  queryParams.value.pageNum = newPage;
}

const handleSizeChange = (newSize: number) => {
  queryParams.value.pageSize = newSize;
}

const handleReset = async () => {
  keyWords.value = null;
  await queryTableData();
}

const removeUser = async (id: string) => {
  const res = await deleteUser(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    queryTableData()
  } else {
    ElMessage.error(res.message)
  }
}

const handleChange = async () => {
  const res = await ElMessageBox.confirm('此操作将改变用户的权限, 确定继续吗?', '提示', {
    confirmButtonText: '我已知晓风险, 确定修改',
    cancelButtonText: '取消',
    type: 'warning',
  })

  if (res === 'confirm') {
    const bindIds = selectedRolesCopy.value.filter(e => selectRoles.value.includes(e))
    const unBindIds = selectRoles.value.filter(e => selectedRolesCopy.value.includes(e))
    const addFetch = bindIds.map(async (id) => await bindRoleApi(userId.value ?? '', id))
    const delFetch = unBindIds.map(async (id) => await unbindRoleApi(userId.value ?? '', id))

    const ans = await Promise.all([...addFetch, ...delFetch])
    if (ans.every(e => e.code === 200)) {
      ElMessage.success('修改成功')
      dialogVisible.value = false
      queryTableData()
    } else {
      ElMessage.error('修改失败')
    }
  }
}

onMounted(() => {
  queryTableData()
  queryRoleList()
})

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: calc(100vh - 50px);
  padding: 10px;
  background: #f5f5f5;

  .header {
    background: #fff;
    margin-bottom: 10px;
    padding: 10px 10px 10px 10%;

    /*     .createRole{
      position: relative;
      left: 40%;
      ::v-deep{

      }
    } */
    .item {
      display: flex;
      align-items: center;

      .label {
        width: 100px;
        text-align: right;
        margin-right: 10px;
        color: #838383;
      }
    }
  }

  :deep(.el-pagination) {
    text-align: center;
    margin-top: 10px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    margin-top: 10px;
  }
}
</style>
