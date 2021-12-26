import { App } from '@vue/runtime-dom'
import Component from './LgsIcon.vue'

export default {
  install (app: App) {
    app.component('LgsIcon', Component)
  }
}
