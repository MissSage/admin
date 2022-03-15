<template>
  <div class="gwtj-piechart">
    <VChart ref="refChart" class="szjc-chart-content" :option="options"></VChart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
export default defineComponent({
  name: 'PieChart',
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    }
  },
  setup(props) {
    const refChart = ref<any>()
    const state = reactive<any>({
      mTime: null,
      options: {
        tooltip: {
          trigger: 'item',
          colorBy: 'series',
          formatter: '{b}<br />{d}%'
        },
        series: [
          {
            type: 'pie',
            radius: ['60%', '90%'],
            labelLine: {
              show:false,
              length: 5,
              length2: 5
            },
            label: {
              show:false,
              color: '#FFFFFF',
              fontSize: 8,
              position: 'center',
              formatter: '{b}\n{d}%'
            },
            itemStyle: {
              borderRadius: 1,
              borderColor: '#fff',
              borderWidth: 0
            },
            emphasis: {
              // label: {
              //   show: true,
              //   color: '#fff',
              //   fontSize: '10'
              // }
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
                formatter: ['{a|{c}%}', '{b|{b}}'].join('\n'),
                rich: {
                  a: {
                    // 中间字的数值样式
                    color: '#0AE79A',
                    fontSize: 20,
                    lineHeight: 30,
                    verticalAlign: 'bottom'
                  },
                  b: {
                    // 中间字的名称样式
                    color: '#fff',
                    fontSize: '40%',
                    lineHeight: 24
                  }
                }
              }
            },
            data: props.data
          }
        ]
      }
    })
    const handleAnimate = () => {
      console.log(refChart.value)

      let index = -1 //高亮所在下标
      let dataLength = state.options.series[0].data.length // 当前饼图有多少个扇形
      // 用定时器控制饼图高亮
      state.mTime = setInterval(() => {
        // 清除之前的高亮
        refChart.value &&
          refChart.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: index
          })
        index = (index + 1) % dataLength
        // 当前下标高亮
        refChart.value &&
          refChart.value.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: index
          })
        if (index > dataLength) {
          index = 0
        }
      }, 3000)
      // 鼠标划入
      refChart.value &&
        refChart.value.chart.on('mouseover', (e: any) => {
          // 停止定时器，清除之前的高亮
          clearInterval(state.mTime)
          refChart.value &&
            refChart.value.dispatchAction({
              type: 'downplay',
              seriesIndex: 0
            })
          refChart.value &&
            refChart.value.dispatchAction({
              type: 'highlight',
              seriesIndex: 0,
              dataIndex: e.dataIndex
            })
        })
      refChart.value &&
        refChart.value.chart.on('mouseout', e => {
          clearInterval(state.mTime)
          refChart.value.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: e.dataIndex
          }) //鼠标移出后先把上次的高亮取消
          state.mTime = setInterval(() => {
            // 取消高亮指定的数据图形
            if (refChart.value) {
              refChart.value.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: index % dataLength
              })
              index++
              // 高亮指定的数据图形
              refChart.value &&
                refChart.value.dispatchAction({
                  type: 'highlight',
                  seriesIndex: 0,
                  dataIndex: index % dataLength
                })
            }
          }, 3000)
        })
    }
    onMounted(() => {
      refChart.value && handleAnimate()
    })
    return {
      ...toRefs(state),
      refChart,
      handleAnimate
    }
  }
})
</script>

<style lang="scss" scoped>
.gwtj-piechart {
  width: 160px;
  height: 160px;
}
</style>
