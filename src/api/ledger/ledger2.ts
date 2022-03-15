/* 台账接口 */

import { request } from '@/utils/axios'

// 台账保存
export function saveData (params: any) {
  return request({
    url: '/api/assets/account',
    method: 'post',
    data: params
  })
}
// 台账根据id进行查询
export const getDataById = (id: any) => {
  return request({
    url: '/api/assets/account/' + id,
    method: 'get'
  })
}
export const getDeviceTreeData = (projectId:string) => {
  return request({
    url: `api/assets/account/getListTree?projectId=${projectId}`,
    method: 'get'
  })
}
// 获取设备类型
export const getDeviceType = () => {
  return request({
    url: '/api/assets/account/getDeviceTypeList',
    method: 'get'
  })
}
// 根据设备类型获取设备
export const getListByDeviceType = (deviceType?: string) => {
  return request({
    url: `/api/assets/account/getListByDeviceType?deviceType=${deviceType}`,
    method: 'get'
  })
}
// 上传图片
export const upLoadImages = (params: any) => {
  return request({
    url: '/api/file/image',
    method: 'post',
    data: params
  })
}
// 上传文件
export const upLoadFile = (params: any) => {
  return request({
    url: '/api/file/file',
    method: 'post',
    data: params
  })
}

// 文件显示 ledger2
export const showFile = (url: any) => {
  return request({
    url: url,
    method: 'get',
    responseType: 'blob'
  })
}
