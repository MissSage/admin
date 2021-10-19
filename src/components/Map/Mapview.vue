<template>
  <div class="mapview-pannel">
    <div
      ref="mapview"
      class="mapview"
    />
    <div
      ref="basemapToggle"
      class="basemapToggle"
    />
    <div
      ref="scaleBar"
      class="scaleBar"
    />
    <div
      ref="zoom"
      class="zoom"
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
import { onMounted, ref } from 'vue'
// import { useStore } from '@/store'
import { streetServices } from '@/utils/constans'
import MapView from '@arcgis/core/views/MapView'
import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle'
import Zoom from '@arcgis/core/widgets/Zoom'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'

// const store = useStore()
const viewModel = ref<string>('3D')

// elements
const mapview = ref<HTMLDivElement>()
const scaleBar = ref<HTMLDivElement>()
const zoom = ref<HTMLDivElement>()
const basemapToggle = ref<HTMLDivElement>()
let toggleIns: BasemapToggle
let scaleIns: ScaleBar
let zoomIns: Zoom

const _createMapView = (el: HTMLDivElement) => {
  viewModel.value = '2D'
  basemapToggle.value && (basemapToggle.value.innerHTML = '')
  scaleBar.value && (scaleBar.value.innerHTML = '')
  zoom.value && (zoom.value.innerHTML = '')

  const map = new Map({
    basemap: new Basemap({
      baseLayers: [
        new TileLayer({
          url: streetServices,
          title: 'Basemap'
        })
      ],
      title: 'basemap',
      id: 'basemap'
    })
  })

  const mapViewIns = new MapView({
    container: mapview.value,
    map: map,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  // 实例化底图切换控件
  toggleIns = new BasemapToggle({
    view: mapViewIns,
    nextBasemap: 'hybrid',
    container: basemapToggle.value
  })
  mapViewIns.ui.add(toggleIns)

  // 实例化比例尺
  scaleIns = new ScaleBar({
    view: mapViewIns,
    unit: 'metric',
    container: scaleBar.value
  })
  mapViewIns.ui.add(scaleIns)

  // 实例化缩放控件
  zoomIns = new Zoom({
    view: mapViewIns,
    container: zoom.value
  })
  mapViewIns.ui.add(zoomIns)

  mapViewIns.ui.components = []

  // store.commit('_setDefaultMapView', mapViewIns)
}
const _createSceneView = (el: HTMLDivElement) => {
  viewModel.value = '3D'
  basemapToggle.value && (basemapToggle.value.innerHTML = '')
  scaleBar.value && (scaleBar.value.innerHTML = '')
  zoom.value && (zoom.value.innerHTML = '')

  const map = new Map({
    basemap: new Basemap({
      baseLayers: [
        new TileLayer({
          url: streetServices,
          title: 'Basemap'
        })
      ],
      title: 'basemap',
      id: 'basemap'
    })
  })

  const sceneView = new SceneView({
    container: el,
    map
  })

  setTimeout(() => {
    sceneView.goTo({
      zoom: 10,
      center: [104.072745, 30.663774]
    })
  }, 0)

  sceneView.ui.components = []

  // store.commit('_setDefaultMapView', sceneView)
}
// 二三维切换
const handleViewChale = () => {
  if (mapview.value) {
    mapview.value.innerHTML = ''
    viewModel.value === '3D'
      ? _createMapView(mapview.value)
      : _createSceneView(mapview.value)
  }
}
onMounted(() => {
  handleViewChale()
})
</script>

<style scoped lang="scss">
.mapview-pannel {
  width: 100%;
  height: 100%;
  .mapview {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
  }
  .scaleBar {
    position: absolute;
    left: 15px;
    bottom: 15px;
    color: $color;
  }
  .zoom {
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
}
</style>
