import { State } from '.'
export const getters = {
  _getDefaultMapView: (state:State) => {
    return state._defaultMapView
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
