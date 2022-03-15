import { request } from '@/utils/axios'

// 设备概览
export function getDeviceCount () {
  return request({
    url: 'api/shuiwu/common/countDevice',
    method: 'get'
  })
}

// 分页查询设备列表
export function getRealDevice (params:any) {
  return request({
    url: 'api/xjRealDevice/findList',
    method: 'get',
    params
  })
}

// 删除指定设备（支持批量删除）
export function delRealDevice (data:any) {
  return request({
    url: 'api/xjRealDevice',
    method: 'delete',
    data
  })
}

// 查询指定设备详情
export function getRealDeviceDetail (id:any) {
  return request({
    url: `api/xjRealDevice/${id}`,
    method: 'get'
  })
}

// 导入设备
export function importRealDevice (data:any) {
  return request({
    url: 'api/xjRealDevice/import',
    method: 'post',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

// 导出设备
export function exportRealDevice (params:any) {
  return request({
    url: 'api/xjRealDevice/export',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 下载二维码
export function downloadQrCode (projectId:any) {
  return request({
    url: `api/xjRealDevice/downloadQrCode?projectId=${projectId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 下载二维码
export function downloadQrCodeByType (params:any) {
  return request({
    url: 'api/shuiwu/common/downloadQrCode',
    method: 'get',
    responseType: 'blob',
    params
  })
}

// 根据设备类型查询分页设备列表
export function getDeviceListByType (params:any) {
  return request({
    url: 'api/shuiwu/common/page/getDeviceByType',
    method: 'get',
    params
  })
}

/** get TenantDevices */
export function getTenantDevices () {
  return request({
    url: 'api/tenant/devices',
    method: 'get',
    params: {
      limit: 999999
    }
  })
}

// 所有企业下所有网关采集器  api/cloud/deviceList
export function getCloudDevices () {
  return request({
    url: 'api/cloud/deviceList',
    method: 'get'
  })
}

// 指定企业下 所有网关 api/tenant/allGateway/{tenantId} 不带杠
export function getTenantAllGateway (tenantId:any) {
  return request({
    url: 'api/tenant/allGateway/' + tenantId,
    method: 'get'
  })
}

// 获取指定类别的设备 api/deviceList/filterBy，参数{"param":"注塑机"}
export function filterDevices (params:any) {
  return request({
    url: 'api/deviceList/filterBy',
    method: 'post',
    data: params
  })
}

/** get DeviceByID */
export function getDeviceByID (deviceId:any) {
  return request({
    url: 'api/device/' + deviceId,
    method: 'get'
  })
}

/** delete Device */
export function deleteDevice (deviceid:any) {
  return request({
    url: 'api/device/' + deviceid + '?needUpdateGateway=true',
    method: 'delete'
  })
}

/** save Device */
export function saveDevice (device:any, needUpdateGateway:any) {
  return request({
    url: 'api/device?needUpdateGateway=' + needUpdateGateway,
    method: 'post',
    data: device
  })
}

/** 获取gateway列表+对应设备 */
export function getGatewayDeviceList () {
  return request({
    url: 'api/tenant/gatewayAndDevices',
    method: 'get'
  })
}

// 获取所有设备网关  info
export function getDevicesAll (key:any) {
  return request({
    url: 'api/tenant/devicesAll?key=' + key,
    method: 'get'
  })
}

export function getDevicesAllByProjectId (key:any, projectId:any) {
  return request({
    url: 'api/project/devicesAll/' + projectId + '?key=' + key,
    method: 'get'
  })
}

export function getDevicesAllByGatewayId (getwayId:any, key:any) {
  return request({
    url: 'api/gateway/devicesAll/' + getwayId + '?key=' + key,
    method: 'get'
  })
}

export function getDevicesListByGatewayId (getwayId:any, params:any) {
  return request({
    url: 'api/gateway/devices/page/' + getwayId,
    method: 'get',
    params
  })
}

// 包括网关，这个专门用在告警
export function getDevicesAlls () {
  return request({
    url: 'api/tenant/devicesByTenantId',
    method: 'get'
  })
}

export function getMqttDeviceAndDevices () {
  return request({
    url: 'api/tenant/allDevice/mqttAndDevice',
    method: 'get'
  })
}

// 获取一个设备的所有属性数据
export function getDeviceAllData (deviceId:any) {
  return request({
    url: 'api/device/data/' + deviceId,
    method: 'get'
  })
}

// 获取设备属性的最新数据
export function getDeviceNewData (devices:any) {
  return request({
    url: 'api/device/lastData',
    method: 'post',
    data: devices
  })
}

export function getTenantGateway () {
  return request({
    url: 'api/tenant/gateway',
    method: 'get'
  })
}

export function getDeviceMountOnGateway (gatewayId:any) {
  return request({
    url: 'api/tenant/gatewayDevice/' + gatewayId,
    method: 'get'
  })
}

export function mountDeviceToGateway (params:any) {
  return request({
    url: 'api/mountDevice',
    method: 'post',
    data: params
  })
}

export function getUnmountedDevice () {
  return request({
    url: 'api/tenant/noGatewayDevice',
    method: 'get'
  })
}

export function umountDevice (deviceId:any) {
  return request({
    url: 'api/uninstallDevice/' + deviceId,
    method: 'get'
  })
}

export function createGateway (name:any, type:any) {
  return request({
    url: 'api/device',
    method: 'POST',
    data: {
      name: name,
      type: type,
      additionalInfo: '{"gateway":true}'
    }
  })
}

export function deleteGateway (gatewayId:any) {
  return request({
    url: 'api/gateway/' + gatewayId,
    method: 'delete'
  })
}

export function getGatewayToken (gatewayId:any) {
  return request({
    url: 'api/device/' + gatewayId + '/credentials',
    method: 'get'
  })
}

export function getDeviceFullData (deviceId:any) {
  return request({
    url: 'api/device/fullData/' + deviceId,
    method: 'get'
  })
}

export function updateGatewayToken (param:any) {
  return request({
    url: 'api/device/credentials',
    method: 'POST',
    data: param
  })
}

export function createDeviceScada (params:any) {
  return request({
    url: 'api/scada/device',
    method: 'POST',
    data: params
  })
}

export function getDeviceScada (deviceType:any) {
  return request({
    url: 'api/scada/device/' + deviceType,
    method: 'get'
  })
}
export function getAllDeviceType () {
  return request({
    url: 'api/scada/types',
    method: 'get'
  })
}

export function getShowData (deviceId:any) {
  return request({
    url: 'api/device/showData',
    method: 'POST',
    data: {
      deviceId: deviceId
    }
  })
}

// 设备类型的图片
export function getDevicePic (deviceType:any) {
  return request({
    url: 'api/device/image/' + deviceType,
    method: 'GET'
  })
}

export function getDevicePicAll () {
  return request({
    url: 'api/device/image/all',
    method: 'GET'
  })
}

// 资源组数据获取
export function getResourceGroupData (assetsId:any) {
  return request({
    url: 'api/device/ResourceGroup',
    method: 'POST',
    data: assetsId
  })
}

/**
 * 复制网关
 * -
 * @param {*} gatewayId 复制的网关的ID
 * @param {*} projectId 复制到哪个项目
 */
export function copyGateway (gatewayId:any, projectId:any) {
  return request({
    url: 'api/copy/gateway/' + gatewayId + '/' + projectId,
    method: 'POST'
  })
}

/**
 * 删除网关并且同步删除该网关下的采集器
 * -
 * @param {*} gatewayId 要删除的网关id
 */
export function deleteGatewayAndDevice (gatewayId:any) {
  return request({
    url: 'api/delete/gateway/' + gatewayId,
    method: 'DELETE'
  })
}

/**
 * 删除数据
 *
 * @param {*} params
 */
export function deleteDeviceData (params:any) {
  return request({
    url:
      'api/data/maintenance/deleteAllByDeviceOrTenant?tenantId=' +
      params.tenantId +
      '&deviceId=' +
      params.deviceId +
      '&attr=' +
      params.deviceAtt +
      '&start=' +
      params.start +
      '&end=' +
      params.end,
    method: 'GET'
  })
}

/**
 * 录入数据
 *
 * @param {*} params 录入的数据列表
 */
export function addData (params:any) {
  return request({
    url: 'api/data/maintenance/addData',
    method: 'POST',
    data: params
  })
}

// 获取工控机组态
export function getIpcScada (originatorId:any) {
  return request({
    url: 'api/dashChart/findByOriginatorId?originatorId=' + originatorId,
    method: 'GET'
  })
}

// 根据发起者ID和数据源类别查询数据源列表
export function getIpcDataSOurce (originatorId:any, type:any) {
  return request({
    url: 'api/dataSource/findByProjectIdAndType?originatorId=' + originatorId + '&type=' + type,
    method: 'GET'
  })
}

// 设备变量设备信息 包含组下对应变量 api/deviceTemplate/protocol/group/{templateId}
export function getDeviceVarGroup (templateId:any) {
  return request({
    url: 'api/deviceTemplate/protocol/group/' + templateId,
    method: 'GET'
  })
}

// 设备谐波数据 api/powerqiality/wave   istar/
export function getWaveData (params:any) {
  return request({
    url: 'istar/api/powerqiality/wave',
    method: 'POST',
    data: params
  })
}

// 获取真实设备下的传感器列表
export function findSensorByDevice (realDeviceId: any) {
  return request({
    url: `api/realDevice/findDeviceByRealDevice/${realDeviceId}`,
    method: 'GET'
  })
}

// 获取真实设备列表
export function getRealDeviceList (params: any) {
  return request({
    url: 'api/realDevice/list',
    method: 'get',
    params
  })
}

// 删除指定设备下的指定位号的传感器
export function delSensorFromRealDevice (data: any) {
  return request({
    url: 'api/realDevice/deleteDeviceFromRealDevice',
    method: 'delete',
    data
  })
}

// 获取所有真实设备列表
export function getRealDeviceListAll () {
  return request({
    url: 'api/realDevice/allList',
    method: 'get'
  })
}

// 根据设备类型获取设备列表
export function getDeviceListByTemplate (templateId: any) {
  return request({
    url: `api/realDevice/getDeviceListByTemplate/${templateId}`,
    method: 'get'
  })
}

// 获取设备详情（包含设备类型，传感器列表）
export function getDeviceDetail (deviceId: any) {
  return request({
    url: `api/realDevice/deviceDetail/${deviceId}`,
    method: 'get'
  })
}

// 巡检--设备统计（总设备数、正常设备数、故障设备数）
export function getDeviceStatistics () {
  return request({
    url: 'api/xunjian/statistics/deviceDetail',
    method: 'get'
  })
}

// device-t-controller      device teplate 设备模板api

// 新增设备模板  仅模板操作，不涉及属性
export function addTemplate (params: any) {
  return request({
    url: 'api/deviceTemplate',
    method: 'post',
    data: params
  })
}

// 修改设备模板
export function editTemplate (params: any) {
  return request({
    url: 'api/deviceTemplate/edit',
    method: 'post',
    data: params
  })
}

// 查询设备模板（仅包含设备模板数据不包含协议详情）
export function getTemplate (id: string) {
  return request({
    url: 'api/deviceTemplate/' + id,
    method: 'get'
  })
}

// 查询设备模板（包含协议详情）
export function getTemplateProtocol (id: string) {
  return request({
    url: 'api/deviceTemplate/protocol/' + id,
    method: 'get'
  })
}

// 查询设备模板列表（不包含协议详情）
export function getTemplateList () {
  return request({
    url: 'api/deviceTemplate/list',
    method: 'get'
  })
}

// 按协议类型查询设备模板列表
export function getTemplateListByType (type: string) {
  return request({
    url: 'api/deviceTemplate/list/' + type,
    method: 'get'
  })
}

// 删除模板信息
export function delTemplate (id: string) {
  return request({
    url: 'api/deviceTemplate/' + id,
    method: 'delete'
  })
}

// 保存设备模板及协议信息
export function saveTemplateProtocol (params: any) {
  return request({
    url: 'api/deviceTemplate/save/deviceTemplateAndProtocol',
    method: 'post',
    data: params
  })
}

// 复制设备模板及协议信息
export function copyTemplateProtocol (templateId: string) {
  return request({
    url: 'api/deviceTemplate/copy/' + templateId,
    method: 'post'
  })
}

// 导出
export function exportTemplateProtocol (templateIds: string) {
  return request({
    url: 'api/deviceTemplate/export?id=' + templateIds,
    method: 'get'
  })
}

// ================ 关联获取设备信息 ====================
// 获取网关和对应的采集器
export function getHostOrDevice (projectId: string) {
  return request({
    url: 'api/tenant/deviceSearchTree/' + projectId,
    method: 'get'
  })
}

// 按协议类型获取网关和对应的采集器
export function getHostOrDeviceByType (projectId: string, type: string, params: any) {
  return request({
    url: 'api/tenant/deviceSearchTree/' + projectId + '/' + type,
    method: 'get',
    params
  })
}

// 按协议类型获取网关和对应的采集器
export function getDeviceByType (params: any) {
  return request({
    url: 'api/shuiwu/common/getDeviceByType',
    method: 'get',
    params
  })
}

// 获取项目下的设备列表（不包含网关）
export function getDevice (projectId: string) {
  return request({
    url: 'api/project/devices/' + projectId,
    method: 'get'
  })
}

// 获取项目下的网关列表
export function getGateway (projectId: string) {
  return request({
    url: 'api/project/gateway/' + projectId,
    method: 'get'
  })
}

// 企业下设备信息 （网关采集器） api/cloud/deviceAll
export function getDeviceAll () {
  return request({
    url: 'api/cloud/deviceAll',
    method: 'get'
  })
}

// =============== 单独  数据监测用 ==============
export function getData (deviceId: string) {
  return request({
    url: 'api/device/fullData/' + deviceId,
    method: 'get'
  })
}

export function getDatas (deviceId: string, group: string) {
  return request({
    url: 'istar/api/device/fullData/' + deviceId + '?group=' + group,
    method: 'get'
  })
}

// 分页数据监测
export function getDatasList (deviceId: string, params: any) {
  return request({
    url: 'istar/api/device/fullData/page/' + deviceId,
    method: 'get',
    params
  })
}

// 设备新增 POST api/device?needUpdateGateway=true
export function addDevice (params: any, needUpdateGateway: string) {
  return request({
    url: 'api/device?needUpdateGateway=' + needUpdateGateway,
    method: 'post',
    data: params
  })
}

// 1.2. 网关新建 也是网关 POST api/device
export function createdHostDevice (params: any) {
  return request({
    url: 'api/device',
    method: 'post',
    data: params
  })
}

// 项目操作员新建 post api/newUser   authority为CUSTOMER_USER
export function addUser (params: any) {
  return request({
    url: 'api/newUser',
    method: 'post',
    data: params
  })
}

// 1.5. 挂载项目到指定用户 POST /api/assign/user/{userId} 参数 projectId数组
export function assignUser (userId: string, params: any) {
  return request({
    url: 'api/assign/user/' + userId,
    method: 'post',
    data: params
  })
}

// 新增修改时，项目名是否冲突
export function hasName (params: any) {
  return request({
    url: 'api/tenant/devices',
    method: 'get',
    params
  })
}

// 添加。编辑设备
export function addOrUpdateDevice (data: any) {
  return request({
    url: 'api/realDevice/save',
    method: 'post',
    data
  })
}

/**
 * 获取设备属性列表
 * @param deviceId 设备id
 * @returns
 */
export const getAttrListData = (deviceId: string) => {
  return request({
    url: `api/deviceTemplate/protocol/list/${deviceId}`,
    method: 'get'
  })
}
