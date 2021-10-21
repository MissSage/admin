import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import Layer from '@arcgis/core/layers/Layer'
import useGlobal from '../useGlobal'
import { ComponentInternalInstance } from 'vue'

const useLayerControl = (ins:ComponentInternalInstance|null) => {
  const handleNodeClick = async (data: any) => {
    const { $map } = useGlobal(ins)
    if (data.layerurl) {
      // 删除已添加的图层
      // const view = store.getters._getDefaultMapView as MapView
      const resultLayer = $map.findLayerById('layerid')
      if (resultLayer) $map.remove(resultLayer)

      // 处理不同服务类型
      const c = data.layerurl.split('/')
      const serverType = c[c.length - 1]
      let layer:FeatureLayer|TileLayer|null
      switch (serverType) {
        case 'MapServer':
          layer = new TileLayer({ url: data.layerurl, id: data.layerid })
          break
        case 'FeatureServer':
          layer = new FeatureLayer({ url: data.layerurl, id: data.layerid })
          break
        default:
          layer = null
          break
      }
      $map.add(layer as Layer)
    }
  }
  return {
    handleNodeClick
  }
}
export default useLayerControl
