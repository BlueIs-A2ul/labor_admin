<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="nickname">{{ name }}</span>
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu #dropdown class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 系统首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://www.swpu.edu.cn/">
            <el-dropdown-item>学校官网</el-dropdown-item>
          </a>
          <a target="_blank"
            href="https://sso.swpu.edu.cn/login?service=https:%2F%2Fmy.swpu.edu.cn%2FEIP%2Fcaslogin.jsp">
            <el-dropdown-item>服务门户</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/stores/permission'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const appStore = useAppStore()
const router = useRouter()

const logout = async () => {
  await userStore.userLogout()
  await permissionStore.clearMap()

  router.push('/login')
}

const toggleSideBar = () => {
  appStore.toggleSideBar()
}

const sidebar = computed(() => appStore.sidebar)
const name = computed(() => userStore.name)
const avatar = computed(() => userStore.avatar)
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;

        .nickname {
          font-size: 16px;
          font-weight: bold;
          margin-right: 20px;
        }

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
