import { ISLFormItem } from '../SLFormItem/type'

export interface ISLMoreFilter {
  filters?: ISLFormItem[]
  /**
   * 是否行内表单，意思就是是否可以一行多个表单元素
   *
   * 默认是true
   */
  inline?: boolean
}
