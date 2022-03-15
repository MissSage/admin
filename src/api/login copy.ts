import request from '@/plugins/axios'
import scadaHttp from '@/plugins/axios/scada'
import Cookies from 'js-cookie'


export function getKey () {
  return request({
    url: 'api/noauth/getLoginKey',
    method: 'get'
  })
}
export function login (params) {
  return request({
    url: 'api/auth/login',
    method: 'post',
    data: params
  })
}

export function getInfo (userId) {
  return request({
    url: 'api/user/' + userId,
    method: 'get'
  })
}

// dead code
export function logout () {
  return request({
    url: 'api/user/logout',
    method: 'post'
  })
}

// 验证码 api/noauth/verify
export function getVerify () {
  return request({
    url: 'api/noauth/verify',
    method: 'post'
  })
}

// 上次登陆信息
export function getLastLogin () {
  return request({
    url: 'api/user/login/info',
    method: 'get'
  })
}

// 拿页面跳转token  api/auth/root/token?tenantId= (不带-)
export function getTenantToken (tenantId) {
  return request({
    url: 'api/auth/root/token?tenantId=' + tenantId,
    method: 'get'
  })
}

// 拿组态 登陆
export function scadaLogin (params) {
  return scadaHttp({
    url: 'authentication',
    method: 'post',
    data: params
  })
}

export function getToken () {
  return Cookies.get('Admin-Token')
}

export function setToken (token: string) {
  return Cookies.set('Admin-Token', token)
}

export function removeToken () {
  return Cookies.remove('Admin-Token')
}
export function getYinShouLoginParams () {
  const infostr = localStorage.getItem('ysinfo')
  const info = infostr ? JSON.parse(infostr) : null
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