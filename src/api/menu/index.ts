import { request } from '@/utils/axios'

// 获取总id 菜单池的
export function getRootId () {
  return request({
    url: 'api/menu/pool/getRootId',
    method: 'get'
  })
}

// 菜单池的 获取用于分配给租户的菜单列表
export function getSelectableTree () {
  return request({
    url: 'api/menu/pool/getSelectableTree',
    method: 'get'
  })
}

// 菜单池的 新增菜单到菜单池
export function setMenuPool (params: any) {
  return request({
    url: 'api/menu/pool',
    method: 'post',
    data: params
  })
}

// 获取总id 分配出去的
export function getCustomerRootId () {
  return request({
    url: 'api/menu/customer/getRootId',
    method: 'get'
  })
}

// 分配菜单给指定租户
export function setTenantMenu (params: any) {
  return request({
    url: 'api/menu/tenant',
    method: 'post',
    data: params
  })
}

// tenant admin登录获取扩展菜单
export function getFindByCurrentUser () {
  return request({
    url: 'api/menu/tenant/findByCurrentUser',
    method: 'get'
  })
}

// 分配菜单给指定角色
export function setAssignMenuToRole (params: any) {
  return request({
    url: 'api/role/assignMenuToRole',
    method: 'post',
    data: params
  })
}

// 获取指定租户已选择的菜单（仅返回ID）
export function getTreeByTenantId (tenantId: string) {
  return request({
    url: 'api/menu/tenant/getTreeByTenantId/' + tenantId,
    method: 'get'
  })
}

// 获取指定用户已选择的菜单（仅返回ID）  获取指定角色已选择的菜单（仅返回菜单id）
export function getTreeByRoleId (tenantId: string) {
  return request({
    url: 'api/role/getTreeByRoleId/' + tenantId,
    method: 'get'
  })
}

// 获取当前租户拥有的菜单类型 编辑扩展下拉可选类型
export function getTypes () {
  return request({
    url: 'api/menu/customer/getTypes',
    method: 'get'
  })
}

// 对已有菜单进行扩展 新增 编辑
export function saveMenuCustomer (params: any) {
  return request({
    url: 'api/menu/customer/saveMenuCustomer',
    method: 'post',
    data: params
  })
}

// 扩展菜单删除
export function deleteMenu (id: string) {
  return request({
    url: 'api/menu/customer/deleteMenu/' + id,
    method: 'delete'
  })
}

// 获取当前租户的可用菜单
export function getTree () {
  return request({
    url: 'api/menu/customer/getTree',
    method: 'get'
  })
}

// 获取当前登录用户扩展菜单
export function getMenuByCurrentUser () {
  return request({
    url: 'api/menu/customer/findMenuByCurrentUser',
    method: 'get'
  })
}

// 获取指定角色下的用户
export function getUserListByRole (roleId: any) {
  return request({
    url: `api/role/getUserListByRole/${roleId}`,
    method: 'get'
  })
}
/** ------------------角 色--------------------- */
// 新增/更新角色
export function saveRole (params: any) {
  return request({
    url: 'api/role/saveRole',
    method: 'post',
    data: params
  })
}

// 获取当前租户拥有的角色
export function getRoles () {
  return request({
    url: 'api/role/roles',
    method: 'get'
  })
}

// 分页获取角色
export function getRolesByPage (params: any) {
  return request({
    url: 'api/role/list',
    method: 'get',
    params
  })
}

// 删除角色
export function deleteRole (roleId: string) {
  return request({
    url: 'api/role/deleteRole/' + roleId,
    method: 'delete'
  })
}

// 分配角色给指定User
export function assignRoleToUser (params: any) {
  return request({
    url: 'api/role/assignRoleToUser',
    method: 'post',
    data: params
  })
}

// 分配菜单给指定角色
export function assignMenuToRole (params: any) {
  return request({
    url: 'api/role/assignMenuToRole',
    method: 'post',
    data: params
  })
}

// 获取指定用户的角色
export function getRoleIdByUserId (userId: string) {
  return request({
    url: 'api/role/getRoleIdByUserId/' + userId,
    method: 'get'
  })
}

// 获取指定用户的角色
export function assignProjectsToUser (params: { userId: string; data: any }) {
  return request({
    url: 'api/assign/user/' + params.userId,
    method: 'post',
    data: params.data
  })
}

// 获取指定用户的角色
export function assignProjectsToUsers (data: any) {
  return request({
    url: 'api/assign/users',
    method: 'post',
    data
  })
}
