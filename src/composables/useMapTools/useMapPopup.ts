
import { ElMessage } from 'element-plus'
import { ComponentInternalInstance } from 'vue'
import useGlobal from '../useGlobal'

const useMapPopup2D = (ins: ComponentInternalInstance|null) => {
  // 开启图层弹窗
  const openMapPopup2D = () => {
    const { $view } = useGlobal(ins)
    const resultLayer = $view.map.findLayerById('layerid')
    if (resultLayer) {
    // Get the screen point from the view's click event
      $view.on('click', function (event:MouseEvent) {
        $view.hitTest(event).then(function (response:any) {
          if (response.results.length) {
            const graphic = response.results.filter(function (result:any) {
              return result.graphic.layer.id === 'layerid'
            })[0].graphic

            console.log(graphic.attributes)
          }
        })
      })
    } else {
      ElMessage.warning('请添加业务图层')
    }
  }
  return {
    openMapPopup2D
  }
}

export default useMapPopup2D
