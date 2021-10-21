
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import useGlobal from '../useGlobal'
const { Global } = useGlobal()
const useDistanceMeasurement2D = (measurementWidget:DistanceMeasurement2D|undefined) => {
  // 地图距离量算
  const initDistanceMap2D = async () => {
    if (measurementWidget) {
      measurementWidget.destroy()
    }
    measurementWidget = new DistanceMeasurement2D({
      view: Global.$view
    })
    Global.$view.ui.add(measurementWidget, 'top-left')
  }
  const clearDistanceMap2D = () => {
    measurementWidget && measurementWidget.destroy()
  }
  return {
    initDistanceMap2D,
    clearDistanceMap2D
  }
}

export default useDistanceMeasurement2D
