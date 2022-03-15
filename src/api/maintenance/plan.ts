
import { QueryListParam } from '@/common/types/common'
import { IPlan } from '@/common/types/maintenance/plan'
import { request } from '@/utils/axios'
/**
 * 分页查询检修计划列表
 * @param params
 * @returns
 */
export function getMaintainPlanTable (params: QueryListParam) {
  return request({
    url: '/api/maintenance/plan/list',
    method: 'get',
    params
  })
}
/**
 * 启用/停用指定检修计划
 * @param id
 * @returns
 */
export const changeMaintainPlanStatus = (id: string) => {
  return request({
    url: `/api/maintenance/plan/changeStatus/${id}`,
    method: 'get'
  })
}
/**
 * 批量删除计划
 *
 * @param ids
 * @returns
 */
export const deleteMaintainPlans = (ids: string[]) => {
  return request({
    url: '/api/maintenance/plan',
    method: 'delete',
    data: ids
  })
}
/**
 * 新增检修计划
 * @param id
 * @returns
 */
export const addMaintainPlan = (params: IPlan) => {
  return request({
    url: '/api/maintenance/plan/save',
    method: 'post',
    data: params
  })
}
/**
 * 查询指定检修计划详情
 * @param id
 * @returns
 */
export const getMaintainPlanDetail = (id:string) => {
  return request({
    url: `/api/maintenance/plan/detail/${id}`,
    method: 'get'
  })
}
