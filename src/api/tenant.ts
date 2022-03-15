
import { request } from '@/utils/axios'
import Cookies from 'js-cookie'

// 获取账户下的企业
export const getCurrentTenantList = () => {
  return request({
    url: 'api/tenant/getCurrentTenantList',
    method: 'get'
  })
}

/** get Logo */
export function getLogo () {
  return request({
    url: 'api/tenant/getLogo',
    method: 'get'
  })
}

/**
 * save Tenant
 * @param params
 * @returns
 */
export function saveTenant (params:any) {
  return request({
    url: 'api/tenant',
    method: 'post',
    data: params
  })
}

/** get Tenants */
export function getTenants () {
  return request({
    url: 'api/tenants',
    method: 'get',
    params: {
      limit: 9999
    }
  })
}

/** delete Tenants */
export function deleteTenants (tenantId:string) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'delete'
  })
}

/**
 * 获取单独tenant信息
 * @param tenantId
 * @returns
 */
export function getTenantInfo (tenantId:string) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'get'
  })
}

/**
 * 获取指定企业下的项目及网关信息  api/tenant/all/info
 * @returns
 */
export function tenantAllInfo () {
  return request({
    url: 'api/tenant/all/info',
    method: 'get'
  })
}

/**
 * 获取指定企业的数据信息
 * @param tenantId
 * @returns
 */
export function getTenantAttr (tenantId:string) {
  return request({
    url: `api/plugins/telemetry/TENANT/${tenantId}/values/attributes`,
    method: 'get'
  })
}

/**
 * 企业管理 修改设备数
 * @param param0
 * @returns
 */
export function updateTenant ({ tenantId, createDeviceLimit }:any) {
  return request({
    url: 'api/plugins/telemetry/TENANT/' + tenantId + '/SERVER_SCOPE',
    method: 'post',
    data: { createDeviceLimit }
  })
}

/**
 * 获取账户下的企业
 * @param tenantId
 * @returns
 */
export function delTenant (tenantId:string) {
  return request({
    url: `api/tenant/${tenantId}`,
    method: 'delete'
  })
}

/**
 * 获取所有企业和，自己拥有的企业 （市场推广
 * @param userId
 * @returns
 */
export function getAllTenantList (userId:string) {
  return request({
    url: `api/tenant/otherTenantList/${userId}`,
    method: 'get'
  })
}

/**
 * 赋予企业给指定用户
 * @param data
 * @returns
 */
export function setTenantToUser (data:any) {
  return request({
    url: 'api/tenant/setTenantToUser',
    method: 'post',
    data
  })
}
