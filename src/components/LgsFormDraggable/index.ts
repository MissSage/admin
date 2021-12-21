import LgsFormDraggable from '@/components/LgsFormDraggable/index.vue'
import { App } from 'vue'

export default {
  install (app: App) {
    app.component('LgsFormDraggable', LgsFormDraggable)
  }
}
