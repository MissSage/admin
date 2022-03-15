
import { State } from '@/common/types/Store'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { getters } from './getters'
import { mutations } from './mutations'
export const state:State = {
  isCollapse: false,
  theme: true,
  roles: []
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
