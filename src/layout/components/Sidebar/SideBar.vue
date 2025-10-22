<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="typedVariables.menuBg"
        :text-color="typedVariables.menuText" :unique-opened="false" :active-text-color="typedVariables.menuActiveText"
        :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import { useFixIOSBug } from './FixIOSBug'
import { computed, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import variables from '@/styles/variables.module.scss'
const typedVariables = variables as any
console.log(typedVariables)

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const route = useRoute()

const menuWrap = ref<HTMLDivElement>()

const isCollapse = computed(() => !appStore.sidebar.opened)
const permission_routes = computed(() => permissionStore.routes)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta && meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const showLogo = computed(() => settingsStore.sidebarLogo)

watch(() => route.path, () => {
  const { fixBugIniOS } = useFixIOSBug()

  if (appStore.device === 'mobile' && appStore.sidebar.opened) {
    appStore.toggleSideBar()
  }
  // 调用修复iOS bug的方法
  fixBugIniOS(menuWrap.value)
}, { immediate: true })

</script>
