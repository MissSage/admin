import { request } from '@/utils/axios'

export function saveUser (params: { id: any }) {
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

export function newSaveUser (params: { id: any }) {
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

export function getTenantAdmins (tenantId: string) {
  return request({
    url: 'api/tenant/' + tenantId + '/users?limit=9999999',
    method: 'get'
  })
}

export function getTenantAdminsAndSys (tenantId: string) {
  return request({
    url: 'api/tenant/adminAndsys/' + tenantId + '?limit=9999999',
    method: 'get'
  })
}

// TODO: Refactor
export function getTenantUsers (tenantId: string) {
  return request({
    url: 'api/tenant/users/' + tenantId + '?limit=9999999',
    method: 'get'
  })
}

export function getTenantUsersByPage (params: any) {
  return request({
    url: 'api/tenant/users/list',
    method: 'get',
    params
  })
}

export function deleteUser (userId: string) {
  return request({
    url: 'api/user/' + userId,
    method: 'delete'
  })
}

export function deleteUsers (data: any) {
  return request({
    url: 'api/users',
    method: 'delete',
    data
  })
}

// 获取单个用户信息
export function getUser (userId: string) {
  return request({
    url: 'api/user/' + userId,
    method: 'get'
  })
}

// 拿用户拥有的项目列表的  api/api/project/relation/project/USER/{userId}
export function getUserProject (userId: string) {
  return request({
    url: 'api/project/relation/project/USER/' + userId,
    method: 'get'
  })
}

// 外部联系人
// 创建外部联系人 POST api/extraUser/save
export function saveExtraUser (params: any) {
  return request({
    url: 'api/extraUser/save',
    method: 'post',
    data: params
  })
}

// 获取企业外部联系人列表  GET api/extraUser/list
export function getExtraUser () {
  return request({
    url: 'api/extraUser/list',
    method: 'get'
  })
}

//  删除单个外部联系人   DELETE api/extraUser/delete?id=
export function delExtraUser (id: string) {
  return request({
    url: 'api/extraUser/delete?id=' + id,
    method: 'delete'
  })
}

//  批量删除外部联系人   api/extraUser/delete/all
export function bulkDeleteExtraUser (params: any) {
  return request({
    url: 'api/extraUser/delete/all',
    method: 'post',
    data: params
  })
}

// 获取所用用户  api/user/getAll
export function getAllUser () {
  return request({
    url: 'api/user/getAll',
    method: 'get'
  })
}

// 冻结用户 get /api/user/disable/{userId}  // uuid都是不带-的
export function disableUser (userId: string) {
  return request({
    url: 'api/user/disable/' + userId,
    method: 'get'
  })
}
// 解冻用户 get /api/user/enable/{userId}
export function enableUser (userId: string) {
  return request({
    url: 'api/user/enable/' + userId,
    method: 'get'
  })
}

// 重置密码
export function resetPWD (userId: string) {
  return request({
    url: 'api/auth/resetUserPassword/' + userId,
    method: 'post'
  })
}

// 查询当前用户的工作效率
export function workEfficiencyRank (name: any) {
  return request({
    url: `api/xunjian/statistics/workEfficiencyRank?name=${name}`,
    method: 'get'
  })
}

// 工作效率-工作内容列表
export function getJobContentList () {
  return request({
    url: 'api/xunjian/xjrw/jobContentList',
    method: 'get'
  })
}

// 导入用户列表
export function importUserList (data: any) {
  return request({
    url: 'api/user/import',
    method: 'post',
    data
  })
}

// 导入用户列表
export function exportUserList () {
  return request({
    url: 'api/user/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 查询当前账号的通知消息
export function getNotificationList (params = { source: 'PC' }) {
  return request({
    url: 'api/xunjian/notification/findList',
    method: 'get',
    params
  })
}
