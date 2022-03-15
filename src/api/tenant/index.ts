import { request } from '@/utils/axios'
import Cookies from 'js-cookie'

// 获取账户下的企业
export function getCurrentTenantList () {
  return request({
    url: 'api/tenant/getCurrentTenantList',
    method: 'get'
  })
}

export function getCurTenant () {
  return Cookies.get('currentTenant')
}

export function setCurTenant (tenantId: string | object) {
  return Cookies.set('currentTenant', tenantId)
}

export function removeCurTenant () {
  return Cookies.remove('currentTenant')
}

/** get Logo */
export function getLogo () {
  return request({
    url: 'api/tenant/getLogo',
    method: 'get'
  })
}

// 百度天气 http://api.map.baidu.com/weather/v1/   浏览器：iiNHUSWo5CLMEVZqH3kgrRCjrLPHamrW
export function getBaiduWeather (url: string) {
  return request({
    url: 'api/weather?url=' + url,
    method: 'get'
  })
}

/** save Tenant */
// TODO: fix parameters
export function saveTenant (params: any) {
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
export function deleteTenants (tenantId: string) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'delete'
  })
}

/** 获取单独tenant信息 */
export function getTenantInfo (tenantId: string) {
  return request({
    url: 'api/tenant/' + tenantId,
    method: 'get'
  })
}

// 获取指定企业下的项目及网关信息  api/tenant/all/info
export function tenantAllInfo () {
  return request({
    url: 'api/tenant/all/info',
    method: 'get'
  })
}

// 获取指定企业的数据信息
export function getTenantAttr (tenantId: any) {
  return request({
    url: `api/plugins/telemetry/TENANT/${tenantId}/values/attributes`,
    method: 'get'
  })
}

// 企业管理 修改设备数
export function updateTenant ({ tenantId, createDeviceLimit }:any) {
  return request({
    url: 'api/plugins/telemetry/TENANT/' + tenantId + '/SERVER_SCOPE',
    method: 'post',
    data: { createDeviceLimit }
  })
}

// 获取账户下的企业
export function delTenant (tenantId: any) {
  return request({
    url: `api/tenant/${tenantId}`,
    method: 'delete'
  })
}

// 获取所有企业和，自己拥有的企业 （市场推广
export function getAllTenantList (userId: any) {
  return request({
    url: `api/tenant/otherTenantList/${userId}`,
    method: 'get'
  })
}

// 赋予企业给指定用户
export function setTenantToUser (data: any) {
  return request({
    url: 'api/tenant/setTenantToUser',
    method: 'post',
    data
  })
}
