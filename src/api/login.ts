import { request } from '@/utils/axios'
import { request_scada } from '@/utils/axios/scada'
import { getItem } from '@/utils/storage'

import Cookies from 'js-cookie'

/**
 * 获取登录的key
 * @returns
 */
export function getKey () {
  return request({
    url: 'api/noauth/getLoginKey',
    method: 'get'
  })
}
/**
 * 登录
 * @param params
 * @returns
 */
export function login (params:any) {
  return request({
    url: 'api/auth/login',
    method: 'post',
    data: params
  })
}
/**
 * 用户信息
 * @param userId
 * @returns
 */
export function getInfo (userId:string) {
  return request({
    url: 'api/user/' + userId,
    method: 'get'
  })
}

/**
 * 验证码 api/noauth/verify
 * @returns
 */
export function getVerify () {
  return request({
    url: 'api/noauth/verify',
    method: 'post'
  })
}

/**
 * 上次登陆信息
 * @returns
 */
export function getLastLogin () {
  return request({
    url: 'api/user/login/info',
    method: 'get'
  })
}

// 拿页面跳转token  api/auth/root/token?tenantId= (不带-)
export function getTenantToken (tenantId:string) {
  return request({
    url: 'api/auth/root/token?tenantId=' + tenantId,
    method: 'get'
  })
}

// 拿组态 登陆
export function scadaLogin (params:any) {
  return request_scada({
    url: 'authentication',
    method: 'post',
    data: params
  })
}

export function getYinShouLoginParams () {
  const info = getItem<any>('ysinfo')
  if (info) {
    const params = {
      key: 'yingshou',
      data: {
        username: info.u,
        password: info.p
      }
    }
    return request({
      url: '/api/tenantApplication/getLoginParams',
      method: 'post',
      data: params
    })
  } else {
    // ElMessage({
    //   showClose: true,
    //   message: "获取信息失败",
    //   type: 'error',
    //   duration: 2 * 1000
    // })
    return Promise.reject(new Error('获取信息失败'))
  }
}
