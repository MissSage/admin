import { IFormRule } from '@/types/element-plus'
import { ILgsFormBtn, ILgsFormItem } from '../LgsFormItem/type'

export type ILgsForm = {
  labelPosition?:'left'
  rules?:IFormRule
  columns:ILgsFormItem[]
  defaultValues:Record<string, any>
  btns?: ILgsFormBtn[]
}
