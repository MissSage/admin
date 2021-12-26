
// type FormItemType = 'text'|'textarea' | 'number' | 'date'|'radio'|'checkbox'|'select'|'cascader' | 'switch' | 'img' | 'excel' | 'file' | 'editor' | 'table' | 'custom'
type SizeType = 'large' | 'medium' | 'small' | 'mini'
type NormalOption = {
  label: string
  value: any
  disabled?: boolean
  children?: any[]
}
export type TableColum = {
  title: string
  field: string
  show: boolean
  required: boolean
  editable: boolean
  dataSource: any[]
  width: number
  orderNo: number
}
/**
 * 表单元素的公共属性
 */
type FormItemBase = {
  id: number
  name: string
  value: string | number
  disabled: boolean
  readonly: boolean
  size: SizeType
  placeholder: string
}

/** ** 根据具体的表单元素定制类型 ******/

/**
 * 文本框
 */
type TextFormItem = Partial<FormItemBase> & {
  type: 'text'
  name: string
  /**
   * 文本框左侧附属内容（组件）
   */
  prepend?: any
  /**
   * 文本框右侧附属内容 （组件）
   */
  append?: any
  // 左侧图标
  prefixIcon?: string
  // 右侧图标
  suffixIcon?: string
  /**
   * 是否以密码格式显示
   */
  showPassword?: boolean
  clearable?: boolean
}
/**
 * 文本框
 */
type NumberFormItem = Partial<FormItemBase> & {
  type: 'number'
  step?: number
  precision?: number
  max?: number
  min?: number
  controlsPosition?: 'right'
  clearable?: boolean
}
/**
 * 文本域
 */
type TextAreaFormItem = Partial<FormItemBase> & {
  type: 'textarea'
  rows?: number
  autosize?: boolean | string
  clearable?: boolean
}
/**
 * 日期
 */
type DateAreaFormItem = Partial<FormItemBase> & {
  type: 'date'
  clearable?: boolean
}
/**
 * 单选
 */
type RadioFormItem = Partial<FormItemBase> & {
  type: 'radio'
  options: NormalOption[]
}
/**
 * 多选
 */
type checkboxFormItem = Partial<FormItemBase> & {
  type: 'checkbox'
  value: any[]
  options: NormalOption[]
}
/**
 * 下拉框
 */
type SelectFormItem = Partial<FormItemBase> & {
  type: 'select'
  options: NormalOption[]
  multiple?: boolean
  clearable?: boolean
  // 自定义的option选项,默认传入option选项
  customComp?: any
}
/**
 * 级联下拉框
 */
type CascaderFormItem = Partial<FormItemBase> & {
  type: 'cascader'
  options: NormalOption[]
  multiple?: boolean
  // 多选时是否将选择项以+n的形式展示，默认是展开显示
  collapseTags?: boolean
  clearable?: boolean
}
/**
 * 开关
 */
type SwitchFormItem = Partial<FormItemBase> & {
  type: 'switch'
  activeValue: string | number
  inactiveValue: string | number
  activeColor?: string
  inactiveColor?: string
}
/**
 * 文件上传
 */
type UploaderFormItem = Partial<FormItemBase> & {
  type: 'img' | 'excel' | 'file'
  multiple?: boolean
  maxSize?: number
  maxFile?: number
  autoUpload?: boolean
}
/**
 * 编辑器
 */
type EditorFormItem = Partial<FormItemBase> & {
  type: 'editor'
  height?: number
}
/**
 * 表格
 */
type TableFormItem = Partial<FormItemBase> & {
  type: 'table'
  url?: string
  icon?: string
  rows?: any[]
  columns?: Partial<TableColum>[]
  // 行号
  showIndex?: boolean
  // 是否创建索引
  index?: boolean
  checkable?: boolean
  editable?: boolean
  height?: number
  operations?: any[]
  headerOperations?: any[]
}
/**
 * 用户传入的自定义组件
 */
type CustomFormItem = Partial<FormItemBase> & { type: 'custom' }

/**
 * 表单元素声明
 * 根据不同type属性返回不同类型
 */
export type LgsFormItem = TextFormItem |
  TextAreaFormItem |
  NumberFormItem |
  DateAreaFormItem |
  RadioFormItem |
  checkboxFormItem |
  SelectFormItem |
  CascaderFormItem |
  SwitchFormItem |
  UploaderFormItem |
  EditorFormItem |
  TableFormItem |
  CustomFormItem
