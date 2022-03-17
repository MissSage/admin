import { State, IStore_Module_APP, IStore_Root } from '@/common/types/Store'
import { Module } from 'vuex'

const app:Module<IStore_Module_APP, IStore_Root> = {
  namespaced: true,
  state: {
    actionUrl: String(import.meta.env.VITE_API_BASEURL),
    scadaUrl: String(import.meta.env.VITE_API_SCADAURL),
    logo: ''
  },
  mutations: {
    TOGGLE_LOGO: (state, logo) => {
      state.logo = logo
    }
  }

}

export default app
