import { State } from '@/types/Store'
export const mutations = {
  setIsCollapse: (state:State, payload:boolean) => {
    state.isCollapse = payload
  },

  changeTheme: (state:State) => {
    state.theme = !state.theme
  },
  SET_ROLES: (state:State, payload:string[]) => {
    state.roles = payload
  }
}
