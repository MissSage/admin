import { App } from '@vue/runtime-dom'
import Component from './LgsEditor.vue'

export default {
  install (app: App) {
    app.component('LgsEditor', Component)
  }
}
