<template>
  <div class="mapview-pannel">
    <div ref="mapview" class="mapview" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { StreetPurplishBlueServices } from '@/utils/constans'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'
import MapView from '@arcgis/core/views/MapView'
import Map from '@arcgis/core/Map'
const mapview = ref<HTMLDivElement>()
const state = reactive<{
  timer:any
  oldZoom:number
  newZoom:number
  oldCenter:[number, number]
  newCenter:[number, number]
}>({
  timer: null,
  oldCenter: [Math.random() * 10 + 100, Math.random() * 5 + 25],
  newCenter: [Math.random() * 10 + 100, Math.random() * 5 + 25],
  oldZoom: 5,
  newZoom: 10
})
const initMap = (container?:HTMLDivElement) => {
  const map = new Map({
    basemap: new Basemap({
      baseLayers: [
        new TileLayer({
          url: StreetPurplishBlueServices,
          title: 'Basemap'
        })
      ],
      title: 'basemap',
      id: 'basemap'
    })
  })
  const mapViewIns = new MapView({
    container,
    map: map,
    zoom: state.oldZoom,
    center: state.oldCenter
  })
  // mapViewIns.ui.components = []
  return mapViewIns
}

onMounted(() => {
  state.timer && clearInterval(state.timer)
  const mapView = initMap(mapview.value)
  state.timer = setInterval(() => {
    mapView.goTo({
      center: state.oldCenter,
      zoom: state.newZoom
    }, {
      duration: 3000
    }).then(() => {
      state.newCenter = [Math.random() * 10 + 100, Math.random() * 5 + 25]
      state.oldCenter = state.newCenter
      state.newZoom = Math.random() * 10 + 5
      state.oldZoom = state.newZoom
    })
  }, 5000)
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
    background-color: #fff;
  }
  .basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
    background-color: #fff;
  }
  .scaleBar {
    position: absolute;
    left: 15px;
    bottom: 30px;
    color: $color;
    background-color: #fff;
  }
  .zoom {
    position: absolute;
    right: 15px;
    bottom: 100px;
    color: $color;
    background-color: #fff;
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
