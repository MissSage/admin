/* 转移接口 */

import { request } from '@/utils/axios'

/**
 * 新增
 * @param params
 * @returns
 */
export function saveData (params: any) {
  return request({
    url: '/api/assets/transfer',
    method: 'post',
    data: params
  })
}
/**
 * 审核
 * @param params
 * @returns
 */
export function review (params: any) {
  return request({
    url: '/api/assets/transfer/review',
    method: 'post',
    data: params
  })
}

/**
 * 批量删除
 * @param ids
 * @returns
 */
export function deleteTransfer (ids: any) {
  return request({
    url: '/api/assets/transfer',
    method: 'delete',
    data: ids
  })
}
/**
 * 分页查询列表
 * @param params
 * @returns
 */
export const getTableData = (params:any) => {
  return request({
    url: '/api/assets/transfer/page',
    method: 'get',
    params
  })
}
