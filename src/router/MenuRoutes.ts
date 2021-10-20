import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

import Home from '../views/home/index.vue'
export const routes:RouteRecordRaw[] = [
  {
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
      },
      {
        path: '/oneMap',
        name: 'oneMap',
        component: () => import('@/views/oneMap/index.vue'),
        meta: {
          title: '一张图',
          icon: 'icon-earth'
        }
      },
      {
        path: '/onemap/one',
        component: () => import('@/components/Map/MoreScreen.vue')
      }
    ]
  }
]
