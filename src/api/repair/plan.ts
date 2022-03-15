import { QueryListParam } from '@/common/types/common'
import { IPlan } from '@/common/types/repair/plan'
import { request } from '@/utils/axios'

/**
 * 查询指定检修计划详情
 * @param id
 * @returns
 */
export const getRepairePlanDetail = (id: string) => {
  return request({
    url: `/api/repair/plan/detail/${id}`,
    method: 'get'
  })
}
/**
 * 新增检修计划
 * @param params
 * @returns
 */
export const addRepairePlan = (params: IPlan) => {
  return request({
    url: '/api/repair/plan/save',
    method: 'post',
    data: params
  })
}
/**
 * 批量删除计划
 * @param ids
 * @returns
 */
export const deleteRepairePlans = (ids: string[]) => {
  return request({
    url: '/api/repair/plan',
    method: 'delete',
    data: ids
  })
}
/**
 * 启用/停用指定检修计划
 * @param id
 * @returns
 */
export const changeRepairePlanStatus = (id: string) => {
  return request({
    url: `/api/repair/plan/changeStatus/${id}`,
    method: 'get'
  })
}
/**
 * 分页查询检修计划列表
 * @param params
 * @returns
 */
export const getRepairePlanTable = (params: QueryListParam) => {
  return request({
    url: '/api/repair/plan/list',
    method: 'get',
    params
  })
}
