import { IMenu, IUserInfo } from '@/api/types/common'
import { State } from '@/types/Store'
import { MENU, USER } from '@/utils/constans'
import { getItem } from '@/utils/storage'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { getters } from './getters'
import { mutations } from './mutations'
export const state:State = {
  isCollapse: false,
  user: getItem<{ token: string } & IUserInfo>(USER),
  menus: getItem<IMenu>(MENU) || [] as IMenu[],
  theme: true
}
// export type State = typeof state
export const key:InjectionKey<Store<State>> = Symbol('store')
export const store = createStore<State>({
  strict: true,
  state,
  getters,
  mutations
})
// 封装简化后的useStore方法
export function useStore () {
  // 这里把key传进去
  return baseUseStore(key)
}
