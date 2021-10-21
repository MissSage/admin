import useGlobal from '../useGlobal'
import Swipe from '@arcgis/core/widgets/Swipe'
import { ElMessage } from 'element-plus'

const { Global } = useGlobal()
const useSwipe2D = () => {
  let swipe: Swipe|undefined
  // 卷帘分析
  const initSwipe2D = async () => {
    const view = Global.$view
    const topLayer = view.map.findLayerById('swipeLayerTop')
    const bottomLayer = view.map.findLayerById('swipeLayerBottom')
    if (topLayer && bottomLayer) {
      swipe = new Swipe({
        leadingLayers: [topLayer],
        trailingLayers: [bottomLayer],
        position: 35,
        view: view
      })

      view.ui.add(swipe)
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
