// 扩展CardTable类型
export interface ICTCardTable extends CTCardTable {
    selectList?: ITableItem[]
}
// 查询表格数据返回结果
export interface ITableItem {
    id: string
    serialNumber: string
    status: number
    auditor: number
    creator: string
    createTime: Date|null
    inventoryTime: Date|null
    toDepart: string
    toAddress: string
    newCreator: string
    remark: string
    change: number
}
