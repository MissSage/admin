import { App } from '@vue/runtime-dom'
import Component from './LgsDialog.vue'

export default {
  install (app: App) {
    app.component('LgsDialog', Component)
  }
}
