import { request } from '@/utils/axios'

// 6.报警确认,参数与强制解除一致
export function alarmConfirm (params: any) {
  return request({
    url: 'api/noAuthAlarm/confirm',
    method: 'post',
    data: params
  })
}

// 获取项目实时告警
export function getAlarmRealByProjectId (params: any, projectId?: any) {
  return request({
    url: 'api/alarm/getAlarmRealTime' + (projectId ? `/${projectId}` : ''),
    method: 'get',
    params
  })
}

// 获取项目实时告警 分页
export function getAlarmRealTimeList (params: any, projectId?: any) {
  return request({
    url: 'api/alarm/getAlarmRealTime/page' + (projectId ? `/${projectId}` : ''),
    method: 'get',
    params
  })
}

// 查询项目历史告警
export function getAlarmByProjectId (params: any) {
  return request({
    url: 'api/alarm/getAlarm/projectId',
    method: 'post',
    data: params
  })
}

// 查询项目历史告警 分页
export function getHistoryAlarmList (data: { projectId: string | undefined; deviceId: string[] | undefined; page: string | number | undefined; size: string | number | undefined; start: number; end: number }) {
  return request({
    url: 'api/alarm/getAlarm/projectId/page',
    method: 'post',
    data
  })
}

// 报警确认,参数与强制解除一致
export function alarmConfirmByAuth (params: any) {
  return request({
    url: 'api/alarm/confirm',
    method: 'post',
    data: params
  })
}

export function clearAlarmByAuth (params: any) {
  return request({
    url: 'api/alarm/clear',
    method: 'post',
    data: params
  })
}

export function getAlarmHistoryByDeviceAndAuth (params: { deviceId: string; type: string }) {
  return request({
    url:
      'api/alarm/getAlarmHistoryByDevice?deviceId=' + params.deviceId + '&alarmType=' + params.type,
    method: 'get'
  })
}

export function connectAlarm (params: any, alarmJsonId: string) {
  return request({
    url: 'api/alarmJson/linkedUser/' + alarmJsonId,
    method: 'post',
    data: params
  })
}

export function getAlarmType (alarmJsonId: string) {
  return request({
    url: 'api/alarmJson/linkedUser/' + alarmJsonId,
    method: 'get'
  })
}
// 获取外部联系人
export function getOuterConnect (alarmJsonId: string) {
  return request({
    url: 'api/alarmJson/linkedExtraUser/' + alarmJsonId,
    method: 'get'
  })
}

export function connectOuter (params: any, alarmJsonId: string) {
  return request({
    url: 'api/alarmJson/linkedExtraUser/' + alarmJsonId,
    method: 'post',
    data: params
  })
}

// 农业合过来的方法  报警数量  日 月  api/tenant/getDeviceDataByTenantAndTime?startTime=1569057133917&endTime=1609430399999
export function getDeviceDataByTenantAndTime (params: { startTime: string; endTime: string }) {
  return request({
    url:
      'api/tenant/getDeviceDataByTenantAndTime?startTime=' +
      params.startTime +
      '&endTime=' +
      params.endTime,
    method: 'get'
  })
}

// 报警排行   api/tenant/getAlarmNumberByStatus?startTime=1569057133917&endTime=1609430399999
export function getAlarmNumberByStatus (params: { startTime: string; endTime: string }) {
  return request({
    url:
      'api/tenant/getAlarmNumberByStatus?startTime=' +
      params.startTime +
      '&endTime=' +
      params.endTime,
    method: 'get'
  })
}

// get告警 两种方法
// 根据tenantID获取
export function getAlarmList (params?:any) {
  if (params) {
    return request({
      url: 'api/noAuthAlarm/alarmJson?secret=' + params,
      method: 'get'
    })
  } else {
    return request({
      url: 'api/alarmJson',
      method: 'get'
    })
  }
}

export function getAlarmListByProjectId (projectId: string, params: any) {
  return request({
    url: 'api/alarmJson/project/' + projectId,
    method: 'get',
    params
  })
}

// 报警设置分页
export function getAlarmSettingList (projectId: string, params: any) {
  return request({
    url: 'api/alarmJson/project/page/' + projectId,
    method: 'get',
    params
  })
}

// 根据设备id获取
export function getAlarmJson (deviceId: string) {
  return request({
    url: 'api/alarmJson/get?deviceId=' + deviceId,
    method: 'get'
  })
}

// 保存告警设置
export function saveAlarm (params: any) {
  return request({
    url: 'api/alarmJson/save',
    method: 'post',
    data: params
  })
}

// 删除告警设置
export function deleteAlarm (alarmId: string) {
  return request({
    url: 'api/alarmJson/delete?id=' + alarmId,
    method: 'delete'
  })
}
