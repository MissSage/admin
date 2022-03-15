import { ISLOperation } from '../SLCardSearch/type'
import { ISLFormItem } from '../SLFormItem/type'
import { ISLTableConfig } from '../SLTable/type'

export interface ISLCardTable extends ISLTableConfig {
  /**
   * 标题
   * 可以传true,当只需要右侧时可以这么用，一般直接传文本
   */
  title?: string | boolean
  /**
   * 标题右侧的按钮，需要设置title
   */
  headerBtns?: ISLOperation[]
  headerQuery?:ISLFormItem[]
  headerQueryDefault?:any
  handleQuery?:(queryParams:any)=>any
}
