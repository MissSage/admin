// 扩展CardTable类型
export interface ICTCardTable extends CTCardTable {
    selectList?: ITableItem[]
}
// 查询表格数据返回结果
export interface ITableItem {
    id: string
    pSerialNumber: string
    status: number
    creator: string
    start: Date|null
    expectInventoryTime: Date|null
    remark: string
    deviceType: string
}
