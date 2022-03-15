/**
 * 查询设备控制列表参数
 */
export type QueryControlListParam = {
  projectId: string
  propertyType?: string
  deviceId?:string
}
/**
 * 下属设备控制参数
 */
export type PostControlParam = {
  deviceId: string
  property: string
  value: string
}
/**
 * 设备控制属性
 */
export type ControlProperty = {
  property: string
  propertyName: string
  status: boolean
  value: string
  collectionTime?: number
  propertyType: string
  group: string
  controlOptions: string
}
/**
 * 设备控制信息
 */
export type ControlInfo = {
  id: {
    entityType: string
    id: string
  }
  createdTime: number
  name: string
  type: string
  status: boolean
  propertyDataList: ControlProperty[]
  control: boolean
}

export interface IDialogConfig {
  visible?: boolean
  deviceName?: string
  title?: string
  status?: boolean
  iconClass?: string
  deviceId?: string
  propId?: string
  projectId?: string
  device?: ControlInfo
}

export interface IControlItem {
  title: string
  formType: string
  value: string
  tempValue: string
  updateTime?: string
  id: string
  controlOptions: NormalOption[]
  sending?:boolean
}
// export interface IControlHis {
//   alarmTime?: string
//   lon?: string
//   lat?: string
//   type?: string
//   restartInfo?: string
//   envTemp?: string
//   envTempRH?: string
//   envTempV?: string
// }
export type IControlHis = Record<string, any>
export interface IControlAlarm {
  // alarmTime?: string
  // deAlarmTime?: string
  // name?: string
  // type?: string
  // level?: string
  // attachValue?: string
  // restoreValue?: string
  // status?: string
  confirm?: string
  // id?: string
  // deviceName?: string
  ackTs: number
  alarmCycle: any
  alarmJsonId: any
  alarmJsonName: any
  alarmType: any
  clearTs: number
  createdTime: number
  details: {
    clearRemarks: any
    dismissal: string
    record: IControlAlarmDetail[]
    type: string
  }
  deviceName: string
  endTs: number
  id: {
    entityType: string
    id: string
  }
  level: any
  name: string
  originator: {
    entityType: string
    id: string
  }
  propagate: boolean
  severity: string
  startTs: number
  status: string
  tenantId: {
    entityType: string
    id: string
  }
  type: string
  value: any
}
export interface IControlAlarmDetail {
  // id?:string
  // alarmTime?:string
  // deAlarmTime?:string
  // alarmInfo?:string
  info: string
  status: string
  ts: number
}
/**
 * 设备卡片头部右侧按钮
 */
export interface IControlHeaderBtn {
  icon?: string
  text?: string
  type?: string
  hide?: boolean
  click?: () => void
}

/**
 * 设备变量趋势数据查询参数
 */
export type QueryTrendListParam = {
  page?: number | string
  size?: number | string
  start: number
  end: number
  type: string
  attributes: any[]
}
/**
 * 查询报警记录参数
 */
export type QueryAlarmListParam = {
  projectId?: string
  deviceId?: string[]
  page?: string | number
  size?: string | number
  start: number
  end: number
}
