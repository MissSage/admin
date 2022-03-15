// 扩展CardTable类型

// 查询表格数据返回结果
export interface ITableItem {
    id: string
    deviceNo: string
    deviceName: string
    deviceType: number
    executeTime: Date|null
    // periodTime: number
    deviceStatus: number
    director: string
    purchaseTime: Date|null
    expectScrapTime: Date|null
    imageUrl:string
    serialNumber: string
    deviceGrade: number
    unit: string
    brand: string
    supplier: string
    deviceSource: string
    purchaseAmount: string
    warrantyTime: Date|null
    enableTime: Date|null
    projectId: string
    remark: string
}
