export interface ITableItem {
  id: string
  code: string
  name: string
  type: string
  specification: string
  unit: string
  number: number
  createTime: Date | null
  creator: string
  isDel: string
  tenantId: string
}
// 保存备件
export interface ISaveItem {
  id: string
  code: string
  name: string
  type: string|string[]
  specification: string
  unit: string
}
// 重写table配置声明
export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}
// 入库、出库
export interface ISaveOption{
  type:string
  username:string
  time:Date|null
  remark:string
  details:ISaveOptionDetail[]
}
export interface ISaveOptionDetail{
  componentId:string
  orderNumber:number
  name: string
  type: string
  specification: string
  unit: string
  number: number
  storeNumber:number
}