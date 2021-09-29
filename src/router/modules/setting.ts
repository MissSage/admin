import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: 'setting',
  component: RouterView,
  meta: {
    title: '设置'
  },
  children: [
    {
      path: 'system_admin/index',
      name: 'system_admin-index',
      meta: {
        title: '管理员列表'
      },
      component: () => import('@/views/setting/system_admin/index.vue')
    },
    {
      path: 'system_menus/index',
      name: 'system-menus-index',
      meta: {
        title: '权限规则'
      },
      component: () => import('@/views/setting/system_menus/index.vue')
    },
    {
      path: 'system_role/index',
      name: 'system-role-index',
      meta: {
        title: '角色管理'
      },
      component: () => import('@/views/setting/system_role/index.vue')
    }
  ]

}
export default routes
