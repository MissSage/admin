
import { store } from '@/store'
import { GeoData } from '@/types/Map'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { SimpleRenderer } from '@arcgis/core/renderers'
import Collection from '@arcgis/core/core/Collection'
import { PictureMarkerSymbol } from '@arcgis/core/symbols'
import { ElMessage } from 'element-plus'
import useGlobal from '../useGlobal'
import { ComponentInternalInstance } from 'vue'

let geoData:GeoData[] = []
const useSpaceQuery2D = (ins: ComponentInternalInstance|null, sketchViewModelGlobal:SketchViewModel|undefined) => {
  /**
   * 初始化绘制工具
   */
  const _initSketchTool = async () => {
    // 1、绘制面状区域
    const graphicsLayer = new GraphicsLayer({
      id: 'polygonGraphicLayer',
      elevationInfo: {
        mode: 'on-the-ground'
      }
    })
    const { $view } = useGlobal(ins)
    $view.map.add(graphicsLayer)

    return new SketchViewModel({
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
  }

  // 处理经纬度数据，返回features
  const _translateLonLat = (data:any) => {
    if (data.length > 0) {
      geoData = []
      data.map((value:any, key:any) => {
        return geoData.push({
          geometry: {
            type: 'point',
            x: Number(value.attributes.lon),
            y: Number(value.attributes.lat)
          },
          attributes: {
            ObjectID: key + 1,
            name: value.attributes.name,
            type: value.attributes.type,
            tieluju: value.attributes.tieluju,
            address: value.attributes.address
          }
        })
      })
    }

    return geoData
  }
  const renderResultLayer = async (resultFeatures:any) => {
    const { $view } = useGlobal(ins)
    const resultLayer = $view.map.findLayerById('initResultLayer')
    if (resultLayer) $view.map.remove(resultLayer)

    const resultData = _translateLonLat(resultFeatures)
    // 实例化弹窗
    const template = {
      title: '{name}-{tieluju}',
      content: [
        {
          type: 'fields',
          fieldInfos: [
            {
              fieldName: 'name',
              label: '名称'
            },
            {
              fieldName: 'type',
              label: '类型'
            },
            {
              fieldName: 'tieluju',
              label: '铁路局'
            },
            {
              fieldName: 'address',
              label: '地址'
            }
          ]
        }
      ]
    }
    const queryResultLayer = new FeatureLayer({
      source: new Collection<Graphic>({
        ...resultData
      }),
      id: 'initResultLayer',
      objectIdField: 'ObjectID',
      renderer: new SimpleRenderer({
      // type: 's', // autocasts as new SimpleRenderer()
        symbol: new PictureMarkerSymbol({
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: 'static/icon/train.png',
          width: '32px',
          height: '32px'
        })
      }),
      fields: [
        {
          name: 'OBJECTID',
          type: 'oid'
        },
        {
          name: 'name',
          type: 'string'
        },
        {
          name: 'type',
          type: 'string'
        },
        {
          name: 'tieluju',
          type: 'string'
        },
        {
          name: 'address',
          type: 'string'
        }
      ],
      popupTemplate: template
    })
    $view.map.add(queryResultLayer)
  }
  /**
   * 查询方法
   * @param graphic
   * @returns
   */
  const handleSpaceQuery = (graphic:any) => {
    const { $view } = useGlobal(ins)
    const resultLayer = $view.map.findLayerById('layerid')
    if (!resultLayer) {
      ElMessage.warning('尚未添加业务图层，不能进行空间查询')
      return
    }

    const queryPoint = resultLayer.createQuery()
    queryPoint.geometry = graphic.geometry
    resultLayer
      .queryFeatures(queryPoint)
      .then(function (results:any) {
        const currentData:any[] = []
        if (results.features.length > 0) {
        // 符号化渲染图层
          renderResultLayer(results.features)
          // 实例化表格数据
          results.features.map((item:any, index:number) => {
            return currentData.push({
              name: item.attributes.name,
              type: item.attributes.type,
              tieluju: item.attributes.tieluju,
              address: item.attributes.address,
              lon: item.attributes.lon,
              lat: item.attributes.lat,
              key: index
            })
          })
        } else {
          currentData.length = 0
        }
        ElMessage.success(`查询成功，共查到 ${results.features.length} 条数据`)

        store.commit('_setDefaultQueryResult', currentData)
        store.commit('_setDefaultQueryResultVisible', true)
      })
      .catch(function (error:Error) {
        console.log(error)
        ElMessage.error('空间查询失败，请联系管理员')
      })
  }
  /**
   * 初始化空间查询
   */
  const initSpaceQuery2D = async () => {
    if (!sketchViewModelGlobal) {
      sketchViewModelGlobal = await _initSketchTool()
    }
    const { $view } = useGlobal(ins)
    const resultLayer = $view.map.findLayerById('polygonGraphicLayer')
    if (resultLayer) $view.map.remove(resultLayer)

    const graphicsLayer = new GraphicsLayer({
      id: 'polygonGraphicLayer',
      elevationInfo: {
        mode: 'on-the-ground'
      }
    })
    $view.map.add(graphicsLayer)

    sketchViewModelGlobal.create('polygon')
    sketchViewModelGlobal.on('create', function (event:any) {
      const graphic = new Graphic({
        geometry: event.geometry,
        symbol: sketchViewModelGlobal?.polygonSymbol
      })
      graphicsLayer.add(graphic)
      if (event.state === 'complete') {
      // console.log(graphicsLayer);
      // console.log(event);
      // 2、执行空间查询
        handleSpaceQuery(event.graphic)
      }
    })
  }
  return {
    initSpaceQuery2D
  }
}

export default useSpaceQuery2D
