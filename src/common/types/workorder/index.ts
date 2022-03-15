import { AxiosPromise } from 'axios'
import { ISaveOptionDetail } from '../component/storage'
// 扩展CTCardTable，给selectList添加指定类型
export interface ICTCardTable extends CTCardTable {
  selectList?: IWorkOrder[]
}
export interface ITreeConfig extends SLTreeConfig {
  data: ITreeNode[],
  currentProject:ITreeNode,
  treeNodeHandleClick?: (params:ITreeNode)=>void
}
export interface ITreeNode {
  id: IOrderCatogaries | undefined
  leaf: boolean
  name: string
  nodeId?: string
  parentId: string
}

export type IOrderStatus = '-1' | '1' | '2' | '3' | '4' | '5'
export type IOrderCatogaries = '1' | '2' | '3' | '4'
export interface IOrderStatusOptions {
  [propName: string]:IOrderStatus
}
export interface IWorkOrderAcceptanceParams {
  id: string
  acceptance: boolean
  realEndTime?: Date
  isEnd?: 'true' | 'false'
  acceptanceRemark?: string
  acceptanceImgs?: string
  acceptanceVoiceFile?: string
}
export interface IWorkOrderResponse {
  code: string
  message: string
}
export interface IWorkOrder {
  id?: string
  type?: '0' | '1' | '2'
  code?: string
  name?: string
  questionRemark?: string
  questionFile?: string
  status?: IOrderStatus
  isOutsider?: 'true' | 'false'
  executor?: string
  executorName?: string
  creator?: string
  creatorName?: string
  createTime?: Date
  deadlineTime?: Date
  remark?: string
  isEnd?: 'true' | 'false'
  realStartTime?: Date
  realEndTime?: Date
  processImgs?: string
  processVoiceFile?: string
  acceptanceTime?: Date
  acceptanceRemark?: string
  acceptanceImgs?: string
  acceptanceVoiceFile?: string
  contentId?: string
  priority?: '1' | '2' | '3' | '4'
  follow?:boolean
}
export interface IWorkOrderComfirmParams {
  id: string
  confirm: boolean
}
// export interface IComponentOption{
//   componentId:string
//   number:number
// }
export interface IWorkOrderJobList {
  id: string
  mainId?: string
  projectId?: string
  deviceId?: string
  startTime?: string
  endTime?: string
  status?: string
  standardName?: string
  standardDtail?: string
  imgs?: string
  voiceFile?: string
  remark?: string
  orderNumber?: 0
  createTime?: string
  tenantId?: string
  projectName?: string
  deviceName?: string
  processRemark?: string
  componentOptions?: ISaveOptionDetail[]
}
export interface IWorkOrderConotentDetail {
  id: string
  name?: string
  type?: string
  status?: string
  executeTime?: string
  completeTime?: string
  acceptanceTime?: string
  endTime?: string
  createTime?: string
  creator?: string
  tenantId?: string
  jobList?: IWorkOrderJobList[]
}
export interface IWorkOrderDetail extends IWorkOrder {
  contentDetail: IWorkOrderConotentDetail
}

export interface IWorkOrderListParams {
  page: string | number
  size: string | number
  type?: IOrderCatogaries
  code?: string
  complete?: boolean
  createTimeStart?: string | number
  createTimeEnd?: string | number
  priority?: string
  status?: IOrderStatus | ''
  orderType?: '1' | '2' | '0' | ''
  creator?: string
  executor?: string
}

export interface IWorkOrderList {
  total: number
  list: IWorkOrder[]
}

export interface IWorkOrderSaveParams {
  type: string
  name: string
  questionRemark: string
  questionFile: string
  isOutsider: string
  executor: string
  deadlineTime: string
  contentId: string
  priority: string
}
export interface ISetpOrderConfig {
  visible: boolean
  order: IWorkOrder | null
  title: string
  dialogWidth?: number | string
  close?: () => void
  confirmOrder?: (params?: IWorkOrderComfirmParams) => AxiosPromise<any> // 接单/退单
  processOrder?: (params?: IWorkOrder) => AxiosPromise<any> // 提交验证
  acceptanceOrder?: (params?: IWorkOrderAcceptanceParams) => AxiosPromise<any> // 验收、驳回
}
export interface ICounterOrderParams{
  countType?:string
  queryType?:IOrderCatogaries
}