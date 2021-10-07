import { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

import Home from '../views/home/index.vue'
export const routes:RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/home',
    meta: {
      title: '控制台'
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      {
        path: '/oneMap',
        name: 'oneMap',
        component: () => import('@/views/oneMap/index.vue'),
        meta: {
          title: '一张图'
        }
      }
    ]
  }
]
