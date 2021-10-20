import { IMenu, IUserInfo } from '@/api/types/common'
import { State } from '@/types/Store'
import { MENU, USER } from '@/utils/constans'
import { setItem } from '@/utils/storage'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
export const mutations = {
  setIsCollapse: (state:State, payload:boolean) => {
    state.isCollapse = payload
  },
  setUser: (state:State, payload: ({ token: string } & IUserInfo) | null) => {
    state.user = payload
    setItem(USER, state.user)
    // window.localStorage.setItem('user', JSON.stringify(state.user))
  },
  setMenus: (state:State, payload: IMenu | IMenu[]) => {
    state.menus = payload
    setItem(MENU, state.menus)
  },
  _setViewMode: (state: State, payload: '2D'|'3D') => {
    state._viewMode = payload
  },
  _setDefaultMapView: (state:State, payload: MapView) => {
    state._defaultMapView = payload as MapView
    state._defaultSceneView = null
  },
  _setDefaultSceneView: (state:State, payload: SceneView) => {
    state._defaultSceneView = payload as SceneView
    state._defaultMapView = null
  },
  _setDefaultXZQHVisible: (state:State, payload: boolean) => {
    state._defaultXZQHVisible = payload
  },
  _setDefaultMapTreeVisible: (state:State, payload: boolean) => {
    state._defaultMapTreeVisible = payload
  },
  _setDefaultQueryResultVisible: (state:State, payload: boolean) => {
    state._defaultQueryResultVisible = payload
  },
  _setDefaultQueryResult: (state:State, payload: any[]) => {
    state._defaultQueryResult = payload
  }
}
