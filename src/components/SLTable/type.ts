import { ISLOperation } from '../SLCardSearch/type'
import { ISLFormItem } from '../SLFormItem/type'
import { ISLPaginationConfig } from '../SLPagination/type'
export interface ISLTableColumn {
  prop: string
  label: string
  formatter?: (row: any, val: any, field?: string) => string
  border?: string
  align?: 'center' | 'right'
  fixed?: string | boolean
  minWidth?: string | number
  width?: string | number
  icon?: string
  image?: boolean
  className?: string
  cellStyle?: Record<string, string>
  handleClick?: (row: any) => void
  /**
   * 仅当为表单元素时生效
   *
   * row:当前行内容
   *
   * val:选中的值
   */
  handleChange?: (row: any, val: any, field?: string) => void
  /**
   * 为table配置表单元素
   *
   * 当存在这个属性时，则table对应列的单元格将为此配置设置的表单元素
   */
  slFormItemConfig?: ISLFormItem
}
export interface ISLTableIndex {
  label?: string
  width?: string
  align?: string
  fixed?: 'right'
  showRank?: boolean
}
export interface ISLTableConfig {
  loading?: boolean
  selectList?: any[]
  currentRow?: any
  indexVisible?: ISLTableIndex | boolean
  dataList: any[]
  columns: ISLTableColumn[]
  operations?: ISLOperation[]
  operationFixed?: boolean | string
  operationWidth?: string
  height?: string | number
  maxHeight?: string | number
  sort?: {
    // topColors?: string[] // 暂时无用
    showBackground?: boolean
    order?: 'ascending' | 'descending'
    prop?: string
  }
  pagination: ISLPaginationConfig
  showSummary?: boolean
  summaryMethod?: (params:any) => any
  handleSelectChange?: (val: any) => any
  handleRowClick?: (row: any) => any
  handleRowDbClick?: (row: any) => any
}
