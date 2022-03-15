
export interface IMenu {
  path: string
  title: string
  icon: string
  iconLight: String
  header: string
  is_header: number
  children?: IMenu[]
}
