import { QueryListParam } from '@/common/types/reports'
import { request } from '@/utils/axios'

/**
 * 超时工单排名
 * @param params
 * @returns
 */
export const GetOrderTimeoutRank = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/orderTimeoutCountByUserAndTime',
    method: 'get',
    params
  })
}
/**
 * 工单等级数量统计
 * @param params
 * @returns
 */
export const GetOrderPriorityCount = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/orderPriorityCountByTime',
    method: 'get',
    params
  })
}
/**
 * 工单类型数量统计
 * @param params
 * @returns
 */
export const GetOrderTypeCount = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/orderTypeCountByTime',
    method: 'get',
    params
  })
}
/**
 * 工单类型趋势图
 * @param params
 * @returns
 */
export const GetOrderTypeTrend = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/orderTrendByTypeAndTime',
    method: 'get',
    params
  })
}
/**
 * 工单类型等级对比图
 * @param params
 * @returns
 */
export const GetOrderTypePriorityCount = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/countTypeAndLevelByTime',
    method: 'get',
    params
  })
}
/**
 * 工单总览
 * @param params
 * @returns
 */
export const GetOrderOverview = (params: QueryListParam) => {
  return request({
    url: '/api/workOrder/orderNumberCountByTime',
    method: 'get',
    params
  })
}
