import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 将Cookies.get结果存储在变量中避免重复调用
  const sidebarStatus = Cookies.get('sidebarStatus')
  const sidebar = {
    opened: sidebarStatus ? !!+sidebarStatus : true,
    withoutAnimation: false,
  }
  const device = ref('desktop')

  const toggleSideBar = () => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = false
    if (sidebar.opened) {
      Cookies.set('sidebarStatus', '1')
    } else {
      Cookies.set('sidebarStatus', '0')
    }
  }

  const closeSideBar = (withoutAnimation: boolean) => {
    Cookies.set('sidebarStatus', '0')
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (deviceUpdate: string) => {
    device.value = deviceUpdate
  }

  return {
    sidebar,
    device,
    toggleSideBar,
    closeSideBar,
    toggleDevice,
  }
})
