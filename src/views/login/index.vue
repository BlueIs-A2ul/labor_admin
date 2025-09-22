<template>
  <div class="login-container">
    <div class="bg">
      <div class="mask"></div>
      <video class="maskVideo" autoplay loop preload muted>
        <source src="./seaCloud.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="mainArea">
      <video class="topVideo" autoplay loop preload muted>
        <source src="./seaCloud.mp4" type="video/mp4" />
      </video>
      <div class="menu">
        <div class="info">
          <ul>
            <li>课程考评系统</li>
            <li>Welcome!</li>
            <li>Back To Admin!</li>
          </ul>
        </div>

        <div>
          <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="loginRules" class="login-form"
            label-width="auto" label-position="left">
            <div class="title-container">
              <h3 class="title">登录</h3>
            </div>
            <el-form-item prop="username">
              <span class="svg-container">
                <User style="color: white; font-size: 20px" />
              </span>
              <el-input v-model="loginForm.username" placeholder="请输入用户名" type="text" tabindex="1" />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <Lock style="color: white; font-size: 20px" />
              </span>
              <el-input v-model="loginForm.password" type="password" show-password autocomplete="off"
                placeholder="请输入密码" tabindex="2" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleLogin"
                style="width: 100%; display: flex; justify-content: center; letter-spacing: 5px">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑
// TODO 登录页面样式
import { reactive } from 'vue'
import { validUsername } from '@/utils/validate'
import { Lock, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
})

const validateUsername = (
  rule: Record<string, unknown>,
  value: string,
  callback: (error?: Error) => void,
) => {
  if (validUsername(value)) {
    callback(new Error('用户名不能含有特殊字符'))
  } else {
    callback()
  }
}

const validatePassword = (
  rule: Record<string, unknown>,
  value: string,
  callback: (error?: Error) => void,
) => {
  //密码格式限制，以后看有没有需要改
  if (value.length < 4) {
    callback(new Error('密码不得少于4个字符'))
  } else {
    callback()
  }
}

const loginRules = {
  username: [{ required: true, validator: validateUsername, trigger: ['input', 'blur'] }],
  password: [{ required: true, validator: validatePassword, trigger: ['input', 'blur'] }],
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.error('请输入账号密码')
    return
  }

  try {
    const res = await userStore.userLogin(loginForm)
    if (res) {
      // 先获取用户信息和权限，再进行路由跳转
      const roles = await userStore.fetchUserInfo()
      await permissionStore.generateRoutes(roles)
      router.push('/dashboard')
    }
  } catch (err) {
    ElMessage.error(err as string)
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$input_bg: rgba(255, 255, 255, 0.9); // 输入框背景改为不透明的白色

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: $input_bg;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

video {
  z-index: -10;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.bg {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;

  .mask {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    min-height: 100%;
    backdrop-filter: blur(20px);
  }

  .maskVideo {
    z-index: -10;
    min-width: 100%;
    min-height: 100%;
  }
}

/*   @media (min-aspect-ratio: 16/9){
      video{
        width: 100%;
        height: auto;
      }
    } */
@media (max-aspect-ratio: 16/9) {
  video {
    height: 100%;
    width: auto;
  }
}

.topVideo {
  z-index: -1;
  min-height: 40%;
  min-width: 80%;
}

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;

  overflow: hidden;

  .login-form {
    z-index: 20;
    position: relative;
    width: 25vw;
    max-width: 100%;
    padding: 3vw 2vw 0;
    margin: 0 auto;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border-radius: 30px;
    border: solid 3px rgba(246, 241, 241, 0);
    transition: all 0.2s ease;

    &:hover {
      border: solid 3px rgba(246, 241, 241, 0.87);
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $light_gray; // 调整图标容器颜色，确保一致性
    vertical-align: middle;
    width: 40px; // 略微增大图标容器宽度
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.mainArea {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 80%;
  min-height: 70vh;
  border-radius: 30px;
  box-shadow: 0 0 30px rgba(188, 187, 187, 0.2);
  overflow: hidden;

  video {
    z-index: 10;
  }
}

.menu {
  z-index: 50;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-width: 90%;
}

.info {
  color: white;
  font-weight: 900;
  height: 100%;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li:first-child {
      font-size: 4em;
      letter-spacing: 5px;
      position: relative;
      top: -21vh;
    }

    li:nth-child(2),
    li:nth-child(3) {
      font-size: 2em;
    }
  }

  ul:hover {
    cursor: default;
  }
}
</style>
