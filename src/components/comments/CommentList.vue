<template>
  <div class="box">
    <el-divider content-position="right">
      <div style="font-size: 23px; font-weight: 700">
        全部评价<span style="margin-left: 15px; font-size: 25px">{{
          total
        }}</span>
      </div>
    </el-divider>
    <div style="overflow-y: auto; flex: 1">
      <div v-if="total != 0" style="max-height: 400px">
        <!-- TODO v-if 原本是 comment.createBy.id 但是没有这个属性 猜测一下是使用userId  -->
        <div v-for="(comment, index) in evaluateList" :key="index" class="everComment">
          <el-avatar v-if="comment.createBy.userId != '****'" :size="45"
            :src="comment.createBy.avatar || defaultAvatar" />
          <el-avatar v-else :size="45" icon="el-icon-user-solid" />
          <div class="main">
            <div class="userInfo">
              <div class="baseInfo">
                {{
                  comment.createBy.userId != "****"
                    ? comment.createBy.name
                    : "匿名用户"
                }}
                <div class="instituted">
                  {{
                    comment.createBy.userId != "****"
                      ? comment.createBy.department
                      : " "
                  }}
                </div>
              </div>
              <div class="time">
                {{ comment.gmtCreate }}
              </div>
            </div>
            <div class="texts">
              {{ comment.evaluateText }}
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无评论" />
    </div>
    <div style="height: 4%; width: 100%">
      <el-pagination style="margin: 0 auto; width: fit-content" :page-size="pagination.pageSize" :total="total"
        layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 15, 20, 25, 30]" medium
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCommentsToLessons } from '@/apis/lesson'
import { useUserStore } from '@/stores/user'
import type { CommentItem } from '@/types'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'


const userStore = useUserStore()

const props = defineProps<{
  id: string
}>()

const pagination = ref({
  courseId: 1,
  page: 1,
  pageSize: 10
})
const evaluateList = ref<CommentItem[]>([])
const total = ref(0)
const currentPage = 1

const defaultAvatar = computed(() => userStore.defaultAvatar)

watch(() => props.id, (newId) => {
  if (newId) {
    pagination.value.courseId = Number(newId)
    loadList()
  }
}, {
  immediate: true
})

const handleSizeChange = (newSize: number) => {
  pagination.value.pageSize = newSize
  loadList()
}

const handleCurrentChange = (newPage: number) => {
  pagination.value.page = newPage
  loadList()
}

const loadList = async () => {
  try {
    const { courseId, page, pageSize } = pagination.value
    const res = await getCommentsToLessons({
      courseId: String(courseId),
      page: String(page),
      pageSize: String(pageSize)
    })
    if (res.code === 200) {
      console.log(res.data)
      const { list, total: totalTEMP } = res.data as unknown as {
        list: CommentItem[],
        total: string
      }
      evaluateList.value = list
      total.value = Number(totalTEMP)
    } else {
      ElMessage.error('获取评价列表失败,检查网络后重试')
    }
  } catch (_) {
    ElMessage.error('获取评价列表失败,检查网络后重试')
  }
}

onMounted(() => {
  loadList()
})
</script>

<style lang="scss" scoped>
.texts {
  font-size: 16px;
  color: rgba(70, 69, 69, 0.719);
  line-height: normal;
  word-break: break-all;
  letter-spacing: 1px;
  margin-top: 10px;
}

.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.everComment {
  padding: 20px 30px 15px 30px;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  min-height: 150px;

  .main {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-left: 17px;
    height: auto;
    min-height: 130px;

    .userInfo {
      font-weight: 500;
      font-size: 22px;
      display: flex;
      justify-content: space-between;

      .baseInfo {
        display: flex;
        flex-direction: column;
      }

      .institude {
        font-size: 13px;
        height: 13px;
        margin-top: 5px;
        color: grey;
      }

      .time {
        font-size: 16px;
        color: #8080807d;
        margin-top: 5px;
      }
    }
  }
}
</style>
