<template>
  <div class="bjfx-piechart">
    <VChart ref="refChart" :option="options"></VChart>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, reactive, ref, toRefs } from 'vue'
import { IPieItem } from './index'

export default defineComponent({
  name: 'PieChart',
  props: {
    data: {
      type: Array as PropType<IPieItem[]>,
      default: () => {
        return []
      }
    }
  },
  setup(props) {
    const refChart = ref<any>()
    // codes here
    const state = reactive<any>({
      options: {
        tooltip: {
          trigger: 'item'
        },
        title: {
          text: '报警统计',
          textStyle: {
            color: '#FFFFFF',
            fontSize: 14
          },
          bottom: 0,
          right: 90
        },
        series: [
          {
            name: '报警统计',
            type: 'pie',
            radius: ['40%', '70%'],
            labelLine: {
              show: false,
              length: 5,
              length2: 5
            },
            label: {
              show: false,
              alignTo: 'edge',
              position: 'center',
              formatter: '{b}:{c} %',
              minMargin: 5,
              edgeDistance: 10,
              lineHeight: 15,
              color: '#FFFFFF',
              fontSize: 8
            },
            itemStyle: {
              borderRadius: 1,
              borderColor: '#fff',
              borderWidth: 0
            },
            emphasis: {
              // label: {
              //   show: false,
              //   color: '#fff',
              //   fontSize: '10'
              // }
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
                formatter: ['{a|{c}}', '{b|{b}}'].join('\n'),
                rich: {
                  a: {
                    // 中间字的数值样式
                    color: '#0AE79A',
                    fontSize: 32,
                    lineHeight: 40,
                    verticalAlign: 'bottom'
                  },
                  b: {
                    // 中间字的名称样式
                    color: '#fff',
                    fontSize: '60%',
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
.bjfx-piechart {
  width: 250px;
  height: 250px;
}
</style>
