export interface IProject {
  additionalInfo?: { address?: string; location?: Array<number>[] }
  children?: Array<any>[]
  createTime?: number
  gatewayList?: any
  id: string
  leaf?: boolean
  name: string
  nodeId?: string|null
  nodeType?: string
  parentId?: string
  tenantId?: string
  disabled?: boolean
}
// 额外的查询参数，这个可以随意添加配置，但是已有的不能删除
export interface ExtraQueryParam{
  name?:string
  code?:string
  deviceType?:number
  projectId?:string
  transferNo?:string
  handleNo?:string
  deviceId?:string
  limit?:number|string
  chooseIds?:[]
}

// 查询table的参数
export interface QueryListParam extends ExtraQueryParam {
  page: number|string
  size: number|string
}

// 上传文件对象
export interface FileItem {
  url: string
  name: string
}

export interface IMenu {
  path: string
  title: string
  icon: string
  iconLight: String
  header: string
  is_header: number
  children?: IMenu[]
}
export type NormalOption = {
  label: string
  value: any
  data?:any
  disabled?: boolean
  children?: NormalOption[]
}
