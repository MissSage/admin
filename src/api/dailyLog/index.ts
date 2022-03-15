import { request } from '@/utils/axios'

// 登录日志
export function getLoginLogs (params: any) {
  return request({
    url: 'api/option/log/getLogList/page/LOGIN',
    params,
    method: 'get'
  })
}

// 操作日志
export function getOptionsLogs (params: any) {
  return request({
    url: 'api/option/log/getLogList/options',
    params,
    method: 'get'
  })
}

// 短信邮件日志
export function getMesLogs (tenantId: string, type: string) {
  return request({
    url: 'api/msgLog/findByTenant/' + tenantId + '/' + type,
    method: 'get'
  })
}

// 短信邮件日志
export function getMesLogsByTime (params: { tenantId: string; type: string; start: string; end: string }) {
  return request({
    url:
      'api/msgLog/findByTenantAndTime/' +
      params.tenantId +
      '/' +
      params.type +
      '?start=' +
      params.start +
      '&end=' +
      params.end,
    method: 'get'
  })
}

// 设备日志
export function getFacility (tenantId: string) {
  return request({
    url: 'api/deviceLog/findByTenant/' + tenantId,
    method: 'get'
  })
}

// 设备日志
export function getFacilityByTime (params: { tenantId: string; start: string; end: string }) {
  return request({
    url:
      'api/deviceLog/findByTenantAndTime/' +
      params.tenantId +
      '?start=' +
      params.start +
      '&end=' +
      params.end,
    method: 'get'
  })
}

// 控制日志
export function getControlByTime (params: { start: string; end: string }) {
  return request({
    url: 'api/captcha/getLog' + '?start=' + params.start + '&end=' + params.end,
    method: 'get'
  })
}
