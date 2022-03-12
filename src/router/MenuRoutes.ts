import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

import Home from '../views/home/index.vue'
export const routes: RouteRecordRaw[] = [{
  path: '/',
  component: AppLayout,
  redirect: '/home',
  meta: {
    title: '控制台',
    icon: 'icon-dashboard'
  },
  children: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        icon: 'icon-home'
      }
    }, {
      path: '/webgl',
      name: 'webgl',
      component: () => import('@/views/webgl/index.vue'),
      meta: {
        title: 'webgl',
        icon: 'icon-home'
      }
    },
    {
      path: '/draggableForm',
      name: 'draggableForm',
      component: () => import('@/views/draggableForm/index.vue'),
      meta: {
        title: '可视化编辑器',
        icon: 'icon-drag'
      }
    },
    {
      path: '/games/game1',
      component: () => import('@/views/games/game1.vue'),
      meta: {
        title: 'game1',
        icon: 'icon-drag'
      }
    }
  ]
}]
