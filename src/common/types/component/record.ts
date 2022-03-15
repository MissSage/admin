import { ITableItem as IStorageTableItem } from './storage'
export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}
export interface ITableItem {
  id: string
  type: string
  code: string
  username: string
  time: string
  remark: string
  createTime: string
  creator: string
  tenantId: string
  nameList: string
}
export interface ITableDetail extends ITableItem {
  details: ItableDetailItem[]
}

export interface ItableDetailItem {
  id: string
  mainId: string
  componentId: string
  orderNumber: number
  number: number
  component: IStorageTableItem
}
