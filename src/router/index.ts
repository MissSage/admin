import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// import { store } from '../store/index'
import Home from '../views/home/index.vue'
const routes:RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  }
]
const router = createRouter({
  history: createWebHashHistory(), // 路由模式 history
  routes // 路由规则
})

router.beforeEach((to, from) => {
  nprogress.start()
  // if (to.meta.requiresAuth && !store.state.user) {
  //   // 页面需要授权但是没有登录，则重写向到登录页
  //   return {
  //     path: '/admin/login',
  //     // 保存当前位置，以便登录后重新跳转到此
  //     query: { redirect: to.fullPath }
  //   }
  // }
})
router.afterEach(() => {
  nprogress.done()
})
export default router
