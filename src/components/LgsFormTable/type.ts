import { ILgsFormItem } from '../LgsFormItem/type'

type ILgsTableColumnBase = {
  label:string
  field:string
  formItem?:ILgsFormItem
  width?:string
  onChange?:(row?:any, val?:any) => void
  formatter?:(row?:any, column?:any, cellValue?:any, index?:number) => any
}

export type ILgsTableColumn = {
  }&ILgsTableColumnBase
export type ILgsTableConfig = {
  columnIndex?:boolean
  columnCheck?:boolean
  columns:ILgsTableColumn[]
}
