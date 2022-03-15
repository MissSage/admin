import { request } from '@/utils/axios'

/**
 * 新增
 * @param params
 * @returns
 */
export function saveData (params: any) {
  return request({
    url: '/api/assets/inventory',
    method: 'post',
    data: params
  })
}
/**
 * 分页列表
 * @param params
 * @returns
 */
export function getTableData (params: any) {
  return request({
    url: 'api/assets/inventory/page',
    method: 'get',
    params
  })
}
/**
 * 批量删除
 * @param ids
 * @returns
 */
export function deleteInventory (ids: any) {
  return request({
    url: '/api/assets/inventory',
    method: 'delete',
    data: ids
  })
}
//
// /**
//  * 启用/停用指定检修计划
//  * @param id
//  * @returns
//  */
// export const changeRepairePlanStatus= (id: string) => {
//   return request({
//     url: `/api/repair/plan/changeStatus/${id}`,
//     method: 'get'
//   })
// }
