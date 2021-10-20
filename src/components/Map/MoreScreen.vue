<template>
  <div class="morescreen-view">
    <div class="morescreen-top-view">
      <div
        id="top-left"
        class="map-item"
      />
      <div
        id="top-right"
        class="map-item"
      />
    </div>
    <div class="morescreen-bottom-view">
      <div
        id="buttom-left"
        class="map-item"
      />
      <div
        id="buttom-right"
        class="map-item"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'
import { whenTrue } from '@arcgis/core/core/watchUtils'
import { streetServices } from '@/utils/constans'
onMounted(() => {
  _initMap()
})
const _initMap = () => {
  const basemap = new Basemap({
    baseLayers: [
      new TileLayer({
        url: streetServices,
        title: 'Basemap'
      })
    ],
    title: 'basemap',
    id: 'basemap'
  })

  const map01 = new Map({
    basemap
  })
  const mapView01 = new MapView({
    container: 'top-left',
    map: map01,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  const map02 = new Map({
    basemap
  })
  const mapView02 = new MapView({
    container: 'top-right',
    map: map02,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  const map03 = new Map({
    basemap
  })
  const mapView03 = new MapView({
    container: 'buttom-left',
    map: map03,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  const map04 = new Map({
    basemap
  })
  const mapView04 = new MapView({
    container: 'buttom-right',
    map: map04,
    zoom: 10,
    center: [104.072745, 30.663774]
  })

  mapView01.ui.components = []
  mapView02.ui.components = []
  mapView03.ui.components = []
  mapView04.ui.components = []

  // 地图联动
  whenTrue(mapView01, 'stationary', function () {
  // Get the new center of the view only when view is stationary.
    if (mapView01.center) {
      mapView02.goTo({
        center: [mapView01.center.longitude, mapView01.center.latitude],
        zoom: mapView01.zoom
      })
      mapView03.goTo({
        center: [mapView01.center.longitude, mapView01.center.latitude],
        zoom: mapView01.zoom
      })
      mapView04.goTo({
        center: [mapView01.center.longitude, mapView01.center.latitude],
        zoom: mapView01.zoom
      })
    }

    // Get the new extent of the view only when view is stationary.
    if (mapView01.extent) {
      console.log(
        '2',
        mapView01.extent.xmin.toFixed(2),
        mapView01.extent.xmax.toFixed(2),
        mapView01.extent.ymin.toFixed(2),
        mapView01.extent.ymax.toFixed(2)
      )
    }
  })
}
</script>

<style>
.morescreen-view {
    width: 100%;
    height: 100%;
}
.map-item {
    width: calc(50% - 2.5px);
    height: 100%;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
}
.morescreen-top-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5px;
}
.morescreen-bottom-view {
    width: 100%;
    height: calc(50% - 2.5px);
    display: flex;
    justify-content: space-between;
    margin-top: 2.5px;
}
#top-left {
    margin-right: 2.5px;
}
#top-right {
    margin-left: 2.5px;
}
#buttom-left {
    margin-right: 2.5px;
}
#buttom-right {
    margin-left: 2.5px;
}
</style>
