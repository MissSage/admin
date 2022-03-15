<template>
  <div class="infoBoxContainer baseInfoBox">
    <div class="title">农业牧渔总产值统计</div>
    <div class="countContainer">
      <div class="countBox">
        <p class="count" style="color:#508be4">{{fmoney(3504)}}<span class="unit"> 万元</span></p>
        <p class="text">农业总值</p>
      </div>
      <div class="countBox">
        <p class="count" style="color:#8bc9b8">{{fmoney(300)}}<span class="unit"> 万元</span></p>
        <p class="text">林业总值</p>
      </div>
      <div class="countBox">
        <p class="count" style="color:#62a3b7">{{fmoney(3189)}}<span class="unit"> 万元</span></p>
        <p class="text">畜牧业总值</p>
      </div>
      <div class="countBox">
        <p class="count" style="color:#6e6dc1">{{fmoney(200)}}<span class="unit"> 万元</span></p>
        <p class="text">渔业总值</p>
      </div>
    </div>
    <div class="chartBox">
      <ECharts ref="chartsBox" :options="chartOption"></ECharts>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import { grossYieldChart } from '../chartData'
export default {
  components: { ECharts },
  data() {
    return {
      chartOption: grossYieldChart
    }
  },
  methods: {
    fmoney(s, n = 0) {
      n = n > 0 && n <= 20 ? n : 0
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
      var l = s
          .split('.')[0]
          .split('')
          .reverse(),
        r = s.split('.')[1]
      let t = ''
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
      }
      let newNum = t
        .split('')
        .reverse()
        .join('')
      if (r) newNum += `.${r}`
      return newNum
    }
  }
}
</script>

<style lang="scss" scoped>
.infoBoxContainer {
  height: 35%;
  top: 90px;
  left: 16px;
  .title {
    // color: #fff;
    padding-left: 12px;
    border-left: 3px solid #3273fa;
    margin-bottom: 12px;
  }
  .countContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .countBox {
      width: 47%;
      border-radius: 5px;
      margin-bottom: 12px;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.4);
      text-align: center;
      .count {
        font-size: 20px;
        height: 28px;
        .unit {
          font-size: 12px;
        }
      }
    }
  }
  .chartBox {
    width: 100%;
    // background-color: aliceblue;
    height: 155px;
    .echarts {
      background-color: transparent;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
