import { NormalOption } from '@/common/types/common'
import { IFormItemRule } from '@/common/types/element-plus'
import { ISLTableConfig } from '../SLTable/type'
export interface ISLFormItemBase {
  type: string
  field: string
  label?: string
  hidden?: boolean
  style?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  rules?: IFormItemRule
  aInfo?: boolean
  /**
   * 单位
   *
   * 当设置此项时，会附加在表单元素的尾端
   */
  unit?: string
  /**
   * 格式化表单值,仅当类型为text时有用
   */
  formatter?: (...args: any) => any
  /**
   * 为表单元素指定列宽
   *
   * 值为每行容纳几个元素
   */
  cols?: number
  onChange?: (...args: any[]) => void
}

interface ISLFormInput extends ISLFormItemBase {
  type: 'input'
  onKeyUp?: (...args: any[]) => void
}
interface ISLFormInputNumber extends ISLFormItemBase {
  type: 'input-number'
  onKeyUp?: (...args: any[]) => void
}
interface ISLFormText extends ISLFormItemBase {
  type: 'text'
}
interface ISLFormPassword extends ISLFormItemBase {
  type: 'password'
}
interface ISLFormTextArea extends ISLFormItemBase {
  type: 'textarea'
  minRow?: number
  maxRow?: number
}
interface ISLFormNumber extends ISLFormItemBase {
  type: 'number'
  min?: number
  max?: number
  controlPosition?: 'right'
}
export interface ISLFormSelect extends ISLFormItemBase {
  type: 'select'
  multiple?: boolean
  allowCreate?: boolean
  options?: NormalOption[]
  remote?: boolean
  returnType?: 'str' | 'arr'
  remoteMethod?: (val: any) => NormalOption[]
}
interface ICascaderProps {
  checkStrictly?: boolean
  label?: string
  value?: string
  children?: string
}
interface ISLFormCascader extends ISLFormItemBase {
  type: 'cascader'
  props?: ICascaderProps
  multiple?: boolean
  options?: NormalOption[]
}
interface ISLFormCheckbox extends ISLFormItemBase {
  type: 'checkbox'
  options?: NormalOption[]
}
interface ISLFormRadio extends ISLFormItemBase {
  type: 'radio'
  options?: NormalOption[]
}

interface ISLFormSwitch extends ISLFormItemBase {
  type: 'switch'
  activeText?: string
  inActiveText?: string
  activeColor?: string
  inActiveColor?: string
  activeValue?: string | boolean
  inActiveValue?: string | boolean
}
export interface ISLFormDate extends ISLFormItemBase {
  type: 'date' | 'datetime' | 'month'
  min?: string
  max?: string
  format?: string
  textFormat?: string
}
export interface ISLFormDateRange extends ISLFormItemBase {
  type: 'daterange' | 'datetimerange'
  min?: string
  max?: string
  format?: string
  rangeSeparator?: string
}
interface ISLFormTime extends ISLFormItemBase {
  type: 'time'
  min?: string
  max?: string
  format?: string
  isRange?: boolean
}
interface ISLFormEditor extends ISLFormItemBase {
  type: 'editor'
}
interface ISLFormUploader extends ISLFormItemBase {
  type: 'uploader'
  desc?: string
  multiple?: boolean
  maxFile?: number
  maxSize?: number
  autoUpload?: boolean
  fileTypes?: string[]
  downLoad?: boolean
  uploadBefore?: (...args: any[]) => void
  uploadAfter?: (...args: any[]) => void
  removeBefore?: (...args: any[]) => void
  fileClick?: (...args: any[]) => void
}
interface ISLFormImgUploader extends ISLFormItemBase {
  type: 'image'
  url?: string
  limit?: number
  multiple?: boolean
  returnType?: 'arrStr' | 'comma'
}
interface ISLFormFileUploader extends ISLFormItemBase {
  type: 'file'
  url?: string
  limit?: number
  multiple?: boolean
  returnType?: 'arrStr' | 'comma'
}
interface ISLFormAMap extends ISLFormItemBase {
  type: 'amap'
  required?: boolean
  resultType?: 'str' | 'arrStr'
}
export interface ISLFormUser extends ISLFormItemBase {
  type: 'user'
  height?: string
  width?: string
  /**
   * 多选返回的是用逗号分隔的字符串
   */
  multiple?: boolean
  checkUsers?: (users: any) => void
}
/**
 * 表格
 * 暂不支持浮动布局，只能是100% 宽度
 *
 * 高度只能通过config.height来控制，
 *
 * 当只想显示一个table的时候请直接使用SLTable
 */
export interface ISLFormTable extends Partial<ISLFormItemBase> {
  type: 'table'
  hide?: boolean
  config: ISLTableConfig
}
export type ISLFormItem =
  | ISLFormSelect
  | ISLFormInput
  | ISLFormText
  | ISLFormPassword
  | ISLFormTextArea
  | ISLFormNumber
  | ISLFormEditor
  | ISLFormUploader
  | ISLFormCascader
  | ISLFormCheckbox
  | ISLFormRadio
  | ISLFormSwitch
  | ISLFormDate
  | ISLFormDateRange
  | ISLFormTime
  | ISLFormImgUploader
  | ISLFormAMap
  | ISLFormTable
  | ISLFormUser
  | ISLFormInputNumber
  | ISLFormFileUploader

export type IBtnType =
  | ''
  | 'default'
  | 'text'
  | 'success'
  | 'warning'
  | 'info'
  | 'primary'
  | 'danger'
export type ISLFormBtn = {
  text: string
  disabled?: boolean
  icon?: string
  click?: (...args: any[]) => void
  style?: string
  type?: IBtnType
  class?: string
}
