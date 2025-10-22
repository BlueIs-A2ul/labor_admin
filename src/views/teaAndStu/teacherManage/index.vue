<template>
  <div class="app-container" v-loading="loading">
    <div class="searchBar">
      <div>
        <div id="keyWords">
          <div style="width: 45%">关键词:&nbsp;</div>
          <el-input v-model="keyWords" placeholder="请输入内容" clearable />
          <div class="searchButtons">
            <el-button @click="keyWords = ''">重置</el-button>
            <el-button type="primary" :disabled="searchDisabled" @click="loadList">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="buttons">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">添加教师</el-button>
      </div>
    </div>

    <div class="teacher-list">
      <el-table :data="teacherList" :row-style="{ height: '30px' }" stripe height="100%" style="width: 100%">
        <el-table-column label="序号" min-width="50" align="center">
          <template #default="scope">
            <div>{{ scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="50" align="center" />
        <el-table-column prop="sex" label="性别" min-width="50" align="center">
          <template v-slot="scope">
            <el-tag v-if="scope.row.sex === 1">男</el-tag>
            <el-tag v-else type="danger">女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="职称" min-width="120" align="center" />
        <el-table-column prop="contact" label="联系方式" min-width="120" align="center">
          <template #default="scope">
            <div>
              <el-popover placement="right" width="250" title="联系方式" trigger="click">
                <div style="display: flex; flex-direction: column">
                  <div v-for="(entry, index) in Object.entries(scope.row.contact)" :key="index" style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                      width: 100%;
                      margin-top: 10px;
                      font-weight: bold;">
                    <div style="width: 30%; border-left: 4px solid #409eff; padding-left: 8px;">
                      {{ entry[0] }}
                    </div>
                    <div style="width: 70%">
                      {{ entry[1] }}
                    </div>
                  </div>
                </div>
                <template #reference>
                  <el-button type="text">查看</el-button>
                </template>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="50" align="center">
          <template v-slot="scope">
            <div class="buttons">
              <el-button type="primary" size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-popconfirm confirm-button-text="好的" cancel-button-text="不用了" icon="el-icon-info" icon-color="red"
                :title="`确认删除${scope.row.name}吗?`" @onConfirm="handleDel(scope.row.id)">
                <template #reference>
                  <el-button type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination :page-size="pageParams.pageSize" :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" :current-page="pageParams.pageNum"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <TeacherModal :visible="dialogTableVisible" :teacher="currentTeacher" :isUpdate="isUpdate" />
  </div>
</template>

<script setup lang="ts">
import { clearObj } from '@/apis/common'
import { deleteTeacher, teacherListApi } from '@/apis/teacher'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import TeacherModal from './teacherModel.vue'

const isUpdate = ref(true)
const dialogTableVisible = ref(false)
const currentTeacher = ref({})
const keyWords = ref('')
const loading = ref(false)
const total = ref(1)
const teacherList = ref<TeacherListItem[]>([])
const pageParams = ref({
  pageNum: 1,
  pageSize: 10,
})
const searchDisabled = computed(() => keyWords.value === '')
console.log('1')

const handleCreate = () => {
  isUpdate.value = false
  clearObj(currentTeacher.value)
  dialogTableVisible.value = true
}

const handleSizeChange = async (newSize: number) => {
  pageParams.value.pageSize = newSize
  await loadList()
}

const handleCurrentChange = async (newPage: number) => {
  pageParams.value.pageNum = newPage
  await loadList()
}

const handleUpdate = (row: any) => {
  isUpdate.value = true
  currentTeacher.value = row
  dialogTableVisible.value = true
}

const handleClose = () => {
  dialogTableVisible.value = false
}

const handleDel = async (row: any) => {
  const res = await deleteTeacher(row)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    await loadList()
  } else {
    ElMessage.error('删除失败请重试')
  }
}

const loadList = async () => {
  loading.value = true
  let { pageNum, pageSize } = pageParams.value
  const res = await teacherListApi({
    pageNum: String(pageNum),
    pageSize: String(pageSize),
    key: keyWords.value,
  })
  if (res.code === 200) {
    const { data } = res as unknown as { data: TeacherList }
    teacherList.value = data.list
    total.value = data.total
  } else {
    ElMessage.error('加载失败请重试')
  }
  loading.value = false
}

onMounted(async () => {
  await loadList()
})

watch(keyWords, async (newVal, oldVal) => {
  pageParams.value.pageNum = 1
  await loadList()
}, { immediate: true })

interface TeacherList {
  list: TeacherListItem[]
  total: number
}

interface TeacherListItem {
  contact: {
    QQ: string
    WeChat: string
    Phone: string
    Email: string
  }
  name: string
  sex: string
  title: string
}
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

  .teacher-list {
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
