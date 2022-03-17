
import { IFormItemRule } from '@/common/types/element-plus'
import { FormItemRule } from 'element-plus'
import { Arrayable } from 'element-plus/es/utils'
import { ISLOperation } from '../SLCardSearch/type'
import { ISLFormItem } from '../SLFormItem/type'

/**
 * 一个分组，fieldset
 */
export interface ISLFieldset {
  /**
   * fieldset的描述内容
   */
  desc?: string
  /**
   * 为fieldset的右侧添加按钮
   */
  right?: ISLOperation[]
  query?: ISLFormItem[]
  // eslint-disable-next-line no-use-before-define
  handleQuery?:(val:any, item:ISLFormItem, column:ISLFormFieldSet)=>any
}
/**
 * 一个表单字段组
 */
export type ISLFormFieldSet = {
  /**
   * 表单元素是否为适应的
   */
  flexable?: boolean
  /**
   * 每行可以有多少个表单元素
   */
  cols?: number
  /**
   * 为表单分组
   */
  fieldset?: ISLFieldset
  /**
   * 表单元素
   */
  fields: ISLFormItem[]
}
export interface ISLFormConfig {
  labelWidth?: string // 120px
  labelPosition?: 'left'
  /**
   * 表单默认值
   */
  defaultValue?: Record<string, any>
  /**
   * 表单中fieldset选项的query选项的默认值
   */
  defaultQuerys?:Record<string, any>
  rules?: Partial<Record<string, Arrayable<FormItemRule>>>
  columns: ISLFormFieldSet[]
  /**
   * 在提交前整理数据的勾子
   */
  setBeforeSubmit?: (params: any) => any
  /**
   * 提交方法
   */
  submit?: (params: any) => Promise<any>
}
