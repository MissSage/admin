import { IMenu, IUserInfo } from '@/api/types/common'

import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
export interface State{
  isCollapse: boolean,
  user: ({
    token: string;
} & IUserInfo) | null,
  menus:IMenu | IMenu[],
  _viewMode:'2D'|'3D',
  _defaultMapView: MapView|null, // 默认地图view
  _defaultSceneView: SceneView|null, // 默认球view
  _defaultXZQHVisible: boolean, // 行政区划面板显示/隐藏
  _defaultMapTreeVisible: boolean, // 地图目录树显示/隐藏
  _defaultQueryResultVisible: boolean, // 空间查询结果面板
  _defaultQueryResult: any[] // 空间查询结果
}
