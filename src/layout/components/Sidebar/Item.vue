<template>
  <div v-if="icon.includes('el-icon')">
    <i :class="['sub-el-icon', icon]" />
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

const isElIcon = computed(() =>
  props.icon && (props.icon.includes('el-icon') || props.icon.includes('element')))
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
