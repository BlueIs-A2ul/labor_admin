<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const type = computed(() => {
  if (isExternal(props.to)) {
    return 'a'
  } else {
    return 'router-link'
  }
})

const linkProps = (to: string) => {
  if (isExternal(to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return { to }
}
</script>

<style scoped></style>
