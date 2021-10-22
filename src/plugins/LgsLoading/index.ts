import { createApp, reactive } from 'vue'

import LgsLoading from './components/LgsLoading.vue'

const msg = reactive({
  show: false,
  title: '拼命加载中...'
})

const $loading = createApp(LgsLoading, { msg }).mount(
  document.createElement('div')
)
// console.log($loading);
const load = {
  show (title: string) {
    // 控制显示loading的方法
    msg.show = true
    msg.title = title
    document.body.appendChild($loading.$el)
  },

  hide () {
    // 控制loading隐藏的方法

    msg.show = false
  }
}

export default {
  install (app: any) {
    // console.log(app);
    // Vue.prototype.$http = axios
    app.config.globalProperties.$loading = load
  }
}
