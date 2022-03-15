export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}
// 查询表格数据返回结果

export interface ITableItem {
  id: string
  name: string
  type: string
  executeTime: Date | null
  periodTime: number | null
  status: string
  creator: string
  createTime: Date | null
  tenantId: string
  deviceNameList: string
}
// 查询详情返回结果
export interface IPlan extends ITableItem {
  jobList: IPlanJob[]
  trigger?: IPlanTrigger
}
export interface IPlanJob {
  id: string
  mainId: string
  deviceType: string
  createTime: string
  tenantId: string
  projectId: string | string[]
  deviceId: string | string[]
  standardId: string | string[]
  remark: string
  orderNumber: number
  projectName: string
  deviceName: string
  standardName: string
  devices?: any[]
  standards?: any[]
}
export interface IPlanTrigger {
  id: string
  mainId: string
  detail: string
  createTime: Date | null
  tenantId: string
  projectId: string | string[]
  deviceId: string | string[]
  standardId: string | string[]
  triggerList: IPlanTriggerListItem[]
}
export interface IPlanTriggerListItem {
  orderNumber: number
  attr: string
  unit: string
  condition: string
  value: string
  relation: string
}
