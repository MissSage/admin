import { QueryListParam } from '@/common/types/reports'
import { request } from '@/utils/axios'

export const GetAlarmRank = (params: QueryListParam) => {
  return request({
    url: '/api/alarm/alarmRank',
    method: 'get',
    params
  })
}

export const GetAlarmTrend = (params:QueryListParam) => {
  return request({
    url: '/api/alarm/trend',
    method: 'get',
    params
  })
}
export const GetAlarmOverview = (params:QueryListParam) => {
  return request({
    url: '/api/alarm/countAlarm/overview',
    method: 'get',
    params
  })
}
export const GetAlarmPriority = (params:QueryListParam) => {
  return request({
    url: '/api/alarm/countAlarmByProject',
    method: 'get',
    params
  })
}
