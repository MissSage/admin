import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

import Home from '../views/home/index.vue'
import { yinshouRoutes } from './modules/yinshou'
import { filterRouters } from '@/utils/formatter'

export const routes: RouteRecordRaw[] = filterRouters([{
  path: '/',
  component: AppLayout,
  redirect: '/home',
  meta: {
    title: '控制台',
    icon: 'icon-dashboard'
  },
  children: [
    {
      path: 'home',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        icon: 'icon-home'
      }
    }
  ]
}, {
  path: '/forms',
  component: AppLayout,
  meta: {
    title: '表单',
    icon: 'icon-dashboard'
  },
  children: [
    {
      path: '/index',
      name: 'Form',
      component: () => import('@/views/form/index.vue'),
      meta: {
        title: '表单',
        icon: 'icon-home'
      }
    }
  ]
},
...yinshouRoutes

])
