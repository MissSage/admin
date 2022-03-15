
import { QueryListParam } from '@/common/types/common'
import { request } from '@/utils/axios'

/**
 * 分页查询检修任务列表
 * @param params
 * @returns
 */
export const getMaintTaskTable = (params:QueryListParam) => {
  return request({
    url: '/api/maintenance/job/list',
    method: 'get',
    params
  })
}
/**
 * 批量删除任务
 * @param ids
 * @returns
 */
export const deleteMaintTasks = (ids:string[]) => {
  return request({
    url: '/api/maintenance/job',
    method: 'delete',
    data: ids
  })
}

export const getMaintTaskDetail = (id:string) => {
  return request({
    url: `/api/maintenance/job/detail/${id}`,
    method: 'get'
  })
}
