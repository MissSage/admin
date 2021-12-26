import { App } from '@vue/runtime-dom'
import Component from './LgsCard.vue'

export default {
  install (app: App) {
    app.component('LgsCard', Component)
  }
}
