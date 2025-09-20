<template>
  <div v-permission="['annulReportManage']" class="app-container">
    <div class="title">
      <h3 style="color: #303133">关键词解读</h3>
      <el-button type="primary" @click="loadData">刷新</el-button>
    </div>
    <el-collapse v-loading="loading" accordion>
      <el-collapse-item v-for="keyword in keywords" :key="keyword.id">
        <template slot="title">
          <el-checkbox v-model="keyword.state == 1" label=""
            ><el-tag
              >{{ keyword.keyword }}*{{ keyword.frequency }}</el-tag
            ></el-checkbox
          >
        </template>
        <div>
          <el-input
          class="unscrambleTextArea"
            ref="unscrambleText"
            id="keywordUnscramble"
            v-model="keyword.unscramble"
            type="textarea"
            :rows="2"
            placeholder="写下关键词的解读"
            maxlength="300"
          />
          <div
            style="
              display: flex;
              justify-content: space-between;
              margin-top: 4px;
            "
          >
            <el-switch
              v-model="keyword.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="弃用"
              :active-value="1"
              :inactive-value="0"
            />
            <el-button
              type="primary"
              size="small"
              style="margin-right: -40%; font-size: 14px"
              @click="unscramble(keyword)"
              >智能解读</el-button
            >
            <el-button type="primary" @click="saveKeywordStatus(keyword)"
              >保存</el-button
            >
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import {
  reportKeyPage,
  updateReportKey,
  aiReportKey,
} from "@/api/report/reportKey";
import { getToken } from "@/utils/auth";

export default {
  name: "KeywordInterpretation",
  props: {
    batchId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      keywords: [],
    };
  },
  watch: {
    batchId: {
      handler(newval, oldval) {
        if (newval) {
          this.loadData();
        }
        return newval;
      },
      deep: true,
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      reportKeyPage({ page: 1, pageSize: 500, batchId: this.batchId })
        .then((res) => {
          const { data } = res;
          this.keywords = [];
          this.keywords = data.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    saveKeywordStatus(keyword) {
      updateReportKey(keyword)
        .then((res) => {
          this.$message.success("成功");
        })
        .catch((res) => {
          this.$message.error("保存失败");
        })
        .finally(() => {
          this.loadData();
        });
    },
    unscramble(keyword) {
      
      this.$message("AI思考中");
      fetch(
        `http://154.201.75.237:8100/curriculum/report_key/unscramble?message=${keyword.keyword}`,
        {
          headers: {
            swpu_token: getToken(),
          },
        }
      )
        .then((response) => {
          // 创建一个异步迭代器来读取数据流
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          return new ReadableStream({
            start(controller) {
              // 开始读取数据流
              function read() {
                reader
                  .read()
                  .then(({ done, value }) => {
                    if (done) {
                      controller.close();
                      return;
                    }
                    // 将数据显示在页面上
                    keyword.unscramble = "";
                    keyword.unscramble += decoder.decode(value, {
                      stream: true,
                    });
                    read();
                  })
                  .catch((error) => {
                    console.error("Error reading stream:", error);
                    controller.error(error);
                  });
              }
              read();
            },
          });
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          istextArea = false;
        });
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.unscrambleTextArea{

}
</style>
