import { request } from '@/utils/axios'

// 获取企业组态列表  GET api/dashChart/findByTenant
export function getScadaList () {
  return request({
    url: 'api/dashChart/findByTenant',
    method: 'get'
  })
}

//  根据发起者ID获取组态列表  GET api/dashChart/findByOriginatorId?originatorId=
// projectId 发起者ID，即企业ID，项目ID，网关ID等，不带-
export function getFindScadaList (params: any) {
  return request({
    // url: 'api/dashChart/findByOriginatorId',
    url: 'api/zutai/dashboard-list',
    method: 'get',
    params
  })
}

// 新增组态  POST api/dashChart/save
export function saveScada (params: any) {
  return request({
    url: 'api/dashChart/save',
    method: 'post',
    data: params
  })
}

// 删除组态  DELETE api/dashChart/delete/?id=&token=
// id :组态ID，从对象中的dashboardId获取
// token：登录组态的token
export function deleteScada (id: string) {
  return request({
    url: 'api/zutai/dashboard-list?id=' + id,
    // url: 'api/dashChart/delete/?id=' + params.id + '&token=' + params.token,
    method: 'delete'
  })
}

// 组态导出
export function exportScada (params: any) {
  return request({
    url: 'api/dashChart/downloadDashChart',
    method: 'post',
    data: params
  })
}

// 组态导入
export function importScada (params: any) {
  return request({
    url: 'api/dashChart/uploadDashChart',
    method: 'post',
    data: params
  })
}
