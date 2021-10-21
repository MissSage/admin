
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import { ComponentInternalInstance } from 'vue'
import useGlobal from '../useGlobal'
const useDistanceMeasurement2D = (ins:ComponentInternalInstance|null) => {
  const measurementWidgets:AreaMeasurement2D[] = []
  let measurementWidget: AreaMeasurement2D|undefined
  /**
   * 地图面积量算
   */
  const initAreaMap2D = async () => {
    const { $view, $ui } = useGlobal(ins)
    if (measurementWidget) {
      measurementWidget.destroy()
    }
    measurementWidget = new AreaMeasurement2D({
      view: $view
    })
    $ui.add(measurementWidget, 'top-left')
    measurementWidgets.push(measurementWidget)
  }
  const clearAreaMap2D = () => {
    const { $ui } = useGlobal(ins)
    $ui.remove(measurementWidgets)
    measurementWidgets.map(item => item.destroy())
  }
  return {
    clearAreaMap2D,
    initAreaMap2D
  }
}

export default useDistanceMeasurement2D
