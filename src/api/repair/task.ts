import { QueryListParam } from '@/common/types/common'
import { ITask } from '@/common/types/repair/task'
import { request } from '@/utils/axios'

/**
 * 添加故障报修的任务
 * @param params
 * @returns
 */
export const addRepairTaskFaultReport = (params: ITask) => {
  return request({
    url: '/api/repair/job/faultReport',
    method: 'post',
    data: params
  })
}
/**
 * 查询指定检修任务详情
 * @param id
 * @returns
 */
export const getRepairTaskDetail = (id: string) => {
  return request({
    url: `/api/repair/job/detail/${id}`,
    method: 'get'
  })
}
/**
 * 批量删除任务
 * @param ids
 * @returns
 */
export const deleteRepairTasks = (ids: string[]) => {
  return request({
    url: '/api/repair/job',
    method: 'delete',
    data: ids
  })
}
/**
 * 分页查询检修任务列表
 * @param params
 * @returns
 */
export const getRepairTaskTable = (params: QueryListParam) => {
  return request({
    url: '/api/repair/job/list',
    method: 'get',
    params
  })
}
