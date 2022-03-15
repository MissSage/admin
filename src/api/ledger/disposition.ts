/* 处置接口 */

import { request } from '@/utils/axios'

/**
 * 新增
 * @param params
 * @returns
 */
export function saveData (params: any) {
  return request({
    url: '/api/assets/handle',
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
    url: '/api/assets/handle/review',
    method: 'post',
    data: params
  })
}

/**
 * 分页查询列表
 * @param params
 * @returns
 */
export const getTableData = (params: any) => {
  return request({
    url: '/api/assets/handle/page',
    method: 'get',
    params
  })
}

/**
 * 批量删除
 * @param ids
 * @returns
 */
export function deleteHandle (ids: any) {
  return request({
    url: '/api/assets/handle',
    method: 'delete',
    data: ids
  })
}
