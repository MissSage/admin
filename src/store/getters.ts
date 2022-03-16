import { IStore_Root } from '@/common/types/Store'

export const getters = {
  _getTheme: (state:IStore_Root) => {
    return state.theme ? 'dark' : 'primary'
  }
}
