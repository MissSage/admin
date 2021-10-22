import useGlobal from '../useGlobal'
import useDistanceMeasurement2D from './useDistanceMeasurement2D'
import useAreaMeasurement2D from './useAreaMeasurement2D'
import useDIYMeasurement2D from './useDIYMeasurement2D'
import useSpaceQuery2D from './useSpaceQuery2D'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import useSwipe2D from './useSwipe2D'
import usePrintMap2D from './usePrintMap2D'
import useMapPopup2D from './useMapPopup'
import { ComponentInternalInstance } from 'vue'
let sketchViewModelGlobal: SketchViewModel | undefined
/**
 * 地图工具方法汇总
 * @param measurementWidget 已实例化测量工具
 * @returns 返回实例化工具的方法
 */
const useMapTools2D = (ins:ComponentInternalInstance|null) => {
  // 地图距离量算
  const { initDistanceMap2D, clearDistanceMap2D } = useDistanceMeasurement2D(ins)

  const { initAreaMap2D, clearAreaMap2D } = useAreaMeasurement2D(ins)
  const { initDIYMeasurement2D, clearDIYMeasurement2D } = useDIYMeasurement2D(ins)
  const { initSpaceQuery2D } = useSpaceQuery2D(ins, sketchViewModelGlobal)
  const { initSwipe2D, clearSwipe2D } = useSwipe2D(ins)
  const { handlePrintMap2D } = usePrintMap2D(ins)
  const { openMapPopup2D } = useMapPopup2D(ins)
  const handleClearMap2D = () => {
    const { $view } = useGlobal(ins)
    const $map = $view.map
    const resultLayer1 = $map.findLayerById('swipeLayerTop')
    const resultLayer2 = $map.findLayerById('swipeLayerBottom')
    const resultLayer3 = $map.findLayerById('layerid')
    const resultLayer4 = $map.findLayerById('measurementGraphicLayer')
    if (resultLayer1) $map.remove(resultLayer1)
    if (resultLayer2) $map.remove(resultLayer2)
    if (resultLayer3) $map.remove(resultLayer3)
    if (resultLayer4) $map.remove(resultLayer4)
    clearSwipe2D()
    clearDistanceMap2D()
    clearAreaMap2D()
    clearDIYMeasurement2D()
  }
  return {
    initDistanceMap2D, // 测量距离
    initAreaMap2D, // 测量面积
    initDIYMeasurement2D, // 自定义测量
    initSpaceQuery2D, // 初始化空间查询
    initSwipe2D, // 初始化卷帘
    handlePrintMap2D, // 初始化地图打印
    openMapPopup2D, // 初始化地图弹窗
    handleClearMap2D // 清空地图
  }
}
export default useMapTools2D
