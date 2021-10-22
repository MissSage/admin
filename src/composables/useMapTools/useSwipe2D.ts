import useGlobal from '../useGlobal'
import Swipe from '@arcgis/core/widgets/Swipe'
import { ElMessage } from 'element-plus'
import { ComponentInternalInstance } from 'vue'

const useSwipe2D = (ins: ComponentInternalInstance|null) => {
  let swipe: Swipe|undefined
  // 卷帘分析
  const initSwipe2D = async () => {
    const { $view } = useGlobal(ins)
    const map = $view.map
    const view = $view
    const topLayer = map.findLayerById('swipeLayerTop')
    const bottomLayer = map.findLayerById('swipeLayerBottom')
    if (topLayer && bottomLayer) {
      swipe = new Swipe({
        leadingLayers: [topLayer],
        trailingLayers: [bottomLayer],
        position: 35,
        view: view
      })

      $view.ui.add(swipe)
    } else {
      ElMessage.warning('请添加至少两张业务图层')
    }
  }
  const clearSwipe2D = () => {
    swipe && swipe.destroy()
  }
  return {
    initSwipe2D,
    clearSwipe2D
  }
}
export default useSwipe2D
