
import Layout from '@/layout/AppLayout.vue'
import { RouteRecordRaw } from 'vue-router'

export const yinshouRoutes:RouteRecordRaw[] = [
  // 水卡
  {
    path: '/WaterCardManage',
    component: Layout,
    name: 'WaterCardManage',
    meta: {
      hidden: false,
      alwaysShow: true,
      title: '水卡管理',
      icon: 'icon-home',
      roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
    },
    children: [
      {
        path: 'index',
        name: 'WaterCardManageIndex',
        meta: { title: '水卡管理', icon: 'icon-home' },
        component: () => import('@/views/yinshou/shuika/index.vue')
      }
    ]
  },
  // 抄表
  {
    path: '/MeterReadManage',
    component: Layout,
    name: 'MeterReadManage',
    meta: {
      hidden: false,
      alwaysShow: true,
      title: '抄表管理',
      icon: 'icon-home',
      roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
    },
    children: [
      {
        path: 'index',
        name: 'MeterReadManageIndex',
        meta: { title: '抄表管理', icon: 'icon-home' },
        component: () => import('@/views/yinshou/chaobiao/index.vue')
      }
    ]
  },
  // 申请
  {
    path: '/ApplyManage',
    component: Layout,
    name: 'ApplyManage',
    meta: {
      hidden: false,
      alwaysShow: true,
      title: '申请管理',
      icon: 'icon-home',
      roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
    },
    children: [
      {
        path: 'InstallApply',
        name: 'InstallApply',
        meta: { title: '报装申请', icon: 'icon-home' },
        component: () => import('@/views/yinshou/shenqing/InstallApply.vue')
      },
      {
        path: 'InstallApplyDialog',
        name: 'InstallApplyDialog',
        component: () =>
          import('@/views/yinshou/shenqing/components/Install/InstallApplyDialog.vue'),
        meta: {
          hidden: true,
          title: '报装审批',
          icon: 'icon-home',
          roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
        }
      },
      {
        path: 'LeakApply',
        name: 'LeakApply',
        meta: { title: '报漏报修', icon: 'icon-home' },
        component: () => import('@/views/yinshou/shenqing/LeakApply.vue')
      },
      {
        path: 'LeakApplyDialog',
        name: 'LeakApplyDialog',
        component: () => import('@/views/yinshou/shenqing/components/Leak/LeakApplyDialog.vue'),
        meta: {
          hidden: true,
          title: '报漏报修',
          icon: 'icon-home',
          roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
        }
      },
      {
        path: 'Complaints',
        name: 'Complaints',
        meta: { title: '投诉意见', icon: 'icon-home' },
        component: () => import('@/views/yinshou/shenqing/Complaints.vue')
      },
      {
        path: 'ComplaintsDialog',
        name: 'ComplaintsDialog',
        component: () =>
          import('@/views/yinshou/shenqing/components/Complaints/ComplaintsDialog.vue'),
        meta: {
          hidden: true,
          title: '投诉意见',
          icon: 'icon-home',
          roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
        }
      }
    ]
  },
  // 报表
  {
    path: '/ReportManage',
    component: Layout,
    name: 'ReportManage',
    meta: {
      hidden: false,
      alwaysShow: true,
      title: '报表管理',
      icon: 'icon-home',
      roles: ['CUSTOMER_USER', 'TENANT_ADMIN', 'TENANT_SUPPORT']
    },
    children: [
      {
        path: 'WaterStatistics',
        name: 'WaterStatistics',
        meta: { title: '用水统计报表', icon: 'icon-home' },
        component: () => import('@/views/yinshou/baobiao/Water/WaterStatistics.vue')
      },
      // {
      //   path: 'WaterDetail',
      //   name: 'WaterDetail',
      //   meta: { title: '用水明细报表', icon: 'icon-home' },
      //   component: () => import('@/views/yinshou/baobiao/Water/WaterDetail.vue')
      // },
      {
        path: 'InvestStatistics',
        name: 'InvestStatistics',
        meta: { title: '用户充值报表', icon: 'icon-home' },
        component: () => import('@/views/yinshou/baobiao/Invest/InvestStatistics.vue')
      },
      // {
      //   path: 'InvestDetail',
      //   name: 'InvestDetail',
      //   meta: { title: '用户充值明细报表', icon: 'icon-home' },
      //   component: () => import('@/views/yinshou/baobiao/Invest/InvestDetail.vue')
      // },
      {
        path: 'FinancialStatistics',
        name: 'FinancialStatistics',
        meta: { title: '账务统计报表', icon: 'icon-home' },
        component: () => import('@/views/yinshou/baobiao/FinancialStatistics.vue')
      },
      {
        path: 'AccountStatistics',
        name: 'AccountStatistics',
        meta: { title: '开户统计报表', icon: 'icon-home' },
        component: () => import('@/views/yinshou/baobiao/AccountStatistics.vue')
      },
      {
        path: 'RepaireStatistics',
        name: 'RepaireStatistics',
        meta: { title: '维修统计报表', icon: 'icon-home' },
        component: () => import('@/views/yinshou/baobiao/RepaireStatistics.vue')
      }
    ]
  }
]
