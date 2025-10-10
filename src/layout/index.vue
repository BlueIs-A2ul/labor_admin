<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && sidebarState.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Navbar, Sidebar, AppMain } from './components'
import { useAppStore } from '@/stores/app'
import { useSettingsStore } from '@/stores/settings'
import { computed } from 'vue'

const appStore = useAppStore()
const settingsStore = useSettingsStore()

const classObj = computed(() => ({
  hideSidebar: !appStore.sidebar.opened,
  openSidebar: appStore.sidebar.opened,
  withoutAnimation: appStore.sidebar.withoutAnimation,
}))

const device = computed(() => appStore.device)
//!不要使用sidebar命名，会和组件的命名冲突
const sidebarState = computed(() => appStore.sidebar)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const handleClickOutside = () => {
  appStore.closeSideBar(false)
}


</script>

<style lang="scss" scoped>
@use "@/styles/mixin.scss" as *;
@use "@/styles/variables.scss" as *;

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  background: #f5f5f5;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
