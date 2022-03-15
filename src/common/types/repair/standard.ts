export interface ICTCardTable extends CTCardTable {
  selectList?: ITableItem[]
}
// 查询表格数据返回结果

export interface ITableItem {
  id: string
  name: string
  deviceType: string
  remark: string
  creator: string
  createTime: string
  tenantId: string
}
// 查询详情返回结果
export interface IStandard extends ITableItem {
  detailList: IStandardDetail[]
}
// 检修项
export interface IStandardDetail {
  orderNumber: number
  stepName: string
  method: string
}
