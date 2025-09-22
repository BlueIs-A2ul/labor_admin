import { defineStore } from 'pinia'
import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    showSettings: showSettings,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
  }),
  actions: {
    changeSetting(data: { key: keyof typeof defaultSettings; value: boolean }) {
      const { key, value } = data
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        //@ts-ignore
        this[key] = value
      }
    },
  },
})
