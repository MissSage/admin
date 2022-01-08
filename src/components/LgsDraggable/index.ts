
import type { App } from 'vue'
import LgsLayerBox from './LgsLayerBox'

export default {
  // 组件祖册
  install (app: App): void {
    app.config.globalProperties.$layer = new LgsLayerBox()
  }
}
