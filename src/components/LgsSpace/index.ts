import { App } from '@vue/runtime-dom'
import Component from './LgsSpace.vue'

export default {
  install (app: App) {
    app.component('LgsSpace', Component)
  }
}
