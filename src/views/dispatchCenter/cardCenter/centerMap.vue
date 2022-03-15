<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="地图" /> </template>
    <div class="map-chart-container">
      <VChart ref="mapChart" class="map-chart" :option="mapOption"></VChart>
      <div class="map-legend">
        <CenterMapLegend
          v-for="(item, i) in legends"
          :key="i"
          :color="item.color"
          :title="item.title"
        />
      </div>
      <div class="map-gif-box">
        <img class="map-gif" src="~@/assets/dispatchCenterImages/1_1.gif" alt="">
      </div>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import dispatchCenterMapGeoJson from './dispatchCenterMapGeoJson.json'
import * as echarts from 'echarts'
import { defineComponent } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import CenterMapLegend from './centerMapLegend.vue'
import { mapOption } from './index'
export default defineComponent({
  name: 'CenterMap',
  components: { DispatchCard, DispatchCardHeader, CenterMapLegend },
  setup() {
    // 需要注册geo信息才能使用地图
    echarts.registerMap('beijing', dispatchCenterMapGeoJson)
    const legends = [
      {
        color: '#5092E9',
        title: '水厂'
      },
      {
        color: '#50E9B6',
        title: '供水工程'
      },
      {
        color: '#E95050',
        title: '压力监测点'
      },
      {
        color: '#E9AF50',
        title: '流量监测点'
      },
      {
        color: '#E950A4',
        title: '泵站'
      }
    ]
    return {
      mapOption,
      legends
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 1013px;
  height: 992px;
  background: url('~@/assets/dispatchCenterImages/地图背景框.png') no-repeat;
}
.map-chart-container {
  position: relative;
  .map-chart {
    width: 993px;
    height: 900px;
    margin: 0 10px 10px;
  }
  .map-legend {
    width: 150px;
    height: 170px;
    border: 1px solid #094055;
    position: absolute;
    bottom: 34px;
    left: 38px;
    padding-top: 15px;
    overflow-y: auto;
  }
  .map-gif-box{
    width:250px;
    height: 250px;
    position: absolute;
    right:0;
    bottom: 0;
    .map-gif{
      width:100%;
      height: 100%;

    }
  }
}
</style>
