import { App } from '@vue/runtime-dom'
import index from './LgsTable.vue'

export default {
  install (app: App) {
    app.component('LgsTable', index)
  }
}
