import { State } from '@/types/Store'
import MapView from '@arcgis/core/views/MapView'
export const getters = {
  _getDefaultMapView: (state:State):MapView |null => {
    return state._defaultMapView
  },
  _getDefaultSceneView: (state:State) => {
    return state._defaultSceneView
  },
  _getDefaultXZQHVisible: (state:State) => {
    return state._defaultXZQHVisible
  },
  _getDefaultMapTreeVisible: (state:State) => {
    return state._defaultMapTreeVisible
  },
  _getDefaultQueryResultVisible: (state:State) => {
    return state._defaultQueryResultVisible
  },
  _getDefaultQueryResult: (state:State) => {
    return state._defaultQueryResult
  }
}
