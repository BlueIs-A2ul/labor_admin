<template>
  <div>
    <el-dialog
      :title="!isUpdate ? '创建积分' : '更新积分'"
      :visible="visible"
      width="50%"
      :show-close="false"
    >
      <el-form ref="form" :model="form">
        <el-form-item label="学院" required>
          <el-select
            multiple
            collapse-tags
            v-model="departmentIdList"
            placeholder="请选择学院"
            style="width: 46%"
            :disabled="checkRole"
          >
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.departmentName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分数" required>
          <el-input
            v-model="form.point"
            placeholder="请输入分数"
            style="width: 35%"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            style="width: 46%"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createScoreApi, updateScoreApi } from "@/api/score/score";

export default {
  props: ["formData", "scoreId", "isUpdate", "visible"],
  data() {
    return {
      form: {},
      departmentIdList: [],
      departmentList: [],
      typeList: [
        { label: "学生完成课程签到", value: 0 },
        { label: "学生写下寄语", value: 1 },
        { label: "完成目标", value: 2 },
        { label: "评价课程时完成高质量评价", value: 3 },
        { label: "教师对学生进行考评", value: 4 },
        { label: "完成评价", value: 5 },
      ],
    };
  },
  computed: {
    ...mapGetters(["department", "userDepartmentId"]),
    checkRole() {
      if (this.userDepartmentId) {
        this.departmentIdList.push(this.userDepartmentId);
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    visible(newVal) {
      this.form = {};
      if (this.isUpdate) {
        this.form = this.formData;
        console.log(this.form.departmentId);
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.departmentList = this.department;
    },
    createScore() {
      this.departmentIdList.forEach((departmentId) => {
        this.form.departmentId = departmentId;
        createScoreApi(this.form).then((res) => {
          if (res.code == 200) {
            this.$message.success("创建成功");
            this.$emit("onSuccess");
          }
        });
      });
    },
    updateScore() {
      updateScoreApi(this.form).then((res) => {
        if (res.code == 200) {
          this.$message.success("更新成功");
          this.$emit("onSuccess");
        }
      });
    },
    close() {
      this.$emit("onClose");
    },
    submit() {
      this.typeList.forEach((item) => {
        if (item.value == this.form.type) {
          this.form.origin = item.label;
        }
      });
      this.form.state = 1;
      if (this.isUpdate) {
        this.updateScore();
      } else {
        this.createScore();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
