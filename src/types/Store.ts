import { IMenu, IUserInfo } from '@/api/types/common'

export interface State{
  isCollapse: boolean,
  user: ({
    token: string;
} & IUserInfo) | null,
  menus:IMenu | IMenu[]
}
