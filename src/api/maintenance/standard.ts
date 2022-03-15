
import { QueryListParam } from '@/common/types/common'
import { IStandard } from '@/common/types/maintenance/standard'
import { request } from '@/utils/axios'

/**
 * 分页查询保养标准列表
 * @param params
 * @returns
 */
export const getMaintStandardTable = (params: QueryListParam) => {
  return request({
    url: '/api/maintenance/standard/list',
    method: 'get',
    params
  })
}

/**
 * 批量删除保养标准
 * @param ids
 * @returns
 */
export const deleteMaintStandards = (ids: string[]) => {
  return request({
    url: '/api/maintenance/standard',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增或更新保养标准
 * @param params
 * @returns
 */
export const addOrUpdateMainStandard = (params: IStandard) => {
  return request({
    url: '/api/maintenance/standard/save',
    method: 'post',
    data: params
  })
}

/**
 * 查询全部的保养标准列表
 * @param name
 * @returns
 */
export const getAllMaintStandards = (name: string) => {
  return request({
    url: `/api/maintenance/standard/all?name=${name}`,
    method: 'get'
  })
}
/**
 * 查询指定保养标准
 * @param id
 * @returns
 */
export const getMaintStandard = (id: string) => {
  return request({
    url: `/api/maintenance/standard/${id}`,
    method: 'get'
  })
}
export const getMaintenanceStandardsByDeviceType = (type:string) => {
  return request({
    url: `/api/maintenance/standard/getStandardByType?deviceType=${type}`,
    method: 'get'
  })
}
