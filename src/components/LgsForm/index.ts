import { App } from '@vue/runtime-dom'
import index from './LgsForm.vue'

export default {
  install (app: App) {
    app.component('LgsForm', index)
  }
}
