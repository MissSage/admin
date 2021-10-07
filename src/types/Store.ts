import { IMenu, IUserInfo } from '@/api/types/common'

export interface State{
  isCollapse: boolean,
  user: ({
    token: string;
} & IUserInfo) | null,
  menus:IMenu | IMenu[],
  _defaultMapView: any, // 默认地图view
  _defaultXZQHVisible: boolean, // 行政区划面板显示/隐藏
  _defaultMapTreeVisible: boolean, // 地图目录树显示/隐藏
  _defaultQueryResultVisible: boolean, // 空间查询结果面板
  _defaultQueryResult: any[] // 空间查询结果
}
