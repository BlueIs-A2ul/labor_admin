<template>
  <!-- 渲染图标 -->
  <template v-if="icon">
    <i v-if="isElIcon" :class="[icon, 'sub-el-icon']" />
    <svg-icon v-else :icon-class="icon" />
  </template>

  <!-- 渲染标题 -->
  <span v-if="title" slot="title">{{ title }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

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

// 计算属性：是否为Element UI图标
const isElIcon = computed(() => props.icon && props.icon.includes('el-icon'))
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
