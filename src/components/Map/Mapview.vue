<template>
  <div class="mapview-pannel">
    <div id="mapview" />
    <div
      id="basemapToggle"
      ref="basemapToggle"
    />
    <div
      id="scaleBar"
      ref="scaleBar"
    />
    <div
      id="zoom"
      ref="zoom"
    />
    <div
      class="view-change"
      @click="handleViewChale"
    >
      <span>{{ viewModel }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loadModules } from 'esri-loader'
import { onMounted, ref } from 'vue'
import { useStore } from '@/store'
import { options } from '@/utils/constans'
const store = useStore()
const viewModel = ref<string>('2D')
const scaleBar = ref<HTMLDivElement>()
const zoom = ref<HTMLDivElement>()
const basemapToggle = ref<HTMLDivElement>()
let toggleMapBase:any = null
let barScaleBase:any = null
let zoomBase:any = null
const _createMapView = async () => {
  basemapToggle.value && (basemapToggle.value.innerHTML = '')
  scaleBar.value && (scaleBar.value.innerHTML = '')
  zoom.value && (zoom.value.innerHTML = '')
  const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom] = await loadModules(
    [
      'esri/Map',
      'esri/views/MapView',
      'esri/Basemap',
      'esri/layers/TileLayer',
      'esri/widgets/BasemapToggle',
      'esri/widgets/ScaleBar',
      'esri/widgets/Zoom'
    ],
    options
  )

  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
        title: 'Basemap'
      })
    ],
    title: 'basemap',
    id: 'basemap'
  })

  const map = new Map({
    basemap
  })

  const mapView = new MapView({
    container: 'mapview',
    map: map,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  // 实例化底图切换控件
  toggleMapBase = new BasemapToggle({
    view: mapView,
    nextBasemap: 'hybrid',
    container: 'basemapToggle'
  })
  mapView.ui.add(toggleMapBase)

  // 实例化比例尺
  barScaleBase = new ScaleBar({
    view: mapView,
    unit: 'metric',
    container: 'scaleBar'
  })
  mapView.ui.add(barScaleBase)

  // 实例化缩放控件
  zoomBase = new Zoom({
    view: mapView,
    container: 'zoom'
  })
  mapView.ui.add(zoomBase)

  mapView.ui.components = []

  store.commit('_setDefaultMapView', mapView)
}
const _createSceneView = async () => {
  basemapToggle.value && (basemapToggle.value.innerHTML = '')
  scaleBar.value && (scaleBar.value.innerHTML = '')
  zoom.value && (zoom.value.innerHTML = '')

  const [Map, SceneView, Basemap, TileLayer] = await loadModules(
    ['esri/Map', 'esri/views/SceneView', 'esri/Basemap', 'esri/layers/TileLayer'],
    options
  )
  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
        title: 'Basemap'
      })
    ],
    title: 'basemap',
    id: 'basemap'
  })

  const map = new Map({
    basemap
  })

  const sceneView = new SceneView({
    container: 'mapview',
    map
  })

  setTimeout(() => {
    sceneView.goTo({
      zoom: 10,
      center: [104.072745, 30.663774]
    })
  }, 3000)

  sceneView.ui.components = []

  store.commit('_setDefaultMapView', sceneView)
}
// 二三维切换
const handleViewChale = () => {
  if (viewModel.value === '3D') {
    _createSceneView()
    viewModel.value = '2D'
  } else {
    _createMapView()
    viewModel.value = '3D'
  }
}
onMounted(() => {
  handleViewChale()
})
</script>

<style>
.el-main{
  margin: 0;
  padding: 0;
}
.mapview-pannel,
#mapview {
    position: relative;
    width: 100%;
    height: 100%;
}
#basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
}
#scaleBar {
    position: absolute;
    left: 15px;
    bottom: 15px;
}
#zoom {
    position: absolute;
    right: 15px;
    bottom: 100px;
}
.view-change {
    position: absolute;
    width: 32px;
    height: 32px;
    right: 15px;
    bottom: 180px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
}
.view-change span {
    line-height: 32px;
}
</style>
