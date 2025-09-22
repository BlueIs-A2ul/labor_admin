<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cacheRoute" :exclude="noCacheRoutes">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const key = computed(() => route.path)

const cacheRoute = ref([
  'departmentTable',
  'majorTable',
  'templateTable',
  'wordTable',
  'wordTypeTable',
  'roleTable',
  'userTable',
  'rankList',
  'stuTable',
  'semesterTable',
  'reportBatchTable',
])

const noCacheRoutes = ref([
  //TODO 给我改成introduction啊
  'introduation'
])
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
