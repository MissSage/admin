export interface ILgsLayer {
  id: string
  layer: any
}
export type ILTheme = 'primary' | 'darkblue' | 'dark'
export type IPosition =
  | 't'
  | 'r'
  | 'b'
  | 'l'
  | 'lt'
  | 'lb'
  | 'rt'
  | 'rb'
  | [number | string, number | string]
export type IXPosition = 'left' | 'right' | 'top' | 'bottom'
export type ILType =
  | 'component'
  | 'message'
  | 'notify'
  | 'popover'
  | 'toast'
  | 'footer'
  | 'actionsheet'
  | 'actionsheetPicker'
  | 'android'
  | 'ios'
  | 'contextmenu'
  | 'drawer'
  | 'iframe'
export type IFollowTarget = string | [number, number]
export type IRectInfo = [number, number, number, number, number, number, string]
export type IBtnType = 'primary' | 'warning' | 'info' | 'error' | 'default'
export type IMessageType = 'warning' | 'info' | 'error' | 'default'
export type IBtn = {
  text: string
  disabled?: boolean
  icon?: string
  click?: (...args: any[]) => void
  style?: string
  type?: IBtnType
  class?: string
}
export type IAnims =
  | 'scaleIn'
  | 'fadeIn'
  | 'footer'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
export type IToastIcon = Record<string, string>

export type ILgsLayerHeader = {
  hide?: boolean
  component?: any
  text?: string
  hideClose?: boolean
  hideMaximize?: boolean
  hideMinimize?: boolean
  extrabtns?: IBtn[]
}

export type ILClose = {
  show?: boolean
  postion?: IXPosition
  color?: string
  click?: () => void
}
export type IFollowPosition = 'l' | 'r' | 't' | 'b' | 'c'
export interface ILgsLayerConfigs {
  width?: string
  height?: string
  header?: ILgsLayerHeader
  /**
   * 指定弹窗放入的父容器
   * 父容器需要指定定位为relative
   */
  teleport?: string
  time?: number | undefined
  position?: IPosition
  follow?: IFollowTarget | undefined
  followPosition?: IFollowPosition
  autoFit?: boolean
  shade?: boolean
  shadeClose?: boolean
  btns?: IBtn[]
  btnAlign?: 'right' | 'left' | 'center'
  opacity?: number
  id?: string
  anim?: IAnims
  type?: ILType
  layerStyle?: string
  icon?: string
  content?: any
  props?: Record<string, any>
  resize?: boolean
  theme?: string
  dragable?: boolean
  dragOut?: boolean
  beforeClose?: () => Promise<void>
  onSuccess?: (...args: any[]) => Promise<void>
  onClosed?: (...args: any[]) => Promise<void>
  onOpened?: () => Promise<void>
}
export type ILgsLayerProps = {
  modelValue: boolean
  config: ILgsLayerConfigs
}

export type ILgsLayerMessageConfig = {
  message?: string
  type?: IMessageType
  showClose?: boolean
  time?: number
  title?: string
  icon?: string
}
export type ILgsLayerPopoverConfig = {
  content?: string
  position?: IFollowPosition
  follow: IFollowTarget
  autoFit?: boolean
  title?: string
  showClose?:boolean
  shadeClose?:boolean
}
