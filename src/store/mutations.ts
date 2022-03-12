import { IMenu, IUserInfo } from '@/api/types/common'
import { State } from '@/types/Store'
import { MENU, USER } from '@/utils/constans'
import { setItem } from '@/utils/storage'
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
  }
}
