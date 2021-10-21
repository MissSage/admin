
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import { ComponentInternalInstance } from 'vue'
import useGlobal from '../useGlobal'
const useDistanceMeasurement2D = (ins: ComponentInternalInstance|null) => {
  const measurementWidgets:DistanceMeasurement2D[] = []
  let measurementWidget: DistanceMeasurement2D|undefined
  // 地图距离量算
  const initDistanceMap2D = async () => {
    const { $view, $ui } = useGlobal(ins)
    if (measurementWidget) {
      measurementWidget.destroy()
    }
    measurementWidget = new DistanceMeasurement2D({
      view: $view
    })
    $ui.add(measurementWidget, 'top-left')
    measurementWidgets.push(measurementWidget)
  }
  const clearDistanceMap2D = () => {
    const { $ui } = useGlobal(ins)
    $ui.remove(measurementWidgets)
    measurementWidgets.map(item => item.destroy())
  }
  return {
    initDistanceMap2D,
    clearDistanceMap2D
  }
}

export default useDistanceMeasurement2D
