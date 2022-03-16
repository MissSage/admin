import { createRouter, createWebHistory } from 'vue-router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes } from './MenuRoutes'
import { getItem } from '@/utils/storage'
const router = createRouter({
  history: createWebHistory(), // 路由模式 history
  routes: [
    ...routes,
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index1.vue')
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/404.vue')
    }
  ] // 路由规则
})

router.beforeEach((to, from) => {
  nprogress.start()
  if (to.meta.requiresAuth && !getItem('TOKEN')) {
    // 页面需要授权但是没有登录，则重写向到登录页
    return {
      path: '/login',
      // 保存当前位置，以便登录后重新跳转到此
      query: { redirect: to.fullPath }
    }
  }
})
router.afterEach(() => {
  nprogress.done()
})
export default router
