/** *********************  备件管理  ******************************/

import { ExtraQueryParam, QueryListParam } from '@/common/types/common'
import { ISaveItem, ISaveOption } from '@/common/types/component/storage'
import { request } from '@/utils/axios'

/** ****************管理库开始************************/
/**
 * 查询所有备件列表
 * @param params
 * @returns
 */
export const getAllStorages = (params: ExtraQueryParam) => {
  return request({
    url: '/api/component/storage/all',
    method: 'get',
    params
  })
}
/**
 * 查询已有的类别列表
 * @returns
 */
export const getSpecificationList = () => {
  return request({
    url: '/api/component/storage/specificationList',
    method: 'get'
  })
}
/**
 * 查看备件详情
 * @param id
 * @returns
 */
export const getStorage = (id: string) => {
  return request({
    url: `/api/component/storage/${id}`,
    method: 'get'
  })
}

/**
 * 新增或编辑备件库信息
 * 新增时id传空或不传
 * @param params
 * @returns
 */
export const saveStorage = (params: ISaveItem) => {
  return request({
    url: '/api/component/storage/save',
    method: 'post',
    data: params
  })
}
/**
 * 批量删除备件
 * @param ids
 * @returns
 */
export const DeleteStorages = (ids: string[]) => {
  return request({
    url: '/api/component/storage',
    method: 'delete',
    data: ids
  })
}
/**
 * 入库或出库
 * @param params
 * @returns
 */
export const outOrInStorage = (params:ISaveOption) => {
  return request({
    url: '/api/component/option/save',
    method: 'post',
    data: params
  })
}
/**
 * 分页查询备件库列表
 * @param params
 * @returns
 */
export const getStorageTable = (params: QueryListParam) => {
  return request({
    url: '/api/component/storage/list',
    method: 'get',
    params
  })
}

/** ****************管理库结束************************/

/** *****************使用记录************************/
/**
 * 查询指定出入库单详情
 * @param id
 * @returns
 */
export const getInOutRecord = (id:string) => {
  return request({
    url: `/api/component/option/${id}`,
    method: 'get'
  })
}
/**
 * 分页查询出入库单列表
 * @param params
 * @returns
 */
export const getInOutRecordTable = (params:QueryListParam) => {
  return request({
    url: '/api/component/option/list',
    method: 'get',
    params
  })
}

/** *****************使用记录结束************************/
