import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import { store, key } from './store'
import elementPlus from './plugins/element-plus'
const app = createApp(App)
app.use(router)
app.use(store, key)
app.use(elementPlus)
// 自动注册全局组件
// 这个是vite自己的功能，非web标准或es标准
const modules = import.meta.globEager('./components/**/index.ts')
for (const path in modules) {
  app.use(modules[path].default)
}

app.config.globalProperties.$view = {}
app.mount('#app')
