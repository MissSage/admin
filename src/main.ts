import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import { store, key } from './store'
import elementPlus from './plugins/element-plus'
import global from './plugins/globalProperties'
const app = createApp(App)
// 加载插件
app.use(router)
app.use(store, key)
app.use(elementPlus)
app.use(global)

// 自动注册全局组件
// 这个是vite自己的功能，非web标准或es标准
const modules = import.meta.globEager('./components/**/index.ts')
for (const path in modules) {
  app.use(modules[path].default)
}
app.mount('#app')
