// export interface ICTCardTable extends CTCardTable {
//   selectList?: ITableItem[]
// }
// // 查询表格数据返回结果
// export interface ITableItem {
//   id: string
//   name: string
//   status: string
//   executeTime: Date
//   completeTime: Date
//   acceptanceTime: Date
//   endTime: Date
//   createTime: Date
//   creator: string
//   tenantId: string
// }
// // 查询详情返回结果
// export interface IStandard extends ITableItem {
//   jobList: ITaskJob[]
// }
// // 检修项
// export interface ITaskJob {
//   id: string
//   mainId: string
//   projectId: string
//   deviceId: string
//   startTime: Date
//   endTime: Date
//   status: string
//   standardName: string
//   standardDtail: string
//   imgs: string
//   voiceFile: string
//   remark: string
//   orderNumber: number
//   createTime: string
//   tenantId: string
//   projectName: string
//   deviceName: string
// }
export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}
// 查询表格数据返回结果
export interface ITableItem {
  id: string
  orderId?: string
  name: string
  type: string
  status: string
  executeTime: Date | null
  completeTime: Date | null
  acceptanceTime: Date | null
  endTime: Date | null
  createTime: Date | null
  creator: string
  tenantId: string
  deviceNameList?: string
  code?:string
}
// 查询详情返回结果
export interface ITask extends ITableItem {
  jobList: ITaskJobListItem[]
  trigger?: ITaskTrigger
}
export interface ITaskTrigger {
  id: string
  mainId: string
  projectId: string
  deviceId: string
  detail: string
  createTime: Date|null
  tenantId: string
  triggerList: ITaskTriggerItem[]
}
export interface ITaskTriggerItem{
  orderNumber: number
  attr: string
  condition: string
  value: string
  relation: string
}
// 检修项
export interface ITaskJobListItem {
  id: string
  mainId: string
  startTime: Date | null
  endTime: Date | null
  status: string
  projectId: string
  deviceId: string
  imgs: string
  remark: string
  standardName: string
  standardDtail: string
  voiceFile: string
  orderNumber: number
  createTime: string
  tenantId: string
  projectName: string
  deviceName: string
}
export interface IIssue {
  name: string
  type: string
  projectId: string
  deviceId: string
  imgs: string
  remark: string
}
