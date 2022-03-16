
import { IStore_Root, State } from '@/common/types/Store'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { getters } from './getters'
import { mutations } from './mutations'
import app from './modules/app'
export const state:IStore_Root = {
  isCollapse: false,
  theme: 'dark',
  roles: []
}
// export type State = typeof state
export const key:InjectionKey<Store<IStore_Root>> = Symbol('store')
export const store = createStore<IStore_Root>({
  strict: true,
  state,
  getters,
  mutations,
  modules: {
    app
  }
})
// 封装简化后的useStore方法
export function useStore<T=State> () {
  // 这里把key传进去
  return baseUseStore<T>(key)
}
