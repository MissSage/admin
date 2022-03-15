/* 台账接口 */

import { request } from '@/utils/axios'

/**
 * 分页查询列表
 * @param params
 * @returns
 */
export const getTableData = (params: any) => {
  return request({
    url: '/api/assets/account/page',
    method: 'get',
    params
  })
}
/**
 * 分页查询列表-获取弹框列表数据
 * @param params
 * @returns
 */
export const getUnionPage = (params: any) => {
  return request({
    url: '/api/assets/account/unionPage',
    method: 'post',
    data: params
  })
}
/**
 * 批量删除计划
 * @param ids
 * @returns
 */
export const deleteAccount = (ids: any) => {
  return request({
    url: '/api/assets/account',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 * @param params
 * @returns
 */
export function saveData (params: any) {
  return request({
    url: '/api/assets/amount',
    method: 'post',
    data: params
  })
}
// 其他接口1.0
// 1.备件列表
/**
 * 分页查询列表
 * @param params
 * @returns
 */
export const getStorageData = (params: any) => {
  return request({
    url: '/api/component/storage/list',
    method: 'get',
    params
  })
}

// 其他接口2.0

// 维修-根据设备id查询相关的维修信息分页
export const getRDataById = (params: any) => {
  return request({
    url: '/api/repair/job/list',
    method: 'get',
    params
  })
}

// 维修-根据设备id获取饼图数据（对指定设备的维修任务按故障等级进行分组统计）
export const getRPicData = (params: any) => {
  return request({
    url: '/api/repair/job/groupByPriority',
    method: 'get',
    params
  })
}
// 维修-根据设备id获取曲线图数据（按设备ID统计今年维修情况）
export const getRLineData = (params: any) => {
  return request({
    url: '/api/repair/job/yearCount',
    method: 'get',
    params
  })
}
// 保养-根据设备id获取曲线图数据
export const getMLineData = (params: any) => {
  return request({
    url: '/api/maintenance/job/yearCount',
    method: 'get',
    params
  })
}

// 保养-根据设备id查询相关的保养信息分页
export const getMDataById = (params: any) => {
  return request({
    url: '/api/maintenance/job/list',
    method: 'get',
    params
  })
}
// 巡检-根据设备id获取饼图数据-无
export const getXJPicData = (params: any) => {
  return request({
    url: '/api/shuiwu/xjrw/groupByStatus',
    method: 'get',
    params
  })
}
// 巡检计划-根据设备id查询相关的巡检信息分页
export const getXJDataById = (params: any) => {
  return request({
    url: '/api/shuiwu/xjrwgl/list',
    method: 'get',
    params
  })
}
// 巡检历史-根据设备id查询相关的巡检历史信息分页
export const getXJRWDataById = (params: any) => {
  return request({
    url: '/api/shuiwu/xjrw/history/list',
    method: 'get',
    params
  })
}
