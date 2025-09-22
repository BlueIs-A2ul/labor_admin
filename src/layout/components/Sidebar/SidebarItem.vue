<template>
  <div v-if="!item.hidden">
    <template
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <Item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </AppLink>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <Item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <SidebarItem v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
        :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Item from './Item.vue'
import AppLink from './Link.vue'

import { isExternal } from '@/utils/validate'

const props = defineProps({
  item: {
    type: Object as () => MenuItem,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref<any>(null)

const hasOneShowingChild = (children: MenuItem[], parent: MenuItem) => {
  const ShowingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      onlyOneChild.value = item
    }
  })

  if (ShowingChildren.length === 1) {
    return true
  }

  if (ShowingChildren.length === 0) {
    onlyOneChild.value = {
      ...parent,
      path: '',
      noShowingChildren: true,
    }
    return true
  }

  return false
}

const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  //TODO 测试代码可用性
  const basePath = props.basePath || ''
  // 确保路径格式正确，避免重复的斜杠
  return basePath && routePath
    ? `${basePath.replace(/\/$/, '')}/${routePath.replace(/^\//, '')}`
    : (basePath || routePath)
}

type MenuItem = {
  id: number | string
  children: MenuItem[]
  hidden: boolean
  hasChildren?: boolean
  parentId?: number | string
  meta?: {
    icon?: string
    title?: string
  }
  path: string
  alwaysShow?: boolean
  noShowingChildren?: boolean
}
</script>

<style scoped></style>
