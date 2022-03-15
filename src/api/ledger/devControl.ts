
import { request } from '@/utils/axios'
import { PostControlParam, QueryControlListParam } from '@/views/deviceLedger/index'

/**
 * 设备控制下发
 * @param params
 * @returns
 */
export const postDeviceProperty = (params:PostControlParam) => {
  return request({
    url: 'api/device/control/send',
    method: 'post',
    data: params
  })
}
/**
 * 查询设备控制列表
 * @param params
 * @returns
 */
export const getControlList = (params:QueryControlListParam) => {
  return request({
    url: 'api/device/property/data',
    method: 'get',
    params
  })
}
