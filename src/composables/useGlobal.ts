
import { ComponentInternalInstance } from 'vue'
const useGlobal = (ins?:ComponentInternalInstance|null) => {
  // 全局地图
  const $view = ins ? ins.appContext.config.globalProperties.$view : {}
  const $setView = (viewIns:any) => {
    ins && (ins.appContext.config.globalProperties.$view = viewIns)
  }
  const $layer = ins ? ins.appContext.config.globalProperties.$layer : {}
  return {
    $view,
    $setView,
    $layer
  }
}
export default useGlobal
