import { request } from '@/utils/axios'

export function changePassword (currentPassword: any, newPassword: any) {
  return request({
    url: 'api/auth/changePassword',
    method: 'post',
    data: {
      currentPassword: currentPassword,
      newPassword: newPassword
    }
  })
}

export function requestResetPasswordByEmail (email: any) {
  return request({
    url:
      'api/noauth/resetPasswordByEmail?istarResetPasswordUrl=' +
      encodeURIComponent('https://ems.istarscloud.com/resetPassword'),
    method: 'post',
    data: {
      email: email
    }
  })
}

export function activateUser (token: any, password: any) {
  return request({
    url: 'api/noauth/activate?istarLoginUrl=' + encodeURIComponent('https://ems.istarscloud.com/#'),
    method: 'post',
    data: {
      activateToken: token,
      password: password
    }
  })
}

export function resetPassword (token: any, password: any) {
  return request({
    url:
      'api/noauth/resetPassword?istarLoginUrl=' +
      encodeURIComponent('https://ems.istarscloud.com/#'),
    method: 'post',
    data: {
      resetToken: token,
      password: password
    }
  })
}
