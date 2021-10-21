
import { ComponentInternalInstance } from 'vue'
const useGlobal = (ins?:ComponentInternalInstance|null) => {
  const $map = ins ? ins.appContext.config.globalProperties.$map : {}
  const $ui = ins ? ins.appContext.config.globalProperties.$ui : {}
  const $view = ins ? ins.appContext.config.globalProperties.$view : {}
  const $setMap = (mapIns:any) => {
    ins && (ins.appContext.config.globalProperties.$map = mapIns)
  }
  const $setView = (viewIns:any) => {
    ins && (ins.appContext.config.globalProperties.$view = viewIns)
  }
  const $setUI = (uiIns:any) => {
    ins && (ins.appContext.config.globalProperties.$ui = uiIns)
  }
  return {
    $map,
    $ui,
    $view,
    $setMap,
    $setView,
    $setUI
  }
}
export default useGlobal
