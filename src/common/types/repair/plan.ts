// 扩展CardTable类型
export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}

// 查询表格数据返回结果
export interface ITableItem {
  id: string
  name: string
  type: string
  executeTime: Date|null
  periodTime: number
  status: string
  creator: string
  createTime: Date|null
  orderId?:string
}
// 查询详情返回结果
export interface IPlan extends ITableItem {
  jobList: IPlanJob[]
  deviceNameList: string
  trigger?: IPlanTrigger
}

export interface IPlanJob {
  id: string
  mainId: string
  projectId: string | string[]
  deviceId: string | string[]
  standardId: string
  remark: string
  orderNumber: number
  createTime: string
  tenantId: string
  projectName: string
  deviceName: string
  standardName: string
  devices?:any[]
  standards?:any[]
}
export interface IPlanTrigger{
  id: string
  mainId: string
  projectId: string | string[]
  deviceId: string | string[]
  detail: string
  createTime: Date|null
  tenantId: string
  triggerList: IPlanTriggerListItem[]
}
export interface IPlanTriggerListItem {
  orderNumber: number
  attr: string
  unit:string
  condition: string
  value: string
  relation: string
}
