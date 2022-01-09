export interface DraggableOptions{
  type?: 0 |1 |2 | 3 |4 |5 |6
  content?:any
  offsetX?:number
  offsetY?:number
  width?:number,
  height?:number
  title?:string
  maxmin?:boolean
  resize?:boolean
  icon?:any
  btn?:string
  time?:number
  yes?:string
  cancel?:string
  tips?:any
  tipsMore?:boolean
  shade?:any
  shadeClose?:boolean
  scrollbar?:boolean
  dragOut?:boolean
  theme?:string
}

export interface ILayerInsArr{
  id:string
  layer:any
}
export type IPosition = 't'|'r'|'b'|'l'|'lt'|'lb'|'rt'|'rb'| [number, number]
export type IFollowTarget = string | [number, number]
export type IRectInfo = [number, number, number, number, string]
export type IBtn = {
  text:string
  disabled?:boolean
  click?:(...args:any[])=>Promise<void>
  style?:string
}
export type IToastIcon = Record<string, string>
