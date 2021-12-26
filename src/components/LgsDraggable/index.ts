import { App } from '@vue/runtime-dom'
import Component from './LgsDraggable.vue'

export default {
  install (app: App) {
    app.component('LgsDraggable', Component)
  }
}
