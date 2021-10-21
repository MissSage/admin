import useGlobal from '../useGlobal'
import useDistanceMeasurement2D from './useDistanceMeasurement2D'
import useAreaMeasurement2D from './useAreaMeasurement2D'
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import useDIYMeasurement2D from './useDIYMeasurement2D'
import useSpaceQuery2D from './useSpaceQuery2D'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import useSwipe2D from './useSwipe2D'
import usePrintMap2D from './usePrintMap2D'
import useMapPopup2D from './useMapPopup'
const { Global } = useGlobal()
let measurementWidget: DistanceMeasurement2D | AreaMeasurement2D | undefined
let sketchViewModelGlobal: SketchViewModel | undefined
/**
 * 地图工具方法汇总
 * @param measurementWidget 已实例化测量工具
 * @returns 返回实例化工具的方法
 */
const useMapTools2D = () => {
  // 地图距离量算
  const { initDistanceMap2D } = useDistanceMeasurement2D(measurementWidget as DistanceMeasurement2D)
  // 面积量算
  const { initAreaMap2D } = useAreaMeasurement2D(measurementWidget as AreaMeasurement2D)
  const { initDIYMeasurement2D, clearDIYMeasurement2D } = useDIYMeasurement2D()
  const { initSpaceQuery2D } = useSpaceQuery2D(sketchViewModelGlobal)
  const { initSwipe2D, clearSwipe2D } = useSwipe2D()
  const { handlePrintMap2D } = usePrintMap2D()
  const { openMapPopup2D } = useMapPopup2D()
  const handleClearMap2D = () => {
    const view = Global.$view
    const resultLayer1 = view.map.findLayerById('swipeLayerTop')
    const resultLayer2 = view.map.findLayerById('swipeLayerBottom')
    const resultLayer3 = view.map.findLayerById('layerid')
    const resultLayer4 = view.map.findLayerById('measurementGraphicLayer')
    if (resultLayer1) view.map.remove(resultLayer1)
    if (resultLayer2) view.map.remove(resultLayer2)
    if (resultLayer3) view.map.remove(resultLayer3)
    if (resultLayer4) view.map.remove(resultLayer4)
    clearSwipe2D()
    clearDIYMeasurement2D()
    measurementWidget && measurementWidget.destroy()
    sketchViewModelGlobal && sketchViewModelGlobal.destroy()
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
