import { App } from '@vue/runtime-dom'
import Component from './LgsUploader.vue'

export default {
  install (app: App) {
    app.component('LgsUploader', Component)
  }
}
