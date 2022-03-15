import { request } from '@/utils/axios'

// 分页查询命令库或者校验库列表
export function getCommands (params: any) {
  return request({
    url: 'api/command/findList',
    method: 'GET',
    params
  })
}

// 删除命令或指令库记录（支持批量删除）
export function delCommands (data: any) {
  return request({
    url: 'api/command',
    method: 'delete',
    data
  })
}

// 查询全部指令库或者校验库记录列表 1：校验库；2：指令库
export function getCommandsAll (type: any) {
  return request({
    url: 'api/command/findAll',
    method: 'get',
    params: { type }
  })
}

// 查询指定命令库或者校验库详情
export function getCommandsDetail (id: any) {
  return request({
    url: `api/command/${id}`,
    method: 'get'
  })
}

// 分页查询步骤库列表
export function getStepStore (params: any) {
  return request({
    url: 'api/stepStore/findList',
    method: 'get',
    params
  })
}

// 删除指定步骤库（支持批量删除）
export function delStepStore (data: any) {
  return request({
    url: 'api/stepStore',
    method: 'delete',
    data
  })
}

// 查询指定步骤库详情
export function getStepStoreDetail (id: any) {
  return request({
    url: `api/stepStore/${id}`,
    method: 'get'
  })
}

// 新增/编辑 步骤库记录
export function saveStepStore (data: any) {
  return request({
    url: 'api/stepStore/save',
    method: 'post',
    data
  })
}

// 复制指定步骤库
export function copyStepStore (id: any) {
  return request({
    url: `api/stepStore/copy/${id}`,
    method: 'post'
  })
}

// 分页查询设备列表
export function getRealDevice (params: any) {
  return request({
    url: 'api/xjRealDevice/findList',
    method: 'get',
    params
  })
}

// 删除指定设备（支持批量删除）
export function delRealDevice (data: any) {
  return request({
    url: 'api/xjRealDevice',
    method: 'delete',
    data
  })
}

// 查询指定设备详情
export function getRealDeviceDetail (id: any) {
  return request({
    url: `api/xjRealDevice/${id}`,
    method: 'get'
  })
}

// 导入设备
export function importRealDevice (data: any) {
  return request({
    url: 'api/xjRealDevice/import',
    method: 'post',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 导出设备
export function exportRealDevice (params: any) {
  return request({
    url: 'api/xjRealDevice/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 下载二维码
export function downloadQrCode (projectId: any) {
  return request({
    url: `api/xjRealDevice/downloadQrCode?projectId=${projectId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 预案库API
// 分页查询预案库列表
export function getFilecenterList (params: any) {
  return request({
    url: 'api/xunjian/filecenter/findList',
    method: 'get',
    params
  })
}
// 删除文件预案（支持批量删除）
export function delFilecenter (data: any) {
  return request({
    url: 'api/xunjian/filecenter',
    method: 'delete',
    data
  })
}
// 查询指定文件预案详情
export function getFilecenterDetail (id: any) {
  return request({
    url: `api/xunjian/filecenter/${id}`,
    method: 'get'
  })
}
