// 视频添加时的类型 参考重庆

/**
 * 添加视频接口类型
 */
 export interface ISaveVideo {
  id: string
  additionalInfo: string
  videoName: string
  nyVideo: INyVideo
  serialNumber: string
  projectId: string
}
export interface INyVideo {
  accesstype: number
  address: string
  channelinfo: IChannelInfo[]
  deviceid: string
  devicename: string
  devicepwd: string
  online: number
  protocol: number
  status: number
}
export interface IChannelInfo {
  aperture: number
  channelid: string
  focus: number
  ptz: number
  zoom: number
}

/**
* 视频记录
*/
export interface IVideoRecord extends ISign {
  parmdata: IRecordParmData
  sign: string
}
export interface IRecordParmData {
  deviceid: string
  endtime: string
  memberkey: string
  pageSize: number
  pagenum: number
  sort: number
  starttime: string
}
/**
* 获取视频源的参数类型
*/
export interface IVideoSource {
  sign: string
  parmdata: IVideoSourceParam
}
export interface IVideoSourceParam {
  accesstype: number
  memberkey: string
  networktype: number
  m3u8Type: number
}
/**
* Live
*/
export interface IVideoLive extends ISign {
  parmdata: {
      accesstype: number
      deviceid: string
      m3u8Type: number
      memberkey: string
      networktype: number
  }
}

/**
* 视频列表item
*/
export interface IListVideoItem {
  additionalInfo: string
  appKey: string
  appSecret: string
  captcha: string
  channelId: string
  id: string
  projectId: string
  serialNumber: string
  tenantId: string
  updateTime: number
  url: string
  videoName: string
  videoType: string
}
/**
* 注册视频参数
*/
export interface ISignVideoParam {
  param: string
}
/**
* 注册视频参数
*/
export interface ISign {
  sign: string
}