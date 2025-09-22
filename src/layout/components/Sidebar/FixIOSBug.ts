import { onMounted, type Ref } from 'vue'
import { useAppStore } from '@/stores/app'

export function useFixIOSBug() {
  const appStore = useAppStore()

  // 获取设备类型
  const getDevice = () => {
    return appStore.device
  }

  // 修复 iOS bug 的函数
  const fixBugIniOS = (subMenuRef: any) => {
    const $subMenu = subMenuRef
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave
      $subMenu.handleMouseleave = (e: Event) => {
        if (getDevice() === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  // 在组件挂载时自动执行修复
  const applyFixOnMounted = (subMenuRef: Ref<any>) => {
    onMounted(() => {
      // 这里需要传入实际的 subMenu 引用
      if (subMenuRef?.value) {
        fixBugIniOS(subMenuRef.value)
      }
    })
  }

  return {
    getDevice,
    fixBugIniOS,
    applyFixOnMounted,
  }
}
