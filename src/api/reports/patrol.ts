import { QueryListParam } from '@/common/types/reports'
import { request } from '@/utils/axios'

/**
 * 巡检人员排名
 * @param params
 * @returns
 */
export const GetPatrolUserRank = (params: QueryListParam) => {
  return request({
    url: '/api/shuiwu/xjrw/userRank',
    method: 'get',
    params
  })
}
/**
 * 巡检任务状态统计
 * @param params
 * @returns
 */
export const GetPatrolStatusCount = (params: QueryListParam) => {
  return request({
    url: '/api/shuiwu/xjrw/taskCountByTime2',
    method: 'get',
    params
  })
}
/**
 * 异常巡检任务趋势图
 * @param params
 * @returns
 */
export const GetPatrolException = (params: QueryListParam) => {
  return request({
    url: '/api/shuiwu/xjrw/trend/exception',
    method: 'get',
    params
  })
}
/**
 * 任务完成情况统计
 * @param params
 * @returns
 */
export const GetPatrolCompleteRatio = (params: QueryListParam) => {
  return request({
    url: '/api/shuiwu/xjrw/taskCountByTime',
    method: 'get',
    params
  })
}
/**
 * 巡检趋势图
 * @param params
 * @returns
 */
export const GetPatrolTaskTreend = (params: QueryListParam) => {
  return request({
    url: '/api/shuiwu/xjrw/trend',
    method: 'get',
    params
  })
}
