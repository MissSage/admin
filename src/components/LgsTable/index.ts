import { App } from '@vue/runtime-dom'
import index from './index.vue'

export default {
  install (app: App) {
    app.component('LgsTable', index)
  }
}
