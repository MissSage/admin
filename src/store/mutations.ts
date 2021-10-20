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
  _setDefaultMapView: (state:State, payload: {viewMode:'2D', View:MapView}) => {
    if (payload.viewMode === '2D') {
      state._defaultMapView = payload.View || null
      state._defaultSceneView = null
      state._viewMode = '2D'
    } else {
      console.log(`2D模式不不能保存不能保存${payload.viewMode}的内容`)
    }
  },
  _setDefaultSceneView: (state:State, payload: {viewMode:'2D'|'3D', View:SceneView}) => {
    if (payload.viewMode === '2D') {
      state._defaultSceneView = payload.View as SceneView|null
      state._defaultMapView = null
      state._viewMode = '3D'
    } else {
      console.log(`3D模式不不能保存不能保存${payload.viewMode}的内容`)
    }
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
