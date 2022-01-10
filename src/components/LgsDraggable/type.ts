export interface DraggableOptions {
  type?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  content?: any
  offsetX?: number
  offsetY?: number
  width?: number,
  height?: number
  title?: string
  maxmin?: boolean
  resize?: boolean
  icon?: any
  btn?: string
  time?: number
  yes?: string
  cancel?: string
  tips?: any
  tipsMore?: boolean
  shade?: any
  shadeClose?: boolean
  scrollbar?: boolean
  dragOut?: boolean
  theme?: string
}

export interface ILayerInsArr {
  id: string
  layer: any
}
export type IPosition = 't' | 'r' | 'b' | 'l' | 'lt' | 'lb' | 'rt' | 'rb' | [number, number]
export type IXPosition = 'left' | 'right' | 'top' | 'bottom'
export type ILType = 'message' | 'notify' | 'popover' | 'toast' | 'footer' | 'actionsheet' | 'actionsheetPicker' | 'android' | 'ios' | 'contextmenu' | 'drawer' | 'iframe'
export type IFollowTarget = string | [number, number]
export type IRectInfo = [number, number, number, number, string]
export type IBtn = {
  text: string
  disabled?: boolean
  click?: (...args: any[]) => Promise<void>
  style?: string
}
export type IAnims = 'scaleIn' | 'fadeIn' | 'footer' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
export type IToastIcon = Record<string, string>

export interface ILgsLayerConfigs {
  title: string
  onSuccess: (...args: any[]) => Promise<void>
  onEnd: (...args: any[]) => Promise<void>
  teleport: string
  time: number | undefined
  fullscreen: boolean
  position: IPosition
  fixed: boolean
  follow: IFollowTarget | undefined
  maximize: boolean
  shade: boolean
  shadeClose: boolean
  btns: IBtn[]
  opacity: number
  id: string
  anim: IAnims
  type: ILType
  layerStyle: string
  icon: string
  content: string
  resize: boolean
  xclose: boolean
  xposition: IXPosition
  xcolor: string
  theme: string
}
export type ILgsLayerConfigsPartial = ILgsLayerConfigs & { type: ILType }
export type ILgsLayerProps = {
  modelValue:string
  config:ILgsLayerConfigs
}
