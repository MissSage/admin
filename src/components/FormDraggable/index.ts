import FormDraggable from '@/components/FormDraggable/index.vue'
import { App } from 'vue'

export default {
  install (app: App) {
    app.component('FormDraggable', FormDraggable)
  }
}
