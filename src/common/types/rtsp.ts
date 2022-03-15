export interface IChannelModel {
  chanId: string
  url: string
  debug: string
  status: number
  on_demand:string
}
export interface IVideoModel {
  projectId:string|null
  uuid: string
  name: string
  channels: IChannelModel[]
}
export interface INegotiatModel {
  data: string
  url: string
}
