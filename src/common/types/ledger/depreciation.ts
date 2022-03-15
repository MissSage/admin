// 扩展CardTable类型
export interface ICTCardTable extends CTCardTable {
    selectList?: ITableItem[]
}
// 查询表格数据返回结果
export interface ITableItem {
    id: string
    serialNumber: string
    name: string
    pTime: Date|null
    method: number
    price: number
    serviceLife: number
    rateResidual: string
    month: string
    originalValue: string
    pdc: string
    accumulatedDepreciation: string
    netWorth: string
}
