<template>
  <div v-if="icon.includes('el-icon')">
    <el-icon>
      <component :is="iconName" />
    </el-icon>
  </div>
  <div v-else>
    <svg-icon :icon-class="icon" />
  </div>

  <span v-if="title">{{ title }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

// 定义组件的props
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

// 计算图标组件
const iconName = computed(() => {
  if (props.icon && props.icon.includes('el-icon')) {
    // 移除前缀并转换为 PascalCase 格式
    const name = props.icon.replace('el-icon-', '')
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  return null
})
</script>

<style scoped>
.el-icon {
  width: 1em;
  height: 1em;
  color: currentColor;
}
</style>
