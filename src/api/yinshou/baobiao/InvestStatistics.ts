import { request } from '@/utils/axios'
import { IQuery_Yinshou_Invest } from '@/views/yinshou/types/Invest/Statistics'

/**
 * 查询充值记录
 * @param params
 * @returns
 */
export const GetInvestStatistics = (params: IQuery_Yinshou_Invest) => {
  return request({
    url: 'custPrepay/paySummary',
    method: 'get',
    params
  })
}
/**
 * 删除充值记录
 * @param ids
 * @returns
 */
export const DeleteInvests = (ids: string[]) => {
  return request({
    url: '',
    method: 'delete',
    data: ids
  })
}
/**
 * 导出充值统计报表
 * @param params
 * @returns
 */
export const ExportInvests = (params: IQuery_Yinshou_Invest) => {
  return request({
    url: 'custPrepay/paySummaryExport',
    method: 'get',
    params
  })
}
