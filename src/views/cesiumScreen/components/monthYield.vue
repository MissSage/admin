<template>
  <div class="infoBoxContainer baseInfoBox">
    <div class="title">每月产量统计</div>
    <div class="chartBox">
      <ECharts ref="chartsBox" :options="chartOption"></ECharts>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import { monthYieldChart } from '../chartData'
export default {
  components: { ECharts },
  data() {
    return {
      chartOption: monthYieldChart
    }
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 27%;
  top: 90px;
  right: 16px;
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
