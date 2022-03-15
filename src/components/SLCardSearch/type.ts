import { ISLFormItem } from '../SLFormItem/type'
import { ISLMoreFilter } from '../SLMoreFilter/type'
export type ISLOperation = {
  type?: string | ((row?: any) => string)
  text?: string | ((row?: any) => string)
  icon?: string | ((row?: any) => string)
  color?: string | ((row?: any) => string)
  styles?: string | ((row?: any) => string)
  perm?: boolean | ((row?: any) => boolean)
  disabled?: boolean | ((row?: any) => boolean)
  loading?: boolean | ((row?: any) => boolean)
  click?: (row?: any) => void
}

export type ISLCardSearch = {
  filters?: ISLFormItem[] // 默认左边筛选内容
  rightFilter?: ISLFormItem[] // 右边筛选内容
  moreFilter?: ISLMoreFilter // 下滑的更多筛选内容
  operations?: ISLOperation[] // 默认左边的按钮组
  midOperations?: ISLOperation[] // 中间的按钮组
  rightOperations?: ISLOperation[] // 右边的按钮组
  defaultParams?: Record<string, any> // 传入默认值
  handleSearch?: (...args: any[]) => void // 定义默认的搜索方法
  labelWidth?: string // 带单位的长度
}
