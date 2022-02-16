import { ILgsFormItem } from '../LgsFormItem/type'

type ILgsTableColumnBase = {
  label: string
  field: string
  icon?: string | ((row: any, index: number) => string)
  formItem?: ILgsFormItem
  width?: string
  onChange?: (row?: any, val?: any) => void
  formatter?: (row?: any, column?: any, cellValue?: any, index?: number) => any
}

export interface ILgsTableColumn extends ILgsTableColumnBase {
}
export type ILgsTableConfig = {
  columnIndex?: boolean
  columnCheck?: boolean
  columns: ILgsTableColumn[]
  treeProps?: {
    children: string
    hasChildren: string
  }
  dataList: any[]
  rowKey?: string
  defaultExpandAll?: boolean
}
