<template>
  <div class="container">
    <el-row v-if="$route.meta.showFather" :gutter="24" type="flex" justify="space-between" align="middle"
      style="flex-direction: column; height: 100%">
      <el-col :span="24" class="box toolbar">
        <div class="searchBar">
          <div>
            <div id="keyWords">
              <div style="width: 45%">关键词:&nbsp;</div>
              <el-input v-model="pagination.key" placeholder="查询能力维度" clearable />
              <div class="searchButtons">
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" :disabled="!pagination.key" @click="loadList()">搜索</el-button>
              </div>
            </div>
          </div>
          <div>
            <span style="color: #5a5e66">筛选:&nbsp;</span>
            <el-select v-model="pagination.category" collapse-tags filterable clearable placeholder="筛选活动类别"
              style="width: 380px" @change="loadList">
              <el-option v-for="item in " :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <div id="openModal">
            <el-button v-permission="['user.major', 'user.major.add']" type="primary" icon="el-icon-circle-plus-outline"
              @click="openModal(null)">添加能力维度</el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="24" class="box mainArea">
        <div style="width: 100%; height: 90%; margin-top: 10px; overflow-y: scroll">
          <el-table v-loading="loading" :data="dimensionList" border height="100%" style="width: 100%"
            :row-style="{ minHeight: 50 + 'px', height: 'auto' }" :cell-style="{ padding: 5 + 'px' }">
            <el-table-column prop="department" label="适用范围" width="350" align="center" column-key="category">
              <template #default="scope">
                <el-tag>{{ scope.row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="能力维度名" />
            <el-table-column label="默认占比" align="center">
              <template #default="scope">
                {{ scope.row.scale * 100 }}%
              </template>
            </el-table-column>
            <el-table-column v-permission="[
              'user.major',
              'user.major.update',
              'user.major.delete',
            ]" fixed="right" label="操作" width="300">
              <template #default="scope">
                <el-button v-permission="['user.major', 'user.major.update']" type="text" icon="el-icon-edit-outline"
                  @click="openModal(scope.row.category, true)">
                  编辑
                </el-button>
                <el-button id="info" v-permission="['user.major', 'user.major.update']" type="text"
                  icon="el-icon-tickets" @click="jumpToDetail(scope.row)">
                  详情
                </el-button>
                <template v-permission="['user.major', 'user.major.delete']">
                  <el-popconfirm confirm-button-text="我已知晓风险, 确定删除" confirm-button-type="danger"
                    cancel-button-text="放弃本次操作" icon="el-icon-info" icon-color="red"
                    title="确定要删除该能力维度配置吗, 若该维度正在使用, 删除后可能导致数据丢失" @confirm="removeDimension(scope.row)">
                    <el-button icon="el-icon-delete" slot="reference" type="text"
                      style="color: #f56c6c; margin-left: 30px">
                      删除
                    </el-button>
                  </el-popconfirm>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="display: flex; align-items: flex-start; height: 8%">
          <el-pagination :current-page="pagination.page" :page-sizes="[10, 15, 20, 30]" :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handlePageChange" />
        </div>
      </el-col>
    </el-row>
    <dimension-modal v-if="$route.meta.showFather" :category="selectCategory" :is-update="isUpdate"
      :modal-visible="modelVisible" @success="handleSuccess" @close="handleClose" />
    <router-view v-if="!$route.meta.showFather"></router-view>
  </div>
</template>

<script setup lang="ts">
import { dimensionalityListApi } from '@/apis/dimensionality'
import { onMounted, ref } from 'vue'


const pagination = ref({
  page: 1,
  pageSize: 15,
  key: '',
  category: ''
})
const total = ref(0)
const selectCategory = ref('')
const loading = ref(false)
const isUpdate = ref(false)
const categoryList = ref([
  '通用',
  '公益服务劳动',
  '劳动理论学习',
  '日常生活劳动',
  '生产顶岗劳动',
  '其他方式劳动',
  '“三下乡”社会实践',
])
const dimensionList = ref([])
const modelVisible = ref(false)
const currentDimensionId = ref()

const loadList = async () => {
  loading.value = true
  const { page, pageSize, key, category } = pagination.value
  const res = await dimensionalityListApi({
    page: String(page),
    pageSize: String(pageSize),
    key,
    category
  })
  if (res.code === 200) {
    console.log(res.data)
    const { total, list } = res.data
    dimensionList.value = list
  }
  loading.value = false
}
console.log('e')

onMounted(async () => {
  await loadList()
})
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
