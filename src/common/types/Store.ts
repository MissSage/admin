
export interface IStore_Root{
  isCollapse: boolean
  theme:'dark' | 'primary'
  roles:string[]
}
export interface IStore_Module_APP{
  actionUrl:string
  scadaUrl:string
  logo:string
}
export interface State extends IStore_Root{
  app:IStore_Module_APP
}
