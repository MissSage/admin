// 扩展CardTable类型
//处置
export interface ICTCardTable extends CTCardTable {
    selectList?: ITableItem[]
}
// 查询表格数据返回结果
export interface ITableItem {
    id: string
    handleNo: string
    status: number
    reviewerId: number
    applicantId: string
    createTime: Date|null
    handleType: string
    deviceType: string
    remark: string
}
