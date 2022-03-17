import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import { store, key } from './store'
// import './styles/element-plus/index.scss'
import './styles/index.scss'
import './styles/iconfont/iconfont.css'
import elementPlus from './plugins/element-plus'
import installEcharts from '@/plugins/echart'

const app = createApp(App)
installEcharts(app)
// 加载插件
app.use(router)
app.use(store, key)
app.use(elementPlus)

// 自动注册全局组件
// 这个是vite自己的功能，非web标准或es标准
// const modules = import.meta.globEager('./components/install.ts')
// for (const path in modules) {
//   app.use(modules[path].default)
// }
app.mount('#app')
