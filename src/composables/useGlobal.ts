
import { ComponentInternalInstance } from 'vue'
const useGlobal = (ins?:ComponentInternalInstance|null) => {
  // 全局地图
  const $view = ins ? ins.appContext.config.globalProperties.$view : {}
  const $setView = (viewIns:any) => {
    ins && (ins.appContext.config.globalProperties.$view = viewIns)
  }
  return {
    $view,
    $setView
  }
}
export default useGlobal
