<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pathToRegexp from "path-to-regexp"
import type { RouteLocationMatched } from 'vue-router'

const route = useRoute()
const router = useRouter()
const levelList = ref<RouteLocationMatched[]>([])

const pathCompile = (path: string) => {
  const { params } = route
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}

const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    if (typeof redirect === 'function') {
      const redirectResult = redirect(route)
      router.push(redirectResult)
    } else {
      router.push(redirect)
    }
    return
  } else if (
    route.name === "introduction" &&
    item.path === "/nested/lessonsManage/lessonDetail"
  ) {
    router.push({ path: path, query: route.query })
    return
  }
  router.push(pathCompile(path))
}

const isDashboard = (route: RouteLocationMatched) => {
  const name = route && route.name
  if (!name) {
    return false
  }
  return typeof name === 'string' && name.trim().toLocaleLowerCase() === "dashboard"
}

const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]

  // if (!isDashboard(first)) {
  //   matched = [{ path: "/dashboard", meta: { title: "首页" } }].concat(matched)
  // }
  if (!isDashboard(first)) {
    console.log('!isDashboard')
    matched = [{
      path: "/dashboard",
      meta: { title: "首页" },
      name: "dashboard",
      components: null,
      redirect: undefined,
      props: {},
      children: [],
      beforeEnter: undefined,
      leaveGuards: new Set(),
      updateGuards: new Set(),
      enterCallbacks: {},
      instances: {},
      aliasOf: undefined
    } as unknown as RouteLocationMatched].concat(matched)
  }

  levelList.value = matched.filter(
    (item) => {
      console.log('item', item)
      return item.meta && item.meta.title
    }
  )
  console.log('levelList', levelList.value)
}

watch(
  () => route.path,
  () => { getBreadcrumb() },
  { immediate: true })
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
