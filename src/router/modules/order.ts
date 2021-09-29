import { RouteRecordRaw, RouterView } from 'vue-router'

const routes:RouteRecordRaw = {
  path: 'order',
  component: RouterView,
  meta: {
    title: '定单'
  },
  children: [
    {
      path: 'list',
      name: 'list',
      component: () => import('@/views/order/list/index.vue'),
      meta: {
        title: '定单列表'
      }
    },
    {
      path: 'offline',
      name: 'offline',
      component: () => import('@/views/order/offline/index.vue'),
      meta: {
        title: '收银订单'
      }
    }
  ]
}

export default routes
