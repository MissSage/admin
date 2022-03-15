import { APPKEY } from '@/common/constants/videos'
import { ISaveVideo, ISignVideoParam, IVideoLive, IVideoRecord, IVideoSource } from '@/common/types/video'
import { request } from '@/utils/axios'
import { AxiosRequestHeaders } from 'axios'

/** save User */
// TODO: Need ReFacotr
export function saveVideo (params: any) {
  return request({
    url: 'api/video/save',
    method: 'post',
    data: params
  })
}

export function getVideo (projectId: string) {
  return request({
    url: 'api/video/findByProject/' + projectId,
    method: 'get'
  })
}
export function deleteVideo (id: string) {
  return request({
    url: 'api/video/delete/' + id,
    method: 'delete'
  })
}

export function deleteVideoList (params: any) {
  return request({
    url: 'api/video/delete/all',
    method: 'post',
    data: params
  })
}

// -----------  能力视频相关 api  -----------

// 生成 能力视频appkey
export function getVideoNLSign (params: any) {
  return request({
    url: 'api/aep/sign',
    method: 'post',
    data: params
  })
}

export function NLVideoCall (params: any) {
  return request({
    url: 'api/aep/call',
    method: 'post',
    data: params
  })
}
const removeHeader = (name:string, headers?:AxiosRequestHeaders) => {
  if (headers && headers[name]) {
    delete headers[name]
  }
}
// 能力智慧视频
export function getNLDevice (params: any) {
  return request({
    url: `api/dict/device/select?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力预览
export function mediaLive (params: any) {
  return request({
    url: `api/dict/media/live?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力 云台方向控制 /device/ctrl/ptz
export function ctrlChangePtz (params: any) {
  return request({
    url: `api/dict/device/ctrl/ptz?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力 聚焦控制 /device/ctrl/zoom
export function ctrlChangeZoom (params: any) {
  return request({
    url: `api/dict/device/ctrl/zoom?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力 光圈控制 /device/ctrl/aperture
export function ctrlChangeAperture (params: any) {
  return request({
    url: `api/dict/device/ctrl/aperture?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力 存储空间信息查询 /space/status
export function getSpaceStatus (params: any) {
  return request({
    url: `api/dict/space/status?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 能力 云端录像查询 /storage/find/videorecord
export function getVideorecord (params: any) {
  return request({
    url: `api/dict/storage/find/videorecord?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}

// 获取播放源
export function getVideosName (params?:string) {
  return request({
    url: 'api/video/camaraList',
    method: 'get',
    params
  })
}

// 获取视频地址
export function getvideourl (params:string) {
  return request({
    url: `api/video/getPreviewUrl/${params}`,
    method: 'get'
  })
}

// ----------------------------------------
// 保存视频到我们系统
export function saveNyVideo (params: any) {
  return request({
    url: 'api/video/video/save',
    method: 'post',
    data: params
  })
}

// 我们系统保存的能力视频  api/video/findByProjectAndType/{projectId}/NY
export function findByProjectAndType (projectId: string) {
  return request({
    url: 'api/video/findByProject/' + projectId,
    method: 'get'
  })
}

// 地图 企业下所有视频  api/video/findByTenantIdAndType/NY
export function findByTenantIdAndType () {
  return request({
    url: 'api/video/findByTenantIdAndType/NY',
    method: 'get'
  })
}

/** ********************************
 * add by lichao
 * 20210929
 *
*/

/**
 * 保存录像
 * @param params
 * @returns
 */
export const SuYuan_SaveVideo = (params: ISaveVideo) => {
  return request({
    url: 'api/video/save',
    method: 'post',
    data: params
  })
}
/**
 * 根据项目id和类型获取视频列表
 * @param projectId
 * @param type
 * @returns
 */
export const SuYuan_GetVideos = (projectId: string) => {
  return request({
    url: `api/video/findByProject/${projectId}`,
    method: 'get'
  })
}
/**
 * 获取视频源列表
 * @param params
 * @returns
 */
export const SuYuan_GetVideoSources = (params: IVideoSource) => {
  return request({
    url: `api/dict/device/select?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}
/**
 * 注册视频
 * @param params
 * @returns sign
 */
export const SuYuan_SignVideo = (params: ISignVideoParam) => {
  return request({
    url: 'api/aep/sign',
    method: 'post',
    data: params
  })
}
/**
 * 请求在线视频
 * @param appkey
 * @param params
 * @returns
 */
export const SuYuan_GetVideoLive = (params: IVideoLive) => {
  return request({
    url: `api/dict/media/live?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}
/**
 * 获取视频记录
 * @param appkey
 * @param params
 * @returns
 */
export const SuYuan_VideoRecords = (params: IVideoRecord) => {
  return request({
    url: `api/dict/storage/find/videorecord?appkey=${APPKEY}`,
    method: 'post',
    data: params,
    transformRequest: [function (data1, headers) {
      removeHeader('X-Authorization', headers)
      removeHeader('currentTenant', headers)
      return data1
    }]
  })
}
/**
 * 根据id数组批量删除视频信息
 * @param ids
 * @returns
 */
export const SuYuan_DeleteVideo = (ids: string[]) => {
  return request({
    url: 'api/video/delete/all',
    method: 'post',
    data: ids
  })
}
/** ******************************** */
