import LgsFormDraggable from '@/components/LgsFormDraggable/LgsFormDraggable.vue'
import { App } from 'vue'

export default {
  install (app: App) {
    app.component('LgsFormDraggable', LgsFormDraggable)
  }
}
