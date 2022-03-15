<template>
  <div class="chart-map-legend">
    <div class="chart-map-legend__icon">
      <div class="chart-map-legend__icon__outer" :style="'background-color:' + colorOuter"></div>
      <div class="chart-map-legend__icon__normal" :style="'background-color:' + colorNormal"></div>
      <div class="chart-map-legend__icon__inner" :style="'background-color:' + colorInner"></div>
    </div>
    <div class="chart-map-label">
      <span class="chart-map-label__text">{{ title }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { hexToRgba } from '@/utils/chartUtils'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CenterMapLegend',
  props: {
    title: {
      default: '',
      type: String
    },
    color: {
      type: String,
      default: '#5092E9'
    }
  },
  setup(props) {
    // codes here
    const colorOuter = hexToRgba(props.color, 0.3)
    const colorNormal = hexToRgba(props.color, 0.6)
    const colorInner = hexToRgba(props.color, 1)
    return {
      colorOuter,
      colorNormal,
      colorInner
    }
  }
})
</script>

<style lang="scss" scoped>
.chart-map-legend {
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 0 16px;
  margin-bottom: 10px;
  .chart-map-legend__icon {
    position: relative;
    width: 16px;
    height: 16px;
    margin-right: 12px;
    .chart-map-legend__icon__outer {
      width: 16px;
      height: 16px;
      border-radius: 50% 50%;
      position: absolute;
      margin: 0;
    }
    .chart-map-legend__icon__normal {
      width: 12px;
      height: 12px;
      position: absolute;
      border-radius: 50% 50%;
      margin: 2px;
    }
    .chart-map-legend__icon__inner {
      width: 6px;
      height: 6px;
      position: absolute;
      border-radius: 50% 50%;
      margin: 5px;
    }
  }

  .chart-map-label {
    flex: 1;
    .chart-map-label__text {
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #718092;
      line-height: 17px;
      letter-spacing: 3px;
    }
  }
}
</style>
