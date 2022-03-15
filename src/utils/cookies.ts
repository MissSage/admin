import Cookies from 'js-cookie'
/**
 * Cookies--设置Token
 * @param token
 * @returns
 */
export function setToken (token: string) {
  return Cookies.set('Admin-Token', token)
}
/**
 * Cookies--获取用户token
 * @returns
 */
export function getToken () {
  return Cookies.get('Admin-Token')
}
/**
 * Cookies--移除Token
 * @returns
 */
export function removeToken () {
  return Cookies.remove('Admin-Token')
}

/**
 * Cookies--获取当前用户id
 * @returns
 */
export const getUserId = () => {
  return Cookies.get('userId')
}
/**
 * Cookies--保存用户id
 * @param id
 * @returns
 */
export const setUserId = (id:string) => {
  return Cookies.set('userId', id)
}
/**
 * Cookies--删除当前Cookies中保存的用户id
 * @returns
 */
export const removeUserId = () => {
  return Cookies.remove('userId')
}
/**
 * Cookies--设置企业id
 * @param id
 * @returns
 */
export const setTenantId = (id:string) => {
  return Cookies.set('tenantId', id)
}
/**
 * Cookies--获取企业id
 * @returns
 */
export const getTenantId = () => {
  return Cookies.get('tenantId')
}
/**
 * Cookies--移除企业id
 * @returns
 */
export const removeTenantId = () => {
  return Cookies.remove('tenantId')
}
/**
 * Cookies--获取当前企业
 * @returns
 */
export function getCurTenant () {
  return Cookies.get('currentTenant')
}
/**
 * Cookies--设置当前企业
 * @param tenantId
 * @returns
 */
export function setCurTenant (tenantId:string) {
  return Cookies.set('currentTenant', tenantId)
}

/**
 * Cookies--移除当前企业
 * @returns
 */
export function removeCurTenant () {
  return Cookies.remove('currentTenant')
}
