<template>
  <div class="infoBoxContainer baseInfoBox">
    <div class="title">各园区产量情况</div>
    <div class="chartBox">
      <div ref="gardenYieldChart" class="echarts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { gardenYieldChart } from '../chartData'
export default {
  data() {
    return {}
  },
  mounted() {
    this.gardenYieldChart = echarts.init(this.$refs.gardenYieldChart)
    this.gardenYieldChart.setOption(gardenYieldChart)
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 27%;
  top: calc(62% + 90px);
  left: 16px;
  .title {
    color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    margin-bottom: 12px;
  }
  .chartBox {
    width: 100%;
    // background-color: aliceblue;
    height: 215px;
    .echarts {
      background-color: transparent;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
