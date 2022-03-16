import { request } from '@/utils/axios'

/**
 * 账务统计报表
 * @param params
 * @returns
 */
export const GetFinancialSummary = (params:any) => {
  return request({
    url: 'custPrepay/billSummary',
    method: 'get',
    params
  })
}
/**
 * 导出账务统计报表
 * @param params
 * @returns
 */
export const ExportFinancialSummary = (params:any) => {
  return request({
    url: 'custPrepay/billSummaryExport',
    method: 'get',
    params
  })
}
