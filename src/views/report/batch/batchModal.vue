<template>
  <div
    v-permission="[
      'curriculum.report',
      'curriculum.report.add',
      'curriculum.report.update',
    ]"
  >
    <el-dialog
      v-loading="loading"
      :title="getTitle()"
      :visible.sync="batchModalVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <el-form
          ref="ruleForm"
          label-position="right"
          label-width="80px"
          top="2vh"
          :model="batch"
          :rules="rules"
        >
          <el-form-item label="名称" prop="reportBatchName">
            <el-input v-model="batch.reportBatchName" />
          </el-form-item>
          <el-form-item label="数据收集" prop="time">
            <el-date-picker
              v-model="batch.time"
              :disabled="isUpdate"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            />
          </el-form-item>
          <el-form-item label="学生可见" prop="visibility">
            <el-switch
              v-model="batch.visibility"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              active-text="用户可见"
              inactive-text="用户隐藏"
            />
          </el-form-item>
          <el-form-item :label="'封面'" prop="cover">
            <div id="title">
              <el-upload
                ref="uploadFile"
                class="uploadCover"
                :action="uploadUrl"
                list-type="picture-card"
                accept="image/jpeg,image/jpg,image/png"
                :limit="1"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :on-success="handleSuccess"
              >
                <img
                  v-if="batch.cover"
                  :src="batch.cover"
                  style="width: 112px; height: 112px"
                  alt=""
                />
                <i v-else class="el-icon-plus" />
              </el-upload>
              <div style="color: red; font-size: 13px">
                上传图片, 建议.jpg格式, 大小20M以内
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="butSuccess">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createReportBatch,
  getReportBatch,
  updateReportBatch,
} from "@/api/report/AcademicYearReport";

export default {
  name: "BatchModal",
  props: {
    batchModalVisible: {
      type: Boolean,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    batchId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + process.env.VUE_APP_UPLOAD_URL,
      loading: false,
      batch: {
        reportBatchName: "",
        visibility: "",
        start: "",
        end: "",
        cover: "",
        time: [],
      },
      hasCover: false,
      rules: {
        reportBatchName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        time: [{ required: true, message: "请选择时间", trigger: "blur" }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  watch: {
    batchId: {
      handler(newval, oldval) {
        if (this.isUpdate) {
          this.loadData();
        }
        return newval;
      },
      deep: true,
    },
    hasCover: {
      handler(newV, oldV) {
        document.querySelector(".el-upload--picture-card").style.display = newV
          ? "none"
          : "flex";
      },
    },
    batchModalVisible: {
      handler(newVal) {
        if (!newVal) {
          this.handleClearForm();
        }
      },
    },
    isUpdate: {
      handler(newVal) {
        if (!newVal) {
        }
      },
    },
  },
  emits: ["close", "success"],
  methods: {
    getTitle() {
      if (this.isUpdate) {
        return "修改信息";
      } else {
        return "生成报告";
      }
    },
    loadData() {
      getReportBatch(this.batchId).then((res) => {
        const { data } = res;
        this.batch = data;
      });
    },
    handleClose() {
      this.$emit("close");
    },
    handleRemove(file, fileList) {
      this.hasCover = false;
      this.batch.cover = "";
    },
    handleChange(file, fileList) {
      this.hasCover = fileList.length >= 1;
    },
    handleSuccess({ code, data, message }, file) {
      if (code == 200) {
        this.batch.cover = data;
        this.hasCover = true;
        this.$message.success("上传成功");
      } else if (message == "系统异常=>Maximum upload size exceeded") {
        this.$message.error("文件大小不能超过20M");
      } else {
        this.$message.error("文件上传失败");
      }
    },
    async butSuccess() {
      if (!this.isUpdate) {
        this.batch.start = this.batch.time[0];
        this.batch.end = this.batch.time[1];
      }
      const fetch = this.isUpdate
        ? updateReportBatch(this.batch)
        : await createReportBatch(this.batch);

      fetch.then(({ code }) => {
        if (code == 200) {
          if (!this.isUpdate) {
            Object.keys(this.batch).forEach((key) => {
              this.batch[key] = key == "time" ? [] : "";
            });
          }
          this.$message.success(`${this.isUpdate ? "更新" : "添加"}成功`);
          this.$emit("success");
        } else {
          this.$message.error("发生错误, 创建失败");
        }
      });
    },
    handleClearForm() {
      this.hasCover = false;
      this.$refs.ruleForm.resetFields();
      this.$refs.uploadFile.clearFiles();
      this.batch.start = "";
      this.batch.end = "";
    },
  },
};
</script>
