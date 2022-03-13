import { App } from 'vue'

import ElementPlus from 'element-plus'
export default {
  install (app:App) {
    app.use(ElementPlus, { size: 'small', zIndex: 2000 })
  }
}
