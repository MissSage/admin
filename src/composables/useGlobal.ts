import { getCurrentInstance } from 'vue'
const useGlobal = () => {
  const ins = getCurrentInstance()
  const Global = ins ? ins.appContext.config.globalProperties : {}
  return {
    Global
  }
}
export default useGlobal
