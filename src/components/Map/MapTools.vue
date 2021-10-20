<template>
  <div class="maptools-view">
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="xzqh"
    >行政区导航</span>
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="maptree"
    >目录树管理</span>
    <el-dropdown
      trigger="click"
      class="maptools-item"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right" /> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            icon="el-icon-plus"
            command="distance"
          >
            距离测量
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-circle-plus"
            command="area"
          >
            面积测量
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-edit"
            command="diymeasurement_distance"
          >
            自定义测量(长度)
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-edit"
            command="diymeasurement_area"
          >
            自定义测量(面积)
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown
      trigger="click"
      class="maptools-item"
      @command="handleCommand"
    >
      <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right" /> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            icon="el-icon-search"
            command="spacequery"
          >
            空间查询
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-film"
            command="morescreen"
          >
            多屏对比
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-reading"
            command="swipanalyst"
          >
            卷帘分析
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-picture-outline"
            command="printmap"
          >
            地图打印
          </el-dropdown-item>
          <el-dropdown-item
            icon="el-icon-view"
            command="openPopup"
          >
            开启图层弹窗
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span
      class="maptools-item"
      @click="handleMapToolsitemClick"
      id="clear"
    >清屏</span>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { GeoData } from '@/types/Map'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GeometryServer, PrintingServer } from '@/utils/constans'
import DistanceMeasurement2D from '@arcgis/core/widgets/DistanceMeasurement2D'
import AreaMeasurement2D from '@arcgis/core/widgets/AreaMeasurement2D'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import GeometryService from '@arcgis/core/tasks/GeometryService'
import LengthsParameters from '@arcgis/core/rest/support/LengthsParameters'
import AreasAndLengthsParameters from '@arcgis/core/rest/support/AreasAndLengthsParameters'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { SimpleRenderer } from '@arcgis/core/renderers'
import { PictureMarkerSymbol } from '@arcgis/core/symbols'
import Collection from '@arcgis/core/core/Collection'
import Swipe from '@arcgis/core/widgets/Swipe'
import PrintTask from '@arcgis/core/tasks/PrintTask'
import PrintTemplate from '@arcgis/core/rest/support/PrintTemplate'
import PrintParameters from '@arcgis/core/rest/support/PrintParameters'
// import config from './config'
const store = useStore()
const router = useRouter()

const geoData = ref<GeoData[]>([])
let measurementWidget:any = null
let sketchViewModelGlobal:any = null
let swipe:any = null
// 初始化绘制工具
const _initSketchTool = async () => {
  const view = store.getters._getDefaultMapView
  // 1、绘制面状区域
  const graphicsLayer = new GraphicsLayer({
    id: 'polygonGraphicLayer',
    elevationInfo: {
      mode: 'on-the-ground'
    }
  })
  view.map.add(graphicsLayer)

  sketchViewModelGlobal = new SketchViewModel({
    updateOnGraphicClick: false,
    view,
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
const handleMapToolsitemClick = (e:any) => {
  console.log(e)
  switch (e.target.id) {
    case 'xzqh':
      openXZQHPannel()
      break
    case 'maptree':
      openMapTreePannel()
      break
    case 'clear':
      handleClearMap()
      break
    default:
      break
  }
}
const handleCommand = (command:string) => {
  switch (command) {
    case 'distance':
      initDistanceMap()
      break
    case 'area':
      initAreaMap()
      break
    case 'diymeasurement_distance':
      initDIYMeasurement('distance')
      break
    case 'diymeasurement_area':
      initDIYMeasurement('area')
      break
    case 'spacequery':
      initSpaceQuery()
      break
    case 'morescreen':
      router.push('/onemap/one')
      break
    case 'swipanalyst':
      _initSwipe()
      break
    case 'printmap':
      handlePrintMap()
      break
    case 'openPopup':
      openMapPopup()
      break
    default:
      break
  }
}
const openXZQHPannel = () => {
  const currentVisible = store.getters._getDefaultXZQHVisible
  store.commit('_setDefaultXZQHVisible', !currentVisible)
}
const openMapTreePannel = () => {
  const currentVisible = store.getters._getDefaultMapTreeVisible
  store.commit('_setDefaultMapTreeVisible', !currentVisible)
}
// 地图距离量算
const initDistanceMap = async () => {
  const view = store.getters._getDefaultMapView
  if (measurementWidget) measurementWidget.destroy()
  measurementWidget = new DistanceMeasurement2D({
    view: view
  })
  view.ui.add(measurementWidget, 'top-left')
}
// 地图面积量算
const initAreaMap = async () => {
  const view = store.getters._getDefaultMapView
  if (measurementWidget) measurementWidget.destroy()
  measurementWidget = new AreaMeasurement2D({
    view
  })
  view.ui.add(measurementWidget, 'top-left')
}
// 自定义测量
const initDIYMeasurement = async (type:string) => {
  const view = store.getters._getDefaultMapView
  const resultLayer = view.map.findLayerById('measurementGraphicLayer')
  if (resultLayer) view.map.remove(resultLayer)
  const graphicsLayer = new GraphicsLayer({
    id: 'measurementGraphicLayer',
    elevationInfo: {
      mode: 'on-the-ground'
    }
  })
  view.map.add(graphicsLayer)

  if (type === 'distance') {
    const sketchViewModelDiy = new SketchViewModel({
      updateOnGraphicClick: false,
      view: view,
      layer: graphicsLayer,
      polylineSymbol: {
        type: 'simple-line',
        color: '#d81e06',
        width: '2',
        style: 'solid'
      }
    })
    sketchViewModelDiy.create('polyline')

    // sketchViewModelDiy.on('create-complete', function (event:any) {
    //   const graphic = new Graphic({
    //     geometry: event.geometry,
    //     symbol: sketchViewModelDiy.graphic.symbol
    //   })
    //   graphicsLayer.add(graphic)
    // })
    sketchViewModelDiy.on('create', function (event:any) {
      const graphic = new Graphic({
        geometry: event.geometry,
        symbol: sketchViewModelDiy.createGraphic.symbol
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
    const sketchViewModelArea = new SketchViewModel({
      updateOnGraphicClick: false,
      view: view,
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
    sketchViewModelArea.create('polygon')

    sketchViewModelArea.on('create', function (event:any) {
      const graphic = new Graphic({
        geometry: event.geometry,
        symbol: sketchViewModelArea.createGraphic.symbol
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
// 初始化空间查询
const initSpaceQuery = async () => {
  const view = store.getters._getDefaultMapView

  const resultLayer = view.map.findLayerById('polygonGraphicLayer')
  if (resultLayer) view.map.remove(resultLayer)

  const graphicsLayer = new GraphicsLayer({
    id: 'polygonGraphicLayer',
    elevationInfo: {
      mode: 'on-the-ground'
    }
  })
  view.map.add(graphicsLayer)

  sketchViewModelGlobal.create('polygon')

  sketchViewModelGlobal.on('create-complete', function (event:any) {
    const graphic = new Graphic({
      geometry: event.geometry,
      symbol: sketchViewModelGlobal.graphic.symbol
    })
    graphicsLayer.add(graphic)
  })
  sketchViewModelGlobal.on('create', function (event:any) {
    if (event.state === 'complete') {
      // console.log(graphicsLayer);
      // console.log(event);
      // 2、执行空间查询
      handleSpaceQuery(event.graphic)
    }
  })
}
const handleSpaceQuery = (graphic:any) => {
  const view = store.getters._getDefaultMapView

  const resultLayer = view.map.findLayerById('layerid')
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
const renderResultLayer = async (resultFeatures:any) => {
  const view = store.getters._getDefaultMapView

  const resultLayer = view.map.findLayerById('initResultLayer')
  if (resultLayer) view.map.remove(resultLayer)

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
  view.map.add(queryResultLayer)
}
// 处理经纬度数据，返回features
const _translateLonLat = (data:any) => {
  if (data.length > 0) {
    geoData.value = []
    data.map((value:any, key:any) => {
      return geoData.value.push({
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

  return geoData.value
}
// 卷帘分析
const _initSwipe = async () => {
  const view = store.getters._getDefaultMapView
  const topLayer = view.map.findLayerById('swipeLayerTop')
  const bottomLayer = view.map.findLayerById('swipeLayerBottom')
  if (topLayer && bottomLayer) {
    swipe = new Swipe({
      leadingLayers: [topLayer],
      trailingLayers: [bottomLayer],
      position: 35,
      view: view
    })

    view.ui.add(swipe)
  } else {
    ElMessage.warning('请添加至少两张业务图层')
  }
}
// 地图打印
const handlePrintMap = async () => {
  const view = store.getters._getDefaultMapView
  const printTask = new PrintTask({
    url: PrintingServer
  })

  const template = new PrintTemplate({
    format: 'pdf',
    exportOptions: {
      dpi: 100
    },
    layout: 'a4-portrait',
    layoutOptions: {
      titleText: '地图出图demo',
      authorText: 'X北辰北',
      customTextElements: [{ location: '四川省 成都市' }, { date: '08/11/2021, 08:20:20 AM' }]
    }
  })

  const params = new PrintParameters({
    view: view,
    template: template
  })

  printTask.execute(params).then((printResult:any) => {
    if (printResult.url) window.open(printResult.url)
  })
    .catch((printError) => {
      if (printError) ElMessage.error('地图打印失败')
    })
}
// 开启图层弹窗
const openMapPopup = () => {
  const view = store.getters._getDefaultMapView
  const resultLayer = view.map.findLayerById('layerid')
  if (resultLayer) {
    // Get the screen point from the view's click event
    view.on('click', function (event:MouseEvent) {
      view.hitTest(event).then(function (response:any) {
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
// 清屏
const handleClearMap = () => {
  const view = store.getters._getDefaultMapView
  const resultLayer1 = view.map.findLayerById('swipeLayerTop')
  const resultLayer2 = view.map.findLayerById('swipeLayerBottom')
  const resultLayer3 = view.map.findLayerById('layerid')
  const resultLayer4 = view.map.findLayerById('measurementGraphicLayer')
  if (resultLayer1) view.map.remove(resultLayer1)
  if (resultLayer2) view.map.remove(resultLayer2)
  if (resultLayer3) view.map.remove(resultLayer3)
  if (resultLayer4) view.map.remove(resultLayer4)
  if (swipe) swipe.destroy()
  if (measurementWidget) measurementWidget.destroy()
}
onMounted(() => {
  const checkView = setInterval(() => {
    if (store.getters._getDefaultMapView) {
      _initSketchTool()
      clearInterval(checkView)
    }
  }, 200)
})
</script>

<style>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: black;
    font-size: 15px;
    cursor: pointer;
}
.maptools-item:hover {
    color: #409eff;
}
.maptools-item:first-child {
    margin-left: 0;
}
</style>
