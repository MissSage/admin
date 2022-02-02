import { App } from 'vue'
import LgsLayer from '@/plugins/LgsLayer'
export default {
  install (app:App) {
    app.config.globalProperties.$layer = new LgsLayer()
    app.provide('globalProperties', app.config.globalProperties)
  }
}
