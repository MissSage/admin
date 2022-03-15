export interface ISLDialogConfig {
  visible?: boolean
  title?: string
  headComponent?: any
  contentHeight?: number | string
  contentMaxHeight?: number | string
  width?: string | number
  scrollbar?: boolean // 是否要把内容默认加载在scrillbar中
  confirm?: {
    text?: string
    show?: boolean
    handler?: (...args: any) => Promise<any>
  }
  cancel?: {
    text?: string
    show?: boolean
    handler?: () => Promise<any>
  }
  footerAlign?: 'right' | 'left' // 默认右边
  /**
   * default false
   */
  modalClose?: boolean
  /**
   * default:true
   */
  escapeClose?: boolean
}
