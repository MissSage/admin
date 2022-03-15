import { request } from '@/utils/axios'

/**
 * 保存用户
 * @param params
 * @returns
 */
export function saveUser (params:any) {
  if (params.id) {
    return request({
      url: 'api/user',
      method: 'post',
      data: params
    })
  } else {
    return request({
      url:
        'api/user?istarCreatePasswordUrl=' +
        encodeURIComponent('https://ems.istarscloud.com/createPassword'),
      method: 'post',
      data: params
    })
  }
}
/**
 * 创建用户
 * @param params
 * @returns
 */
export function newSaveUser (params:any) {
  if (params.id) {
    return request({
      url: 'api/newUser',
      method: 'post',
      data: params
    })
  } else {
    return request({
      url:
        'api/newUser?istarCreatePasswordUrl=' +
        encodeURIComponent('https://ems.istarscloud.com/createPassword'),
      method: 'post',
      data: params
    })
  }
}
