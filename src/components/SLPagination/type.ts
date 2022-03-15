export interface ISLPaginationConfig {
  hide?:boolean
  page?: number
  limit?: number
  total?: number
  align?: 'left'|'right' // 默认在左侧
  layout?: string // 分布布局
  pageSize?: number[]
  handleSize?: (size: number) => any
  handlePage?: (page: number) => any
}
