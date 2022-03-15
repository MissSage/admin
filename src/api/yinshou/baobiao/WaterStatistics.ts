import { request } from '@/utils/axios'
import { IQuery_YinShou_Water } from '@/views/yinshou/types/Water/Statistics'

/**
 * 获取用水统计报表
 * @param params
 * @returns
 */
export const GetWaterStatistics = (params: IQuery_YinShou_Water) => {
  return request({
    url: 'zys/costMaster/statistics/waterUse',
    method: 'get',
    params
  })
}
