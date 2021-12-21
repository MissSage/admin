import { App } from '@vue/runtime-dom'
import Component from './VolWangEditor.vue'

export default {
  install (app: App) {
    app.component('LgsEditor', Component)
  }
}
