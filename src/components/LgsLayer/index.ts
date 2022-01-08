declare class LgsLayerHelper {
}
export interface OpLayerOptions{
  id:string
  layer:any
  type:string
  shade:boolean
  content:any
  cancel:()=>Promise<void>
}
interface TipPositionOptions{
  type:1|2|3|4
  options:string
}
export interface LgsLayerDefOptions {
  id?:string
  layer?:any
  instances?:any
  instancesVue?:any
  iframeMinList?:any
  Open?:(option:OpLayerOptions)=>{}
  type?: 0|1|2|3|4|5|6 // 0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层）5msg，6prompt
  title?: string
  content?: any
  area?: 'auto' | [string, string]
  offset?: 'auto' | [number?, number?, number?]
  icon?: any
  btn?: string
  time?: number
  maxmin?: boolean // 最大最小化
  shade?: boolean
  yes?: any
  cancel?: any
  tips?: TipPositionOptions // 支持上右下左四个方向，通过1-4进行方向设定可以设定tips: [1 '#c00']
  tipsMore?: boolean // 是否允许多个tips
  shadeClose?: boolean
  scrollbar?: boolean // 是否允许浏览器出现滚动条:默认是允许
  resize?: boolean // 是否允许拉伸，默认是不允许
}

// eslint-disable-next-line no-unused-vars
export declare class Layer extends LgsLayerHelper {
  constructor(Vue:any, globalOption?:any)
  NotificationConstructor:any
  maskLayer:any
  defOptions:LgsLayerDefOptions
}
