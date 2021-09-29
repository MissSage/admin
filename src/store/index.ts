import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

export interface State {
    count: number
    foo: string
}
export const key:InjectionKey<Store<State>> = Symbol('store')
export const store = createStore<State>({
  state () {
    return {
      count: 0,
      foo: 'hello'
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
// 封装简化后的useStore方法
export function useStore () {
  // 这里把key传进去
  return baseUseStore(key)
}
