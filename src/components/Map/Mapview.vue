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
      @click="handleViewChange"
    >
      <span>{{ viewModel }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { StreetPurplishBlueServices } from '@/utils/constans'
import useGlobal from '@/composables/useGlobal'
import { initMap } from '@/utils/arcgisMap'
const { $setView } = useGlobal(getCurrentInstance())
const viewModel = ref<'2D'|'3D'>('2D')

// elements
const mapview = ref<HTMLDivElement>()
const scaleBar = ref<HTMLDivElement>()
const zoomBar = ref<HTMLDivElement>()
const basemapToggleBar = ref<HTMLDivElement>()

// 二三维切换
const handleViewChange = ():void => {
  viewModel.value === '2D' ? initMap({ url: StreetPurplishBlueServices, mode: '3D', zoomBar: zoomBar.value, basemapToggleBar: basemapToggleBar.value, scaleBar: scaleBar.value }) : initMap({ url: StreetPurplishBlueServices, mode: '2D' })
}
onMounted(() => {
  if (mapview.value) {
    $setView(initMap({ url: StreetPurplishBlueServices, mode: '2D' }))
  }
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
    z-index: -1;
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
