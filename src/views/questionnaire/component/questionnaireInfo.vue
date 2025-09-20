<template>
  <div>
    <el-dialog
      title="问卷详情"
      :visible="isVisible"
      width="50%"
      :show-close="false"
    >
      <el-form ref="form" :model="formInfo">
        <el-form-item label="关系" v-if="formInfo.relation">
          {{ formInfo.relation }}</el-form-item
        >
        <el-form-item label="机构单位" v-if="formInfo.unitName"
          >{{ formInfo.unitName }}
        </el-form-item>
        <el-form-item label="职位" v-if="formInfo.jobTitle"
          >{{ formInfo.jobTitle }}
        </el-form-item>
        <el-form-item label="证明材料"
          ><el-image
            style="width: 100px; height: 100px"
            :src="formInfo.proofPicture"
            :fit="fit"
          ></el-image
        ></el-form-item>
        <el-form-item label="反馈与建议"
          >{{ showAdviceContent() }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["isVisible", "formInfo"],
  data() {
    return {};
  },
  watch: {
    isVisible(newVal) {
      console.log(this.formInfo, "formINfo");
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("onSuccess");
    },
    showAdviceContent() {
      const arr = this.formInfo.items.filter(
        (item) => item.title == "反馈与建议"
      );
      return arr.length ? arr[0].text : "无";
    },
  },
};
</script>

<style lang="scss" scoped></style>
