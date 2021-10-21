
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import Graphic from '@arcgis/core/Graphic'
import GeometryService from '@arcgis/core/tasks/GeometryService'
import LengthsParameters from '@arcgis/core/rest/support/LengthsParameters'
import AreasAndLengthsParameters from '@arcgis/core/rest/support/AreasAndLengthsParameters'
import { GeometryServer } from '@/utils/constans'
import useGlobal from '../useGlobal'
import { ComponentInternalInstance } from 'vue'
const useDIYMeasurement2D = (ins: ComponentInternalInstance|null) => {
  let sketchViewModelDiy:SketchViewModel|undefined
  /**
   * 自定义测量
   * @param type 'distance'|'area'
   */
  const initDIYMeasurement2D = async (type:'distance'|'area') => {
    const { $map, $view } = useGlobal(ins)
    const resultLayer = $map.findLayerById('measurementGraphicLayer')
    if (resultLayer) $map.remove(resultLayer)
    const graphicsLayer = new GraphicsLayer({
      id: 'measurementGraphicLayer',
      elevationInfo: {
        mode: 'on-the-ground'
      }
    })
    $map.add(graphicsLayer)

    if (type === 'distance') {
      sketchViewModelDiy = new SketchViewModel({
        updateOnGraphicClick: false,
        view: $view,
        layer: graphicsLayer,
        polylineSymbol: {
          type: 'simple-line',
          color: '#d81e06',
          width: '2',
          style: 'solid'
        }
      })
      sketchViewModelDiy.create('polyline')
      sketchViewModelDiy.on('create', function (event:any) {
        const graphic = new Graphic({
          geometry: event.geometry,
          symbol: sketchViewModelDiy?.polylineSymbol
        })
        graphicsLayer.add(graphic)

        if (event.state === 'complete') {
          console.log(graphicsLayer)
          console.log(event)

          // 获取线段长度
          const geometryService = new GeometryService({
            url: GeometryServer
          })

          const lengthsParameters = new LengthsParameters()
          lengthsParameters.polylines = event.graphic.geometry
          lengthsParameters.lengthUnit = 9036
          lengthsParameters.geodesic = true

          geometryService.lengths(lengthsParameters).then(function (result:any) {
            console.log('长度', result)
          })
        }
      })
    } else if (type === 'area') {
      sketchViewModelDiy = new SketchViewModel({
        updateOnGraphicClick: false,
        view: $view,
        layer: graphicsLayer,
        polygonSymbol: {
          type: 'simple-fill',
          color: 'rgba(216,30,6, 0.4)',
          style: 'solid',
          outline: {
            color: '#d81e06',
            width: 1
          }
        }
      })
      sketchViewModelDiy.create('polygon')

      sketchViewModelDiy.on('create', function (event:any) {
        const graphic = new Graphic({
          geometry: event.geometry,
          symbol: sketchViewModelDiy?.polygonSymbol
        })
        graphicsLayer.add(graphic)
        if (event.state === 'complete') {
          console.log(graphicsLayer)
          console.log(event)

          // 获取周长和面积
          const geometryService = new GeometryService({
            url: GeometryServer
          })

          const areasAndLengthsParameters = new AreasAndLengthsParameters()
          areasAndLengthsParameters.polygons = event.graphic.geometry
          areasAndLengthsParameters.areaUnit = 'square-kilometers'
          areasAndLengthsParameters.lengthUnit = 'kilometers'

          geometryService.areasAndLengths(areasAndLengthsParameters).then(function (result:any) {
            console.log('周长和面积', result)
          })
        }
      })
    }
  }
  const clearDIYMeasurement2D = () => {
    sketchViewModelDiy && sketchViewModelDiy.destroy()
  }
  return {
    initDIYMeasurement2D,
    clearDIYMeasurement2D
  }
}

export default useDIYMeasurement2D
