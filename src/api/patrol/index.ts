// ----------------巡检 ---------------

import { request } from '@/utils/axios'

export function getPatrolList (params: any) {
  return request({
    url: 'api/shuiwu/xjrwgl/list',
    method: 'get',
    params
  })
}

export function savePatrol (data: any) {
  return request({
    url: 'api/shuiwu/xjrwgl/save',
    method: 'post',
    data
  })
}

export function getPatrolDetail (id: any) {
  return request({
    url: `api/shuiwu/xjrwgl/${id}`,
    method: 'get'
  })
}

export function delPatrol (data: any) {
  return request({
    url: 'api/shuiwu/xjrwgl',
    method: 'delete',
    data
  })
}

// 启用/停用计划巡检任务
export function setPatrol (data: any) {
  return request({
    url: 'api/shuiwu/xjrwgl/changeStatus',
    method: 'post',
    data
  })
}

// 当前巡检
export function getCurrentPatrolList (params: any) {
  return request({
    url: 'api/shuiwu/xjrw/list',
    method: 'get',
    params
  })
}

export function delCurrentPatrol (data: any) {
  return request({
    url: 'api/shuiwu/xjrw',
    method: 'delete',
    data
  })
}

export function changePatrolStatus (data: any) {
  return request({
    url: 'api/shuiwu/xjrw/changeStatus',
    method: 'post',
    data
  })
}

export function getCurrentPatrolDetail (id: any) {
  return request({
    url: `api/shuiwu/xjrw/${id}`,
    method: 'get'
  })
}

// 历史巡检
export function getHistoryPatrolList (params: any) {
  return request({
    url: 'api/shuiwu/xjrw/history/list',
    method: 'get',
    params
  })
}

// 下载详情
export function downloadReport (id: any) {
  return request({
    url: `api/shuiwu/xjrw/export/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 获取巡检标准列表
export function getStepList (params: any) {
  return request({
    url: 'api/shuiwu/criterion/list',
    method: 'get',
    params
  })
}

// 保存巡检标准库
export function saveStep (data: any) {
  return request({
    url: 'api/shuiwu/criterion/save',
    method: 'post',
    data
  })
}

// 根据ID获取标准库详情
export function getStepDetail (id: any) {
  return request({
    url: `api/shuiwu/criterion/${id}`,
    method: 'get'
  })
}

// 根据ID获取标准库详情
export function delStep (data: any) {
  return request({
    url: 'api/shuiwu/criterion',
    method: 'delete',
    data
  })
}
/**
 * 获取指定任务的历史轨迹数据
 * @param taskId 任务id
 * @returns
 */
export const getTrack = (taskId:string) => {
  return request({
    method: 'get',
    url: `api/taskTrackHistory/getTrack?contentId=${taskId}`
  })
}
