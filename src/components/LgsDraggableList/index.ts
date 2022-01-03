import { App } from '@vue/runtime-dom'
import Component from './LgsDraggableList.vue'

export default {
  install (app: App) {
    app.component('LgsDraggableList', Component)
  }
}
