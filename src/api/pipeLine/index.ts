import { request } from '@/utils/axios'

// 查询管线列表
export function getPipeList (params: any) {
  return request({
    url: 'api/shuiwu/pipe/list',
    method: 'get',
    params
  })
}

// 删除管线
export function delPipe (data: any) {
  return request({
    url: 'api/shuiwu/pipe',
    method: 'delete',
    data
  })
}

// 查询管道详情
export function getPipeDetail (id: any) {
  return request({
    url: `api/shuiwu/pipe/${id}`,
    method: 'get'
  })
}

// 导出管道列表
export function exportPipeLine () {
  return request({
    url: 'api/shuiwu/pipe/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 导入管道列表
export function importPipeLine (data: any) {
  return request({
    url: 'api/shuiwu/pipe/import',
    method: 'post',
    data
  })
}

// 下载管线模板
export function downloadPipeLineTemplate () {
  return request({
    url: 'api/shuiwu/pipe/template',
    method: 'get',
    responseType: 'blob'
  })
}

// 查询管道节点列表
export function getPipeNodeList (params: any) {
  return request({
    url: 'api/shuiwu/pipe/point/list',
    method: 'get',
    params
  })
}

// 删除管道节点（支持批量删除）
export function delPipeNode (data: any) {
  return request({
    url: 'api/shuiwu/pipe/point',
    method: 'delete',
    data
  })
}

// 查询指定管道节点详情
export function getPipeNodeDetail (id: any) {
  return request({
    url: `api/shuiwu/pipe/point/${id}`,
    method: 'get'
  })
}

// 查询管道压力
export function getPipeLineYaliList () {
  return request({
    url: 'api/shuiwu/pipe/data',
    method: 'get'
  })
}

// --------阀门管理------------
// 分页查询阀门列表
export function getValveList (params: any) {
  return request({
    url: 'api/shuiwu/valve/list',
    method: 'get',
    params
  })
}

// 批量删除阀门
export function delValve (data: any) {
  return request({
    url: 'api/shuiwu/valve',
    method: 'delete',
    data
  })
}

// 查询指定阀门的详细信息
export function getValveDetail (id: any) {
  return request({
    url: `api/shuiwu/valve/${id}`,
    method: 'get'
  })
}
