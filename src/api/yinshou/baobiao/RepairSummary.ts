import { request } from '@/utils/axios'

/**
 * 维修统计报表
 * @param params
 * @returns
 */
export const GetRepairSummary = (params:any) => {
  return request({
    url: 'zys/repair/m/summary',
    method: 'get',
    params
  })
}
export const ExportRepairSummary = (params:any) => {
  return request({
    url: 'zys/repair/m/summaryExport',
    method: 'get',
    params
  })
}
