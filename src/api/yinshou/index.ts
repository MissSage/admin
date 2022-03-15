import { request } from '@/utils/axios/yinshou'

/**
 * 授权营收
 * @returns
 */
export const AuthYinshou = () => {
  return request({
    url: 'login?password=test&username=admin',
    method: 'post',
    withCredentials: false
  })
}

export const GetCustTypeList = () => {
  return request({
    url: 'custType/tree',
    method: 'post'
  })
}
/**
 * 获取营收用户列表
 * @returns
 */
export const GetYinShouUserList = () => {
  return request({
    url: 'meterBooks/meterBookTree',
    method: 'get'
  })
}
/**
 * 获取营收区域信息
 * @param params
 * @returns
 */
export const GetYinShouArea = () => {
  return request({
    url: 'organization/newTree',
    method: 'get'
  })
}
