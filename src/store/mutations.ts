import { IStore_Root } from '@/common/types/Store'

export const mutations = {
  setIsCollapse: (state:IStore_Root, payload:boolean) => {
    state.isCollapse = payload
  },

  changeTheme: (state:IStore_Root) => {
    state.theme = state.theme === 'primary' ? 'dark' : 'primary'
  },
  SET_ROLES: (state:IStore_Root, payload:string[]) => {
    state.roles = payload
  }
}
