import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'

const { body } = document
const WIDTH = 992
const appStore = useAppStore()
const route = useRoute()

export function useResizeHandler() {
  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const handleResize = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')

      if (mobile) {
        appStore.closeSideBar(true)
      }
    }
  }
}
