import { QueryListParam } from '@/common/types/common'
import {
  IWorkOrderAcceptanceParams,
  IWorkOrderComfirmParams,
  IWorkOrderListParams,
  IWorkOrder,
  IWorkOrderSaveParams,
  ICounterOrderParams
} from '@/common/types/workorder'
import { request } from '@/utils/axios'
/**
 * 工单验证
 * @param params
 * @returns
 */
export const acceptanceOrder = (params?: IWorkOrderAcceptanceParams) => {
  return request({
    method: 'post',
    url: '/api/workOrder/acceptance',
    data: params
  })
}
/**
 * 工单提交验证
 * @param params
 * @returns
 */
export const processOrder = (params?: IWorkOrder) => {
  return request({
    method: 'post',
    url: '/api/workOrder/process',
    data: params
  })
}

/**
 * 工单接单
 * @param params
 * @returns
 */
export const confirmOrder = (params?: IWorkOrderComfirmParams) => {
  return request({
    method: 'post',
    url: '/api/workOrder/confirm',
    data: params
  })
}
/**
 * 工单详情
 * @param id
 * @returns
 */
export const orderDetail = (id: string) => {
  return request({
    method: 'get',
    url: `/api/workOrder/detail/${id}`
  })
}
/**
 * 查询工单列表
 * @param params
 * @returns
 */
export const orderList = (params: any) => {
  let paramsString = '?'
  for (const key in params) {
    paramsString += '&' + key + '=' + params[key]
  }
  return request({
    method: 'get',
    url: '/api/workOrder/list' + paramsString
  })
}
/**
 * 新增工单
 * @param params
 * @returns
 */
export const saveOrder = (params: IWorkOrderSaveParams) => {
  return request({
    method: 'post',
    url: '/api/workOrder/save',
    data: params
  })
}

/**
 * 获取工单外部联系人
 * @param params
 * @returns
 */
export const getOrderContact = (params: QueryListParam) => {
  return request({
    method: 'get',
    url: '',
    params
  })
}
export const follow = (orderId?: string) => {
  return request({
    method: 'post',
    url: '/api/workOrder/follow',
    data: {
      orderId
    }
  })
}
export const countOrder = (params:ICounterOrderParams) => {
  return request({
    method: 'get',
    url: '/api/workOrder/countOrder',
    params
  })
}
