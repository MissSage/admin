<template>
  <DispatchCard>
    <template #header> <DispatchCardHeader title="区域漏损分析" /> </template>
    <div class="dispatch-chart">
      <VChart class="szjc-chart-content" :option="options"></VChart>
    </div>
  </DispatchCard>
</template>

<script lang="ts">
import { hexToRgba } from '@/utils/chartUtils'
import * as echarts from 'echarts'
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import DispatchCard from './components/dispatchCard.vue'
import DispatchCardHeader from './components/dispatchCardHeader.vue'
export default defineComponent({
  name: 'CardQylsfx',
  components: { DispatchCard, DispatchCardHeader },
  setup() {
    const getData = () => {
      const data: number[] = []
      for (let i = 0; i < 12; i++) {
        data.push(Math.random() * 100)
      }
      return data
    }
    const state = reactive<{
      legend: any[]
      xAxis: any[]
    }>({
      legend: [],
      xAxis: [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
    })
    const seriesData = [
      {
        name: '区域1',
        color: '#F6C766',
        data: getData()
      },
      {
        name: '区域2',
        color: '#66F6ED',
        data: getData()
      },
      {
        name: '区域3',
        color: '#B166F6',
        data: getData()
      },
      {
        name: '区域4',
        color: '#98F666',
        data: getData()
      }
    ]
    const addSeries = () => {
      seriesData.map(item => {
        const series = {
          data: getData(),
          name: item.name,
          smooth: true,
          showSymbol: false,
          type: 'line',
          color: item.color,
          lineStyle: {
            color: hexToRgba(item.color, 0.6),
            width: 1
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: hexToRgba(item.color, 0.4)
              },
              {
                offset: 1,
                color: hexToRgba(item.color, 0)
              }
            ])
          }
        }
        state.legend.push(item.name)
        options.series.push(series)
      })
    }

    // codes here
    const options = reactive<any>({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        show: true,
        data: state.legend,
        colorBy: 'series',
        textStyle: {
          color: '#718092'
        },
        right: 40
      },
      xAxis: {
        type: 'category',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        data: state.xAxis
      },
      yAxis: {
        type: 'value',
        name: '（%）',
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: hexToRgba('#094055', 0.4)
          }
        }
      },
      series: []
    })
    onMounted(() => {
      addSeries()
    })
    return {
      ...toRefs(state),
      getData,
      addSeries,
      options
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 368px;
  background: url('~@/assets/dispatchCenterImages/漏损率／排行／报警／工单背景框.png') no-repeat;
}
.dispatch-chart {
  width: 564px;
  height: 300px;
}
</style>
