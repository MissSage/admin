import { request } from '@/utils/axios'

// 新增项目
export function addProject (params:any) {
  return request({
    url: 'api/project',
    method: 'post',
    data: params
  })
}

// 修改项目
export function editProject (params:any) {
  return request({
    url: 'api/project/edit',
    method: 'post',
    data: params
  })
}

// 删除项目 不带-
export function delProject (id:string) {
  return request({
    url: 'api/project/' + id,
    method: 'delete'
  })
}

// 查询当前账号所有根项目
export function getProjectRoot (devices?:any) {
  let params = false
  if (devices) {
    params = true
  }
  return request({
    url: 'api/project/root?devices=' + params, // 默认false
    method: 'get'
  })
}

// 查询指定项目的下一级项目 不带-
export function appointProjectChildren (id:any) {
  return request({
    url: 'api/project/children/' + id,
    method: 'get'
  })
}

// 查询指定项目信息
export function getAppointProject (id:any) {
  return request({
    url: 'api/project/' + id,
    method: 'get'
  })
}

// 根据资源类型和资源ID查询关系
export function getProjectRelationByEntityTypeAndEntityId (entityType:any, entityId:any) {
  return request({
    url: 'api/project/relation/project/' + entityType + '/' + entityId,
    method: 'get'
  })
}

// 下发
export function downProject (data:any, params:any) {
  return request({
    url: 'api/plugins/rpc/fy/' + params.deviceId + '/' + params.phone + '/' + params.captcha,
    method: 'post',
    data: data
  })
}

// 边缘计算的树的API  api/project/tree/projectAndGateway?tenantIdString=xxxxxxxxxxxxxxxxxx
export function getProjectAndGateway (tenantId:any) {
  return request({
    url: 'api/project/tree/projectAndGateway?tenantIdString=' + tenantId,
    method: 'get'
  })
}

// 农业合过来的方法 企业下 项目业务数据
// api/project/business/statistics
export function getProjectBusinessData () {
  return request({
    url: 'api/project/business/statistics',
    method: 'get'
  })
}

// 获取账户下的企业
export function getCurrentTenantList () {
  return request({
    url: 'api/tenant/getCurrentTenantList',
    method: 'get'
  })
}

// 获取账户下的企业
export function delTenant (tenantId:any) {
  return request({
    url: `api/tenant/${tenantId}`,
    method: 'delete'
  })
}

// 获取所有企业和，自己拥有的企业 （市场推广
export function getAllTenantList (userId:any) {
  return request({
    url: `api/tenant/otherTenantList/${userId}`,
    method: 'get'
  })
}

// 赋予企业给指定用户
export function setTenantToUser (data:any) {
  return request({
    url: 'api/tenant/setTenantToUser',
    method: 'post',
    data
  })
}
