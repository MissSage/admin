import { request } from '@/utils/axios'

/**
 * 分页列表
 * @param params
 * @returns
 */
export function getTableData (params: any) {
  return request({
    url: 'api/assets/depreciation/page',
    method: 'get',
    params
  })
}
