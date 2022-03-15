import { request } from '@/utils/axios/yinshou'
import { IPostToggleValve, IQueryMeterRead, IQueryUserBill } from '@/views/yinshou/types/chaobiao'

/**
 * 获取抄表记录列表
 * @param params
 * @returns
 */
export const GetMeterReadList = (params: IQueryMeterRead) => {
  return request({
    url: 'zys/costMaster/list',
    method: 'get',
    params
  })
}
/**
 * 开关阀门
 * @param params
 * @returns
 */
export const ToggleValve = (params: IPostToggleValve) => {
  return request({
    url: 'zys/costMaster/valve/control',
    method: 'post',
    data: params
  })
}

/**
 * 获取指定历史指令
 * @param params
 * @returns
 */
export const GetZhiLinHistory = (params: IQueryMeterRead) => {
  return request({
    url: 'zys/command/history/list',
    method: 'get',
    params
  })
}
/**
 * 获取指定表具抄表数据列表
 * @param meterCode
 * @returns
 */
export const GetMeterReadDetail = (meterCode?: string, params?: any) => {
  return request({
    url: `zys/costMaster/detail/${meterCode}`,
    method: 'get',
    params
  })
}
/**
 * 查询用户账单
 * @param params
 * @returns
 */
export const GetUserBill = (params: IQueryUserBill) => {
  return request({
    url: 'zys/costMaster/detail',
    method: 'get',
    params
  })
}
/**
 * 获取设备当前最新的数据
 * @param meterCode
 * @returns
 */
export const GetMeterDataNow = (meterCode:string) => {
  return request({
    url: `zys/costMaster/meterDataNow?meterCode=${meterCode}`,
    method: 'get'
  })
}
