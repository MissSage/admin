import { App } from '@vue/runtime-dom'
import Component from './LgsPagination.vue'

export default {
  install (app: App) {
    app.component('LgsPagination', Component)
  }
}
