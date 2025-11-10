<template #footer>
  <span class="dialog-footer" style="position: relative; left: 70%;">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleSuccess" :loading="submitLoading">{{ isUpdate ? '更新' :
      '添加' }}</el-button>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  handleClose: () => void;
  submitLoading: boolean;
  handleSuccess: () => void;
  isUpdate: boolean;
}>()
</script>
