import { request } from '@/utils/axios'

/**
 * 获取应用已选中的菜单列表
 * @param param
 * @returns
 */
export function getChecklist (param: string) {
  return request({
    url: `api/tenantApplication/selectedMenuList?tenantApplicationId=${param}`,
    method: 'GET'
  })
}

/**
 * 获取当前企业全部的应用
 * @param tenantId
 * @returns AxiosPromise
 */
export function getapplications (tenantId: string) {
  return request({
    url: `api/tenantApplication/all?tenantId=${tenantId}`,
    method: 'GET'
  })
}

/**
 * 删除指定企业应用（支持批量删除）
 * @param params
 * @returns
 */
export function deleteapplications (params: string[]) {
  return request({
    url: 'api/tenantApplication/delete',
    method: 'delete',
    data: params
  })
}

/**
 * 分页获取当前企业的企业应用列表
 * @param data
 * @returns
 */
export function getapplicationPagination (data: any) {
  return request({
    url: 'api/tenantApplication/list',
    method: 'GET',
    data
  })
}

/**
 * 添加修改应用
 * @param params
 * @returns
 */
export function addeditapp (params: any) {
  return request({
    url: 'api/tenantApplication/save',
    method: 'POST',
    data: params
  })
}

/**
 * 获取指定应用的选中菜单
 * @param tenantApplicationId 企业应用ID
 * @returns
 */
export function getrouting (tenantApplicationId: string) {
  return request({
    url: `api/menu/customer/findMenuByTenantApplication?tenantApplicationId=${tenantApplicationId}`,
    method: 'GET'
  })
}

/**
 * 获取指定角色在指定应用中已有权限的菜单ID列表
 * @param roleId
 * @param tenantApplicationId
 * @returns
 */
export function getCorporateMenu (roleId: string, tenantApplicationId: string) {
  return request({
    url: `api/role/getTreeByRoleIdAndTenantApplicationId?roleId=${roleId}&tenantApplicationId=${tenantApplicationId}`,
    method: 'get'
  })
}

/**
 * 获取指定企业应用的菜单列表
 * @param tenantApplicationId
 * @returns
 */

export function getTreeByTenantApplication (tenantApplicationId: string) {
  return request({
    url: `api/menu/customer/getTreeByTenantApplication?tenantApplicationId=${tenantApplicationId}`,
    method: 'get'
  })
}

/**
 * 获取指定角色所拥有的企业应用权限列表
 * @param roleId 角色id
 * @returns
 */
export const getRoleTenantApplicationList = (roleId: string) => {
  return request({
    url: `/api/role/getRoleTenantApplicationList?roleId=${roleId}`,
    method: 'get'
  })
}
/**
   * 设置或者取消特定角色的企业应用权限
   * @param params
   * @returns
   */
export const assignTenantApplicationToRole = (params: {
    roleId: string
    tenantApplicationId: string
  }) => {
  return request({
    url: '/api/role/assignTenantApplicationToRole',
    method: 'post',
    data: params
  })
}
