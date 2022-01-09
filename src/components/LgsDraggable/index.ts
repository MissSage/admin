
import type { App } from 'vue'
import LgsLayerBox from './utils/LgsLayer'
// import './css/LgsDraggable.scss'
import './css/index.scss'
export default {
  // 组件祖册
  install (app: App): void {
    app.config.globalProperties.$layer = new LgsLayerBox()
  }
}
