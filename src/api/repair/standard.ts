import { QueryListParam } from '@/common/types/common'
import { IStandard } from '@/common/types/repair/standard'
import { request } from '@/utils/axios'

/**
 * 查询指定维修标准
 * @param id
 * @returns
 */
export const getRepairStandardDetail = (id: string) => {
  return request({
    url: `/api/repair/standard/${id}`,
    method: 'get'
  })
}
/**
 * 查询全部的维修标准列表
 * @param name
 * @returns
 */
export const getAllRepairStandards = (name?: string) => {
  return request({
    url: `/api/repair/standard/all?name=${name}`,
    method: 'get'
  })
}
/**
 * 新增或更新检修标准
 * @param params
 * @returns
 */
export const addOrUpdateRepairStandard = (params: IStandard) => {
  return request({
    url: '/api/repair/standard/save',
    method: 'post',
    data: params
  })
}
/**
 * 批量删除维修标准
 * @param ids
 * @returns
 */
export const deleteRepairStandards = (ids: string[]) => {
  return request({
    url: '/api/repair/standard',
    method: 'delete',
    data: ids
  })
}
/**
 * 分页查询检修标准列表
 * @param params
 * @returns
 */
export const getRepairStandardTable = (params: QueryListParam) => {
  return request({
    url: '/api/repair/standard/list',
    method: 'get',
    params
  })
}
export const getRepaireStandardsByDeviceType = (type: string) => {
  return request({
    url: `/api/repaire/standard/getStandardByType?deviceType=${type}`,
    method: 'get'
  })
}
