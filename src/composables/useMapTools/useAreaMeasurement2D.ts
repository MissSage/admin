
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import useGlobal from '../useGlobal'
const { Global } = useGlobal()
const useDistanceMeasurement2D = (measurementWidget:AreaMeasurement2D|undefined) => {
  /**
   * 地图面积量算
   */
  const initAreaMap2D = async () => {
    if (measurementWidget) {
      measurementWidget.destroy()
    }
    measurementWidget = new AreaMeasurement2D({
      view: Global.$view
    })
    Global.$view.ui.add(measurementWidget, 'top-left')
  }
  const clearAreaMap2D = () => {
    measurementWidget && measurementWidget.destroy()
  }
  return {
    clearAreaMap2D,
    initAreaMap2D
  }
}

export default useDistanceMeasurement2D
