
import { request } from '@/utils/axios'
import axios from 'axios'

// 新增应用分类
export function addApp (params: any) {
  return request({
    url: 'api/app/type',
    method: 'post',
    data: params
  })
}

// 修改应用分类
export function editApp (params: any) {
  return request({
    url: 'api/app/type/edit',
    method: 'post',
    data: params
  })
}

// 查询单个应用分类 id 不带-
export function getApp (id: string) {
  return request({
    url: 'api/app/type/' + id,
    method: 'get'
  })
}

// get应用列表
export function getAppList () {
  return request({
    url: 'api/app/type/list',
    method: 'get'
  })
}

// set应用资源  菜单 不带- params.data
export function setAppMenu (params: { appTypeId: string; data: any }) {
  return request({
    url: 'api/app/type/relation/' + params.appTypeId,
    method: 'post',
    data: params.data
  })
}

// get 应用已拥有菜单
export function getAppMenu (appTypeId: string) {
  return request({
    url: 'api/app/type/relation/menu/' + appTypeId,
    method: 'get'
  })
}

export function deleteApp (appTypeId: string) {
  return request({
    url: 'api/app/type/' + appTypeId,
    method: 'delete'
  })
}

export function getAppVersion () {
  return request({
    url: 'api/app/version/check/version',
    method: 'get'
  })
}

export function getBaiduTTSToken ({ grant_type, client_id, client_secret }:any) {
  return request({
    url: 'api/call/post',
    method: 'post',
    data: {
      url: `https://openapi.baidu.com/oauth/2.0/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`,
      method: 'get'
    }
  })
}

// export function getBaiduTTS(params) {
//   let url = 'https://tsn.baidu.com/text2audio?'
//   for (const i in params) {
//     url += `&${i}=${params[i]}`
//   }
//   return request({
//     url: 'text2audio',
//     method: 'post',
//     data: {
//       url,
//       method: 'get'
//     }
//   })
// }

export const getBaiduTTS = (params: { [x: string]: any }) => {
  let url = 'http://139.155.92.140:28999/text2audio?'
  console.log(params)
  for (const i in params) {
    url += `&${i}=${params[i]}`
  }
  console.log(url)
  // responseType: 'blob',
  return axios({ url, method: 'get', responseType: 'blob' }).then(function (response) {
    return response
  })
}
