import { request } from '@/utils/axios'

// 查询当前用户的按钮权限
export function getCurUserBtnPerms () {
  return request({
    url: 'api/menuButton/getCurrentUserMenuButtonList',
    method: 'get'
  })
}

// 查询指定菜单下的按钮权限列表
export function getMenuBtnPerms (menuId: any) {
  return request({
    url: `api/menuButton/list/${menuId}`,
    method: 'get'
  })
}

// 删除按钮权限（支持批量删除）
export function delMenuBtnPerms (data: any) {
  return request({
    url: 'api/menuButton',
    method: 'delete',
    data
  })
}

// 自定义大屏页面
// export function getConstantsAttributeById(params) {
//   return request({
//     url: 'api/constants/find',
//     method: 'get',
//     params: params
//   })
// }
