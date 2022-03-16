import { request } from '@/utils/axios'

/**
 * 获取开户统计报表
 * @param params
 * @returns
 */
export const GetAccountSummary = (params:any) => {
  return request({
    url: 'custInfo/custSummary',
    method: 'get',
    params
  })
}
/**
 * 导出开户统计报表
 * @param params
 * @returns
 */
export const ExportAccountSummary = (params:any) => {
  return request({
    url: 'custInfo/custSummaryExport',
    method: 'get',
    params
  })
}
