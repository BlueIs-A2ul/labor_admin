<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="typedVariables.menuBg"
        :text-color="typedVariables.menuText" :unique-opened="false" :active-text-color="typedVariables.menuActiveText"
        :collapse-transition="false" mode="vertical">
        <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />

      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/variables.scss'

import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { usePermissionStore } from '@/stores/permission'
import { useFixIOSBug } from './FixIOSBug'
import { computed, ref, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const route = useRoute()

const menuWrap = ref<HTMLDivElement>()
const typedVariables = variables as Variables

const isCollapse = computed(() => appStore.sidebar.opened === false)
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

interface Variables {
  menuText: string;
  menuActiveText: string;
  subMenuActiveText: string;
  menuBg: string;
  menuHover: string;
  subMenuBg: string;
  subMenuHover: string;
  sideBarWidth: string;
}
</script>
